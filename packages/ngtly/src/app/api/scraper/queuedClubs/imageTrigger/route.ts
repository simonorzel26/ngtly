import { db } from "@ngtly/db";
import type { Event } from "@prisma/ngtlyClient";
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
	console.log("imageTrigger");
	// Check if the secret is correct
	const unauthorized = await checkGETSecret(request);

	if (unauthorized) {
		return unauthorized;
	}

	try {
		const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
		const tenDaysFromYesterday = new Date(
			yesterday.getTime() + 1000 * 60 * 60 * 24 * 10,
		).toISOString();

		// Connect to Prisma and fetch data
		const eventsNeedingImage = await db.event.findMany({
			where: {
				eventDate: {
					gte: yesterday.toISOString(),
					lte: tenDaysFromYesterday,
				},
				generatedImage: null,
				imageInQueue: false,
				OR: [{ city: "cologne" }, { city: "berlin" }],
			},
		});

		const queuedEvents: QueuedRequest[] = eventsNeedingImage.map(
			(item: Event) => {
				return {
					internalId: item.id,
					url: item.url,
					promptVersion: promptVersion,
					returnEndpoint: `${process.env.NEXT_PUBLIC_PROD_DOMAIN_URL}api/scraper/queuedClubs/updateEvent/${item.id}`,
					promptEndpoint: `${process.env.NEXT_PUBLIC_PROD_DOMAIN_URL}api/scraper/queuedClubs/imagePrompt`,
				};
			},
		);

		// Connect to RabbitMQ and publish messages
		// Comment out to stop image generation
		// await publishMessages(queuedEvents);

		// await db.event.updateMany({
		// 	where: {
		// 		id: {
		// 			in: eventsNeedingImage.map((item) => item.id),
		// 		},
		// 	},
		// 	data: {
		// 		imageInQueue: true,
		// 	},
		// });

		return NextResponse.json(
			{ message: "Success!", data: eventsNeedingImage },
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
		const queueName = EQueue.IMAGE_QUEUE;

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
