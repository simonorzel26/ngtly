import { db } from "@ngtly/db";
import type { City, Club, Event, Prisma } from "@prisma/ngtlyClient";
import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { z } from "zod";
import type { processedEvent } from "../../../../../../../shared";
import { checkGETSecret } from "../../../../../utils/apiAuth";

// Disable caching for this route
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

const openai = new OpenAI();
interface GPTResponse {
	response: {
		response: {
			body: {
				choices: {
					message: {
						content: string;
					};
				}[];
			};
		};
		custom_id: string;
		error?: boolean;
	};
}

type ProcessedEvent = z.infer<typeof processedEvent>;

type EventCreationType = Prisma.EventCreateInput;

async function processEvents(
	returnedSchema: string,
	url: string,
	club: Club & { city: City },
): Promise<EventCreationType[] | null> {
	// Check if the response is a valid JSON object
	if (!returnedSchema) {
		throw new Error("Invalid JSON object");
	}

	try {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const parsedEventsJson: any = JSON.parse(returnedSchema);

		if (!parsedEventsJson) return null;

		let eventsObj: ProcessedEvent[] | null = null;

		if (Array.isArray(parsedEventsJson)) {
			if (parsedEventsJson[0].shortEventDescriptionInEnglish) {
				eventsObj = parsedEventsJson as ProcessedEvent[];
			}
		} else if (typeof parsedEventsJson === "object") {
			if (parsedEventsJson.shortEventDescriptionInEnglish) {
				eventsObj = [parsedEventsJson] as ProcessedEvent[];
			} else if (
				parsedEventsJson.events &&
				parsedEventsJson.events.length > 0
			) {
				eventsObj = parsedEventsJson.events as ProcessedEvent[];
			}
		} else {
			return null;
		}

		if (!eventsObj || !Array.isArray(eventsObj)) {
			return null;
		}

		const events = eventsObj.map((event: ProcessedEvent) => {
			try {
				let year = event.eventDate; // Example year
				const parsedYear = Number.parseInt(year.substring(0, 4)); // Extract the year from the string and parse it as an integer
				if (parsedYear < 2025) {
					year = year.replace(parsedYear.toString(), "2025");
				}

				const processedEvent: EventCreationType = {
					entryPrice: event.entryPriceInEuros || 0,
					musicTypesEnglish: event.musicGenresInEnglish || [],
					eventTypesEnglish: event.eventTypesInEnglish || [],
					partyTypesEnglish: event.partyTypesInEnglish || [],
					artists: event.performingArtists || [],
					shortEnglishDescription: event.shortEventDescriptionInEnglish || "",
					longEnglishDescription: event.longEventDescriptionInEnglish || "",
					organizers: event.eventOrganizers || [],
					eventStartTime: event.eventStartTime || "",
					city: club.city.name,
					url: url,
					ticketsUrl: event.ticketsUrl || "",
					eventCaniconalUrl: event.eventCaniconalUrl || "",
					eventDate: year.slice(0, 10),
					clubName: club.name,
					eventImage: event.eventImageUrl || "",
					name: event.eventName,
				};

				return processedEvent;
			} catch (error) {
				console.error("Could not format event data:", error);
				throw new Error("Failed to format event data");
			}
		});

		return events;
	} catch (error) {
		console.error("Could not parse JSON:", error);
	}
	return null;
}

// const insertEvents = async (events: any) => {
// 	await db.event
// 		.createMany({
// 			data: events,
// 			skipDuplicates: true,
// 		})
// 		.catch((error) => {
// 			console.error("Error inserting events:", (error as Error).message);
// 			throw new Error("Error inserting events");
// 		});
// };

