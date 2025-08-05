import { type QueuedImageResponse, isQueuedImageResponse } from "@shared";
import { EQueue } from "@shared";
import * as amqp from "amqplib";
import type { Message } from "amqplib/properties";
import { createEventImage } from "./src/createEventImage";
import { createRequest } from "./src/dbscraper";
import { uploadImageToS3 } from "./src/uploadS3Image";

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
				const parsedMessage: QueuedImageResponse = JSON.parse(messageContent);

				const valid = isQueuedImageResponse(parsedMessage);

				if (!valid) {
					console.error("Invalid message received, ignoring.");
					channel.ack(message);
					return;
				}

				const prompt = await fetch(
					`${parsedMessage.promptEndpoint}/${parsedMessage.internalId}?secret=${process.env.SECRET}`,
				).catch((error) => {
					console.error("Error fetching prompt:", (error as Error).message);
					channel.ack(message);
					return;
				});

				if (!prompt) {
					console.log("No prompt received, ignoring.");
					channel.ack(message);
					return;
				}
				const text = await prompt.text();

				const request = await createRequest({
					...parsedMessage,
					prompt: text,
				}).catch((error) => {
					console.error("Error creating request:", (error as Error).message);
					channel.ack(message);
					return;
				});

				if (!request) {
					console.error("Error creating request, ignoring.");
					channel.ack(message);
					return;
				}

				const eventImage = await createEventImage(text).catch(
					(error: Error) => {
						console.error(
							"Error creating event image:",
							(error as Error).message,
						);
						channel.ack(message);
						return;
					},
				);

				if (!eventImage) {
					console.error("Error creating event image, ignoring.");
					channel.nack(message);
					return;
				}

				const uploadedToS3Url = await uploadImageToS3(
					eventImage,
					`event-images/${parsedMessage.internalId}.png`,
				);

				if (!uploadedToS3Url) {
					console.error("Error uploading image to S3, ignoring.");
					channel.nack(message);
					return;
				}

				await fetch(
					`${parsedMessage.returnEndpoint}/${encodeURIComponent(
						uploadedToS3Url,
					)}?secret=${process.env.SECRET}`,
				).catch((error) => {
					console.error("Error fetching prompt:", (error as Error).message);
					channel.ack(message);
					return;
				});

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
		const queueName = EQueue.IMAGE_QUEUE;
		await assertQueue(channel, queueName);
		await consumeMessages(channel, queueName);
	} catch (error) {
		console.error("Error during consuming messages:", (error as Error).message);
	}
};

await startConsuming().catch(async (error) => {
	console.error("Initialization error:", error.message);
});
