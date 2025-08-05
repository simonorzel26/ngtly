import type { Prisma } from "@prisma/scraperClient";
import { z } from "zod";
import { dbscraper } from "../dbscraper";

// Zod Schemas
const requestSchema = z.object({
	internalId: z.string(),
	promptVersion: z.string(),
	zod: z.any(),
	url: z.string(),
	returnEndpoint: z.string(),
	promptEndpoint: z.string(),
	prompt: z.string(),
});

const htmlSchema = z.object({
	html: z.string(),
});

const gptResponseSchema = z.object({
	response: z.any(),
	htmlId: z.string().uuid(),
});

// Types from Zod schemas
type RequestType = z.infer<typeof requestSchema>;
type HtmlType = z.infer<typeof htmlSchema>;
type GptResponseType = z.infer<typeof gptResponseSchema>;

export type FullRequest = Prisma.RequestGetPayload<{
	include: {
		Html: true;
	};
}>;

// Create Request function
export const createRequest = async (data: RequestType) => {
	// Validate data using Zod schema
	const validatedData = requestSchema.parse(data);
	// Use Prisma to create a new Request
	return await dbscraper.request.create({ data: validatedData });
};

export const updateRequest = async (
	requestId: string,
	data: Prisma.RequestUpdateInput,
) => {
	return await dbscraper.request.update({
		where: { id: requestId },
		data,
	});
};

export const getRequest = async (id: string) => {
	return await dbscraper.request.findUnique({
		where: { id },
		include: {
			Html: true,
		},
	});
};

export const getAllReadyToBatch = async (
	messages: string[],
): Promise<FullRequest[]> => {
	return await dbscraper.request.findMany({
		where: {
			id: {
				in: messages,
			},
			batchId: null,
			htmlId: {
				not: null,
			},
		},
		include: {
			Html: true,
		},
	});
};
export type GetAllReadyToBatchReturnType = Awaited<
	ReturnType<typeof getAllReadyToBatch>
>;

export const getManyRequestsById = async (
	ids: string[],
): Promise<FullRequest[]> => {
	return await dbscraper.request.findMany({
		where: {
			id: {
				in: ids,
			},
		},
		include: {
			Html: true,
		},
	});
};

export type GetManyRequestsByIdReturnType = Awaited<
	ReturnType<typeof getManyRequestsById>
>;

export const updateManyRequestsById = async (
	ids: string[],
	batchId: string,
): Promise<Prisma.BatchPayload> => {
	return await dbscraper.request.updateMany({
		where: {
			id: {
				in: ids,
			},
		},
		data: {
			batchId,
		},
	});
};

// Create Html function with relation handling
export const createHtml = async (data: HtmlType, requestId: string) => {
	// Validate data using Zod schema
	const validatedData = htmlSchema.parse(data);

	// Use Prisma to create a new Html with relation
	return await dbscraper.html.create({
		data: {
			...validatedData,
			urlScrapeRequestId: requestId,
			UrlScrapeRequest: {
				connect: { id: requestId },
			},
		},
	});
};
