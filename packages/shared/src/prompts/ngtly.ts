import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const returnSchemaExample = {
	eventDate: "2025-06-15",
	eventStartTime: "20:00",
	name: "Summer Beats Festival",
	entryPrice: 50,
	musicTypesEnglish: ["Electronic", "House"],
	eventTypesEnglish: ["Festival"],
	partyTypesEnglish: ["Outdoor"],
	artists: ["DJ Example", "MC Sample"],
	shortEnglishDescription:
		"A vibrant summer festival featuring top electronic music artists.",
	organizers: ["Event Co"],
	imageUrl: "https://example.com/image.jpg",
};

const prompt = (exampleOutput: unknown) =>
	`You are an expert in extracting nightlife event information from HTML. Extract the event data and format it into a JSON object using the following schema:
	Ensure the extracted data is accurate, up-to-date, and the image URL corresponds to the correct event.  Be verbose but coherant and concise in the event explaination and describing the event/club location in the descriptions.
	Provide the output strictly in JSON format.`;

export const ngtlyPrompt = prompt(returnSchemaExample);

export const processedEvent = z.object({
	eventDate: z.string().describe("The date of the event in ISO 8601 format"),
	eventStartTime: z
		.string()
		.describe("The start time of the event in HH:MM format"),
	eventName: z.string().describe("The name of the event"),
	entryPriceInEuros: z
		.number()
		.int()
		.describe(
			"The entry price of the event in euros, represented as an integer",
		),
	musicGenresInEnglish: z
		.array(z.string())
		.describe("An array of music genres in English"),
	eventTypesInEnglish: z
		.array(z.string())
		.describe("An array of event types in English"),
	partyTypesInEnglish: z
		.array(z.string())
		.describe("An array of party types in English"),
	performingArtists: z
		.array(z.string())
		.describe("An array of artist names performing at the event"),
	shortEventDescriptionInEnglish: z
		.string()
		.describe(
			"A short and reduced description of the event and club in English, translate it to english",
		),
	longEventDescriptionInEnglish: z
		.string()
		.describe(
			"A long description of the event and club with all related information in English, do not summarize it and translate it to english",
		),
	eventOrganizers: z.array(z.string()).describe("An array of organizer names"),
	eventImageUrl: z.string().describe("The URL of the event image"),
	ticketsUrl: z.string().describe("The URL of the tickets").optional(),
	eventCaniconalUrl: z
		.string()
		.describe("The URL of the event canonical page")
		.optional(),
});

const nightlifeEventSchema = z.object({ events: z.array(processedEvent) });

export const zodResponse = zodResponseFormat(
	nightlifeEventSchema,
	"event_list",
);

export default nightlifeEventSchema;

export const imagePrompt = (EVENT_NAME: string, CLUB_NAME: string) =>
	`Create a modern, minimalistic Instagram square post image for a nightlife event inspired by
	${EVENT_NAME} at ${CLUB_NAME}. The design should use a realistic photo style, emphasizing a
	welcoming, and vibrant nightlife/nightclub party atmosphere. Incorporate visual elements that subtly represent the event name
	and club's identity and vibe without adding text. The color scheme should include lime green (#a0df3c) and grey (#1e1e1e)
	to evoke a futuristic nightlife vibe. Use sleek, modern imagery to convey energy and sophistication,
	reflecting the essence of ${EVENT_NAME} and ${CLUB_NAME}.  Avoid writing any text on the image itself,
	as the image should be used as a visual representation of the event.`;

// export const imagePrompt = (EVENT_NAME: string, CLUB_NAME: string) =>
// 	`Render/create me a modern and minimalistic Instagram square post image for a nightlife event called
// 	${EVENT_NAME} at ${CLUB_NAME}. The design should have a realistic photo style, emphasizing a sophisticated,
// 	welcoming and vibrant nightlife atmosphere. It should have objects that represent the event name.  Use a color
// 	scheme with lime green (#a0df3c) and grey (#1e1e1e) to create a futuristic look.  Ensure the text is bold and
// 	clear, with ${EVENT_NAME} as the most prominent element. Include ${CLUB_NAME} in a smaller, yet noticeable,
// 	font. And at the bottom right corner write "ngtly.com" clearly for branding.  Use a modern font like Montserrat
// 	for a sleek appearance. The event text should be integrated seamlessly into the photo background.`;

export const promptVersion = "1.0.0";