export async function GET(request: NextRequest) {
	// Check if the secret is correct
	const unauthorized = await checkGETSecret(request);

	if (unauthorized) {
		return unauthorized;
	}

	const batchAwaiter = await db.batchAwaiter
		.findMany({
			where: {
				batchStatus: "in_progress",
			},
		})
		.catch((error) => {
			console.error("Error finding batchAwaiter:", (error as Error).message);
			throw new Error("Error finding batchAwaiter");
		});

	for (const batch of batchAwaiter) {
		try {
			const batchStatus = await openai.batches.retrieve(batch.batchId);
			if (!batchStatus) {
				console.error(
					`Error retrieving batch status for batch ID ${batch.batchId}`,
				);
				continue;
			}

			switch (batchStatus.status) {
				case "validating":
					console.log(`Batch is being validated: ${batchStatus}`);
					break;
				case "failed":
					console.error(`Batch failed validation: ${batchStatus}`);
					await db.batchAwaiter.update({
						where: { id: batch.id },
						data: { batchStatus: batchStatus.status },
					});
					break;
				case "in_progress":
					console.log(`Batch is in progress: ${batchStatus}`);
					break;
				case "finalizing":
					console.log(`Batch is finalizing: ${batchStatus}`);
					break;
				case "completed":
					try {
						console.log(
							`Batch completed and results are ready: ${batchStatus}`,
						);

						if (!batchStatus.output_file_id) {
							console.error("No output file ID found in batch status");
							break;
						}

						const fileResponse = await openai.files.content(
							batchStatus.output_file_id,
						);

						// Convert the response to text
						const fileContent = await fileResponse.text();

						// Assuming the content is in JSONL format, split it into individual JSON objects
						const results = fileContent
							.split("\n")
							.filter((line) => line.trim())
							.map((line) => JSON.parse(line));

						// Write each result to the database

						await db.gptResponse
							.createMany({
								data: results.map((result) => {
									return {
										response: result,
									};
								}),
							})
							.catch((error) => {
								console.error(
									"Error creating GPT response:",
									(error as Error).message,
								);
							});

						await db.batchAwaiter
							.update({
								where: {
									id: batch.id,
								},
								data: {
									batchStatus: batchStatus.status,
								},
							})
							.catch((error) => {
								console.error(
									"Error updating batchAwaiter:",
									(error as Error).message,
								);
							});
					} catch (error) {
						if (error instanceof OpenAI.APIError && error.status === 404) {
							console.error(
								`Batch with ID ${batch.batchId} not found (404). Marking as failed.`,
							);
							await db.batchAwaiter.update({
								where: { id: batch.id },
								data: { batchStatus: batchStatus.status },
							});
						}
						console.error(
							"Error processing completed batch:",
							(error as Error).message,
						);
					}
					break;
				case "expired":
					console.error(`Batch expired: ${batchStatus}`);
					await db.batchAwaiter.update({
						where: { id: batch.id },
						data: { batchStatus: batchStatus.status },
					});
					break;
				case "cancelling":
					console.log(`Batch is being cancelled: ${batchStatus}`);
					break;
				case "cancelled":
					console.error(`Batch was cancelled: ${batchStatus}`);
					await db.batchAwaiter.update({
						where: { id: batch.id },
						data: { batchStatus: batchStatus.status },
					});
					break;
				default:
					console.log(`Unknown batch status: ${batchStatus}`);
					break;
			}
		} catch (error) {
			if (error instanceof OpenAI.APIError && error.status === 404) {
				console.error(
					`Batch with ID ${batch.batchId} not found (404). Marking as failed.`,
				);
				await db.batchAwaiter.update({
					where: { id: batch.id },
					data: { batchStatus: "failed" },
				});
			} else {
				console.error(
					`An unexpected error occurred for batch ID ${batch.batchId}:`,
					(error as Error).message,
				);
			}
		}
	}

	console.log("Processing GPT responses");
	const gptResponses = await db.gptResponse.findMany({
		where: {
			valid: true,
			inserted: false,
		},
	});
	if (!gptResponses || gptResponses.length === 0) {
		console.error("No GPT responses found");
	}
	for (const gptResponse of gptResponses) {
		const response = gptResponse.response as unknown as GPTResponse["response"];
		const content = response.response?.body.choices[0]?.message?.content;
		const customId = response.custom_id;
		const completed = !response.error;
		if (!content || !customId || !completed) {
			console.error("Invalid GPT response");
			await db.gptResponse.update({
				where: {
					id: gptResponse.id,
				},
				data: {
					valid: false,
				},
			});
			continue;
		}

		const club = await db.club.findUnique({
			where: {
				id: customId,
			},
			include: {
				city: true,
			},
		});

		if (!club) {
			console.error(`Club with ID ${customId} not found`);
			continue;
		}

		const events = await processEvents(content, club.id, club);

		if (!events) {
			console.error("No events found");
			await db.gptResponse.update({
				where: {
					id: gptResponse.id,
				},
				data: {
					valid: false,
				},
			});
			continue;
		}

		let lastDate = new Date();

		for (const event of events) {
			try {
				const eventDate = new Date(event.eventDate);
				if (eventDate > lastDate) {
					lastDate = eventDate;
				}
			} catch (error) {
				console.error("Error parsing event date:", (error as Error).message);
			}

			try {
				await db.event.create({
					data: {
						...event,
						club: {
							connect: {
								id: club.id,
							},
						},
					},
				});
			} catch (error) {
				console.error("Error inserting event:", (error as Error).message);
			}
		}

		await db.club.update({
			where: {
				id: club.id,
			},
			data: {
				furthestEventDate: lastDate.toISOString().slice(0, 10),
			},
		});

		await db.gptResponse.update({
			where: {
				id: gptResponse.id,
			},
			data: {
				inserted: true,
			},
		});

		console.log("Events inserted successfully");
	}

	return NextResponse.json(batchAwaiter, {
		status: 200,
	});
}
