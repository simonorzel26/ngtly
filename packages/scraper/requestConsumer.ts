import { type QueuedRequest, isQueuedRequest } from "@shared";
import { EQueue } from "@shared";
import * as amqp from "amqplib";
import type { Message } from "amqplib/properties";
import { createRequest } from "./src/dbscraper";

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
				const parsedMessage: QueuedRequest = JSON.parse(messageContent);

				const valid = isQueuedRequest(parsedMessage);

				if (!valid) {
					console.error("Invalid message received, ignoring.");
					channel.ack(message);
					return;
				}

				const promptResponse = await fetch(
					`${parsedMessage.promptEndpoint}?secret=${process.env.SECRET}`,
				).catch((error) => {
					console.error("Error fetching prompt:", (error as Error).message);
					channel.ack(message);
					return;
				});

				if (!promptResponse) {
					console.log("No prompt received, ignoring.");
					channel.ack(message);
					return;
				}

				// Parse the JSON response
				const promptData = await promptResponse.json().catch((error) => {
					console.error("Error parsing JSON:", (error as Error).message);
					channel.ack(message);
					return;
				});

				if (!promptData) {
					console.log("Invalid JSON received, ignoring.");
					channel.ack(message);
					return;
				}

				const request = await createRequest({
					...parsedMessage,
					prompt: promptData.prompt,
					zod: promptData.zod,
				}).catch((error) => {
					console.error("Error creating request:", (error as Error).message);
					channel.ack(message);
					return;
				});

				if (!request) {
					console.log("Request creation failed, ignoring.");
					channel.ack(message);
					return;
				}

				if (!request) {
					console.error("Error creating request, ignoring.");
					channel.ack(message);
					return;
				}

				const queuedRequestWithPrompt = { dbId: request.id };

				channel.sendToQueue(
					EQueue.SCRAPER_QUEUE,
					Buffer.from(JSON.stringify(queuedRequestWithPrompt)),
					{ persistent: true },
				);

				// Acknowledge the message (remove it from the queue)
				channel.ack(message);
			} else {
				// No message received, consider closing puppeteer
				console.log("No message received, closing Puppeteer.");
			}
		},
		{ noAck: false },
	); // Ensure messages are acknowledged after processing
};

// Start consuming messages
const startConsuming = async (): Promise<void> => {
	try {
		const channel = await connectToRabbitMQ();
		const queueName = EQueue.REQUEST_QUEUE;
		await assertQueue(channel, queueName);
		await consumeMessages(channel, queueName);
	} catch (error) {
		console.error("Error during consuming messages:", (error as Error).message);
	}
};

await startConsuming().catch(async (error) => {
	console.error("Initialization error:", error.message);
});
