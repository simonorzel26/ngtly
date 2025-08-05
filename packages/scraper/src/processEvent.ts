import * as cheerio from "cheerio";
import type OpenAI from "openai";
// import { getGptEventData } from "./getGptEventData";

interface ProcessedEvent {
	entryPrice: number;
	eventTypesEnglish: string[];
	partyTypesEnglish: string[];
	eventStartTime: string;
	artists: string[];
	shortEnglishDescription: string;
	organizers: string[];
	city: string;
	eventDate: string;
	clubName: string;
	name: string;
	eventImage: string;
	url: string;
}
export function cleanExtractedText(text: string) {
	// Placeholder for custom logic to remove headers and footers

	// Eliminate special characters and numbers (keeping spaces, alphanumeric characters, and new lines for now)
	let cleanedText = text;

	// Remove dates, snake_case words, and numbers linked by :, ., or -
	// Extended regex to include patterns like 12:00, 3.14, or 2019-2020
	// cleanedText = cleanedText.replace(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{2,4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b|\b\w+(_\w+)+\b|\b\d+[:\.-]\d+\b/g, '');

	// Initially, this step removed standalone special characters and numbers while keeping alphanumeric characters and spaces.
	// Since we want to keep punctuation, we're skipping the step that removes all non-alphanumeric characters.
	// This decision means punctuation (.,!?:; etc.) will remain in the text.

	// Split text into lines, filter out any lines that are empty or contain a single character, then join back
	cleanedText = cleanedText
		.split("\n")
		.filter((line) => line.trim().length > 1)
		.join(" ");

	// Replace unnecessary line breaks and multiple white spaces with a single space
	cleanedText = cleanedText.replace(/\s+/g, " ");

	return cleanedText;
}

export function cleanHtml(html: string) {
	const $ = cheerio.load(html);

	// Remove unnecessary tags
	$("svg, footer").remove(); // Remove specific tags
	$("script").each((_, script) => {
		const $script = $(script);
		if ($script.attr("type") !== "application/ld+json") {
			$script.remove(); // Remove non-JSON-LD scripts
		}
	});
	$("[onclick], [onload], [onmouseover]").remove(); // Remove event handlers
	$("input, select, textarea").remove(); // Remove interactive elements
	$("noscript, style, font").remove(); // Remove non-essential elements
	$("*:empty").remove(); // Remove empty elements

	// Remove all class and style attributes
	$("*")
		.removeAttr("data-*") // Remove all data attributes
		.removeAttr("class")
		.removeAttr("style")
		.removeAttr("id")
		.removeAttr("width")
		.removeAttr("height")
		.removeAttr("data-src")
		.removeAttr("data-srcset")
		.removeAttr("sizes")
		.removeAttr("srcset")
		.removeAttr("loading")
		.removeAttr("align")
		.removeAttr("color")
		.removeAttr("face")
		.removeAttr("size")
		.removeAttr("border")
		.removeAttr("cellpadding")
		.removeAttr("cellspacing")
		.removeAttr("bgcolor")
		.removeAttr("valign")
		.removeAttr("background")
		.removeAttr("bordercolor")
		.removeAttr("bordercolorlight")
		.removeAttr("bordercolordark")
		.removeAttr("clear")
		.removeAttr("nowrap")
		.removeAttr("frame")
		.removeAttr("rules")
		.removeAttr("summary")
		.removeAttr("axis")
		.removeAttr("abbr")
		.removeAttr("target")
		.removeAttr("charset");

	// Remove comments
	$("*")
		.contents()
		.filter(function () {
			return this.type === "comment";
		})
		.remove();

	const bodyContent = $("*").html();

	// Return the cleaned HTML
	return bodyContent ? bodyContent : $.html();
}

export async function processEvent(
	event: OpenAI.Chat.Completions.ChatCompletion,
	url: string,
): Promise<ProcessedEvent[] | null> {
	const possibleEventsJson = event.choices[0].message.content;
	// Check if the response is a valid JSON object
	if (!possibleEventsJson) {
		throw new Error("Invalid JSON object");
	}

	try {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const parsedEventsJson: any = JSON.parse(possibleEventsJson);

		if (!parsedEventsJson) return null;

		let eventsObj: ProcessedEvent[] | null = null;

		if (Array.isArray(parsedEventsJson)) {
			if (parsedEventsJson[0].shortEnglishDescription) {
				eventsObj = parsedEventsJson as ProcessedEvent[];
			}
		} else if (typeof parsedEventsJson === "object") {
			if (parsedEventsJson.shortEnglishDescription) {
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

		const clubData = true;
		console.log("Club data:", clubData);

		if (!clubData) return null;

		const events = eventsObj.map((event: ProcessedEvent) => {
			try {
				let year = event.eventDate; // Example year
				const parsedYear = Number.parseInt(year.substring(0, 4)); // Extract the year from the string and parse it as an integer
				if (parsedYear < 2023) {
					year = year.replace(parsedYear.toString(), "2023");
				}
				const processedEvent: ProcessedEvent = {
					entryPrice: event.entryPrice || 0,
					eventTypesEnglish: event.eventTypesEnglish || [],
					partyTypesEnglish: event.partyTypesEnglish || [],
					artists: event.artists || [],
					shortEnglishDescription: event.shortEnglishDescription || "",
					organizers: event.organizers || [],
					eventStartTime: event.eventStartTime || "",
					city: clubData?.city || "cologne",
					url: url,
					eventDate: year.slice(0, 10),
					clubName: clubData.clubName,
					eventImage: event.eventImage || "",
					name: event.name,
				};

				console.log("Formatted", processedEvent);
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
