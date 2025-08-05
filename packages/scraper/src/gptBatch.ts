import { scraperPrompt } from "@shared";
import { File } from "node-fetch";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import type { GetManyRequestsByIdReturnType } from "./dbscraper";

// Define the structure of the batch request
interface BatchRequest {
	custom_id: string;
	method: string;
	url: string;
	body: {
		model: string;
		messages: Array<{ role: string; content: string }>;
	};
}

// Define the structure of the file object returned by OpenAI
interface FileObject {
	id: string;
	purpose: string;
	filename: string;
	bytes: number;
	created_at: number;
	status: string;
	status_details?: string | undefined;
}

// Define the OpenAI client initialization
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // replace with your actual API key
	timeout: 120000, // Set timeout to 60 seconds
});

// Prepare the batch data in-memory and upload directly
async function prepareAndUploadBatchFile(
	batchRequests: BatchRequest[],
): Promise<string> {
	try {
		console.log(`Preparing batch file with ${batchRequests.length} requests`);
		const batchData = batchRequests
			.map((req) => `${JSON.stringify(req)}\n`)
			.join("");

		const buffer = Buffer.from(batchData, "utf-8");

		console.log(`Created batch file with ${batchRequests.length} requests`);
		// Create a File object from the buffer
		const file = new File([buffer], `batch-${Date.now()}.txt`, {
			type: "text/plain",
		});

		return await uploadBatchFile(file);
	} catch (error) {
		console.error("Error in prepareAndUploadBatchFile:", error);
		throw error;
	}
}

// Upload the batch file and return the file ID
async function uploadBatchFile(file: File): Promise<string> {
	try {
		console.log(`Uploading batch file ${file.name}`);
		const fileObject: FileObject = await openai.files.create({
			file: file,
			purpose: "batch",
		});
		return fileObject.id;
	} catch (error) {
		console.error("Error in uploadBatchFile:", error);
		throw error;
	}
}

// Create a batch and return the batch ID
async function createBatch(inputFileId: string): Promise<string> {
	try {
		console.log(`Creating batch with input file ID ${inputFileId}`);
		const batch: OpenAI.Batch = await openai.batches.create({
			input_file_id: inputFileId,
			endpoint: "/v1/chat/completions",
			completion_window: "24h",
		});
		return batch.id;
	} catch (error) {
		console.error("Error in createBatch:", error);
		throw error;
	}
}

export const createBatchFromRequests = async (
	requests: GetManyRequestsByIdReturnType,
): Promise<string> => {
	try {
		const batchRequests: BatchRequest[] = requests.map((request) => {
			return {
				custom_id: request.internalId,
				method: "POST",
				url: "/v1/chat/completions",
				body: {
					model: process.env.GPT_MODEL as string,
					response_format: request.zod,
					messages: [
						{
							role: "system",
							content: scraperPrompt,
						},
						{
							role: "user",
							content: `${request.prompt}\n\n${request?.Html?.html}`,
						},
					],
				},
			};
		});

		const inputFileId = await prepareAndUploadBatchFile(batchRequests);

		const batchId: string = await createBatch(inputFileId);
		console.log(`Batch created with ID ${batchId}`);

		return batchId;
	} catch (error) {
		console.error("Error in createBatchFromRequests:", error);
		throw error;
	}
};
