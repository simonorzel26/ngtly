import { db } from "@ngtly/db";
import type { Club } from "@prisma/ngtlyClient";
import { EQueue, type QueuedRequest, promptVersion } from "@shared";
import * as amqp from "amqplib";
import { type NextRequest, NextResponse } from "next/server";
import { checkGETSecret } from "../../../../../utils/apiAuth";

// Disable caching for this route
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(request: NextRequest) {
	console.log("trigger");
	// Check if the secret is correct
	const unauthorized = await checkGETSecret(request);

	if (unauthorized) {
		return unauthorized;
	}

	try {
		const tenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10);
		// Connect to Prisma and fetch data
		const clubsToScrape = await db.club.findMany({
			where: {
				OR: [{ lastScrapedAt: null }, { lastScrapedAt: { lt: tenDaysAgo } }],
			},
		});

		const queuedClubs: QueuedRequest[] = clubsToScrape.map((item: Club) => {
			return {
				internalId: item.id,
				url: item.url,
				promptVersion: promptVersion,
				returnEndpoint: `${process.env.NEXT_PUBLIC_PROD_DOMAIN_URL}api/scraper/club/${item.id}`,
				promptEndpoint: `${process.env.NEXT_PUBLIC_PROD_DOMAIN_URL}api/scraper/queuedClubs/prompt`,
			};
		});

		// Connect to RabbitMQ and publish messages
		await publishMessages(queuedClubs);

		await db.club.updateMany({
			where: {
				id: {
					in: clubsToScrape.map((item) => item.id),
				},
			},
			data: {
				lastScrapedAt: new Date(),
			},
		});

		return NextResponse.json(
			{ message: "Success!", data: clubsToScrape },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error handling GET request:", (error as Error).message);
		return NextResponse.json({
			message: "Error occurred",
			error: (error as Error).message,
		});
	}
}

async function publishMessages(list: QueuedRequest[]) {
	let connection: amqp.Connection | null = null;
	let channel: amqp.Channel | null = null;

	try {
		const rabbitMqUrl = process.env.RABBIT_MQ_URL;

		if (!rabbitMqUrl) {
			throw new Error("RABBIT_MQ_URL is not defined in environment variables");
		}

		// Connect to RabbitMQ server
		connection = await amqp.connect(rabbitMqUrl);
		channel = await connection.createChannel();

		// Define queue name
		const queueName = EQueue.REQUEST_QUEUE;

		// Ensure the queue exists, otherwise create it (non-durable)
		await channel.assertQueue(queueName, { durable: false });

		// Publish each item to the queue
		for (const item of list) {
			const messageContent = JSON.stringify(item);
			channel.sendToQueue(queueName, Buffer.from(messageContent), {
				persistent: true,
			});
		}
	} catch (error) {
		console.error("Publisher error:", (error as Error).message);
	} finally {
		// Ensure the channel and connection are closed
		if (channel) {
			await channel.close();
			console.log("Channel closed");
		}
		if (connection) {
			await connection.close();
			console.log("Connection closed");
		}
	}
}
