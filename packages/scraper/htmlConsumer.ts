import { EQueue, type QueuedGptResponse, isQueuedGptResponse } from "@shared";
import * as amqp from "amqplib";
import type { Message } from "amqplib/properties";
import {
	getAllReadyToBatch,
	updateManyRequestsById,
	updateRequest,
} from "./src/dbscraper";
import { createBatchFromRequests } from "./src/gptBatch";

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
	await channel.prefetch(10);
};

const consumeMessages = async (
	channel: amqp.Channel,
	queueName: string,
): Promise<void> => {
	console.log(
		`Consumer connected to RabbitMQ. Waiting for messages in ${queueName}.`,
	);

	const allRequestIds: string[] = [];
	const messages: Message[] = [];
	let batchTimeout: ReturnType<typeof setTimeout>;

	const processBatch = async () => {
		if (allRequestIds.length === 0) {
			return; // No messages to process
		}

		console.log("Processing batch...");
		const requests = await getAllReadyToBatch(allRequestIds);

		if (!requests || requests.length === 0) {
			console.log("No requests found in the database.");
			throw new Error("No requests found in the database.");
		}

		// Create a batch from the requests
		const batchId = await createBatchFromRequests(requests).catch((error) => {
			console.log(
				"Error creating batch from requests:",
				(error as Error).message,
			);
			throw error;
		});
		console.log(`Batch created with ID ${batchId}`);

		// Update the requests with the batch ID
		await updateManyRequestsById(
			requests.map((i) => i.id),
			batchId,
		).catch((error) => {
			console.error(
				`Error updating requests with batch ID ${batchId}:`,
				(error as Error).message,
			);
		});

		await fetch(
			`${process.env.NEXT_PUBLIC_PROD_DOMAIN_URL}api/scraper/queuedClubs/createBatchAwaiter?secret=${process.env.SECRET}&batchId=${batchId}`,
			{
				method: "GET",
			},
		)
			.then((response) => {
				if (response.ok) {
					console.log(`Batch awaiter created for batch ID ${batchId}`);
				} else {
					console.error(
						`Error creating batch awaiter for batch ID ${batchId}:`,
						response.statusText,
					);
				}
			})
			.catch((error) => {
				console.error(
					`Error creating batch awaiter for batch ID ${batchId}:`,
					(error as Error).message,
				);
			});

		// Acknowledge all messages in the batch
		messages.map((message) => channel.ack(message));
		messages.length = 0; // Clear the messages array
		allRequestIds.length = 0; // Clear the request IDs array
		clearTimeout(batchTimeout); // Clear the timeout after processing
	};

	const resetBatchTimeout = () => {
		clearTimeout(batchTimeout);
		batchTimeout = setTimeout(() => {
			processBatch().catch((error) => {
				console.error("Error processing batch:", (error as Error).message);
			});
		}, 30000); // 30 seconds timeout duration
	};

	await channel.consume(
		queueName,
		async (message: Message | null) => {
			if (message !== null) {
				try {
					// Process the message
					const messageContent = message.content.toString();
					console.log(`Received message: ${messageContent}`);
					const parsedMessage: QueuedGptResponse = JSON.parse(messageContent);

					const valid = isQueuedGptResponse(parsedMessage);

					if (!valid) {
						console.error("Invalid message received, ignoring.");
						channel.nack(message);
						return;
					}

					allRequestIds.push(parsedMessage.dbId);
					messages.push(message);

					resetBatchTimeout(); // Reset the timeout whenever a message is received

					if (allRequestIds.length >= 10) {
						await processBatch().catch((error) => {
							console.error(
								"Error processing batch:",
								(error as Error).message,
							);
						});
					}
				} catch (error) {
					console.error("Error processing message:", (error as Error).message);
					channel.nack(message);
					console.log(`Nacked message: ${message.content.toString()}`);
				}
			} else {
				console.log("No message received, closing consumer.");
			}
		},
		{ noAck: false },
	);
};

// Start consuming messages and process them
const startConsuming = async (): Promise<void> => {
	const channel = await connectToRabbitMQ();
	try {
		const queueName = EQueue.HTML_QUEUE;
		await assertQueue(channel, queueName);

		await consumeMessages(channel, queueName);
	} catch (error) {
		console.error("Error during consuming messages:", (error as Error).message);
		await channel.close();
	}
};

startConsuming().catch(async (error) => {
	console.error("Initialization error:", error.message);
});
