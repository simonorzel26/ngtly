import {
	EQueue,
	type QueuedHtml,
	type QueuedRequestWithPrompt,
	isQueuedRequestWithPrompt,
} from "@shared";
import * as amqp from "amqplib";
import type { Message } from "amqplib/properties";
import { decode, encode } from "gpt-tokenizer/model/gpt-4o";
import type { Page } from "puppeteer";
import { createHtml, getRequest } from "./src/dbscraper";
import { cleanExtractedText, cleanHtml } from "./src/processEvent";
import {
	closePuppeteer,
	navigateToPage,
	puppeteerInstance,
} from "./src/puppeteer";

const { page, browser } = await puppeteerInstance();

const rabbitMqUrl = process.env.RABBIT_MQ_URL;

if (!rabbitMqUrl) {
	throw new Error("RABBIT_MQ_URL is not defined in environment variables");
}

// Connect to RabbitMQ server
const connectToRabbitMQ = async (): Promise<amqp.Channel> => {
	const connection = await amqp.connect(rabbitMqUrl);
	return connection.createChannel();
};

// Ensure the queue exists, otherwise create it (non-durable)
const assertQueue = async (
	channel: amqp.Channel,
	queueName: string,
): Promise<void> => {
	await channel.assertQueue(queueName, { durable: false });
	await channel.prefetch(1);
};

const consumeMessages = async (
	channel: amqp.Channel,
	queueName: string,
	page: Page,
): Promise<void> => {
	console.log(
		`Consumer connected to RabbitMQ. Waiting for messages in ${queueName}.`,
	);

	await channel.consume(
		queueName,
		async (message: Message | null) => {
			if (message !== null) {
				// Process the message
				const messageContent = message.content.toString();
				console.log(`Received message: ${messageContent}`);
				const parsedMessage: QueuedRequestWithPrompt =
					JSON.parse(messageContent);

				const valid = isQueuedRequestWithPrompt(parsedMessage);

				if (!valid) {
					console.error("Invalid message received, ignoring.");
					return;
				}

				const request = await getRequest(parsedMessage.dbId).catch((error) => {
					console.error("Error fetching request:", error.message);
					return;
				});

				if (!request) {
					console.error("Request not found, ignoring.");
					return;
				}

				const html = await navigateToPage(page, request.url).catch((error) => {
					console.error("Error navigating to page:", error.message);
					return;
				});

				if (!html) {
					console.error("Failed to fetch HTML content, ignoring.");
					channel.ack(message);
					return;
				}

				let cleanedHtml = cleanExtractedText(cleanHtml(html));
				const tokens = encode(cleanedHtml);
				const clippedTokens = tokens.slice(0, 125000);
				cleanedHtml = decode(clippedTokens);

				const htmlDbItem = await createHtml(
					{ html: cleanedHtml },
					request.id,
				).catch((error) => {
					console.error("Error creating request:", error.message);
					return;
				});

				if (!htmlDbItem) {
					console.error("Error creating HTML, ignoring.");
					return;
				}

				const queuedHtml: QueuedHtml = { dbId: request.id };

				channel.sendToQueue(
					EQueue.HTML_QUEUE,
					Buffer.from(JSON.stringify(queuedHtml)),
					{ persistent: true },
				);

				// Acknowledge the message (remove it from the queue)
				channel.ack(message);
			} else {
				// No message received, consider closing puppeteer
				console.log("No message received, closing Puppeteer.");
				await closePuppeteer(browser);
			}
		},
		{ noAck: false },
	); // Ensure messages are acknowledged after processing
};

// Start consuming messages
const startConsuming = async (): Promise<void> => {
	try {
		const channel = await connectToRabbitMQ();
		const queueName = EQueue.SCRAPER_QUEUE;
		await assertQueue(channel, queueName);
		await consumeMessages(channel, queueName, page);
	} catch (error) {
		console.error("Error during consuming messages:", (error as Error).message);
		await closePuppeteer(browser); // Ensure Puppeteer is closed in case of an error
	}
};

await startConsuming().catch(async (error) => {
	console.error("Initialization error:", error.message);
	await closePuppeteer(browser); // Ensure Puppeteer is closed in case of an initialization error
});
