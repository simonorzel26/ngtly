import { db } from "@ngtly/db";
import { type NextRequest, NextResponse } from "next/server";
import {
	matchEventTags,
	matchMusicTags,
	preprocess,
} from "~/lib/tagger/preprocess";
import { checkGETSecret } from "../../../../../utils/apiAuth";

export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(request: NextRequest) {
	console.log("tagTrigger");

	const unauthorized = await checkGETSecret(request);
	if (unauthorized) {
		return unauthorized;
	}

	try {
		// Fetch all tags from the database
		const allEventTags = await db.eventTag.findMany();
		const allMusicTags = await db.musicTag.findMany();

		const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);

		// Fetch events needing tags
		const eventsNeedingTags = await db.event.findMany({
			where: {
				eventDate: {
					gte: yesterday.toISOString(),
				},
				OR: [
					{
						EventMusicTag: {
							none: {}, // Fetch events without any EventTag relations
						},
					},
					{
						EventEventTag: {
							none: {}, // Fetch events without any EventTag relations
						},
					},
				],
			},
		});

		// Process events and update EventTag relation
		for (const event of eventsNeedingTags) {
			const allText = `${event.name} ${event.shortEnglishDescription} ${
				event.longEnglishDescription
			} ${event.musicTypesEnglish.join(" ")} ${event.partyTypesEnglish.join(
				" ",
			)} ${event.eventTypesEnglish.join(" ")} ${event.organizers.join(
				" ",
			)} ${event.artists.join(" ")}`;
			const preprocessedInput = preprocess(allText);
			const matchedMusicTags = matchMusicTags(preprocessedInput);
			const matchedEventTags = matchEventTags(preprocessedInput);

			if (matchedMusicTags.length > 0) {
				// Get tag IDs from matchedTags and allTags
				const tagIds = matchedMusicTags
					.map((matchedTag) => {
						// Find the corresponding tag in allTags and return its id
						const foundTag = allMusicTags.find(
							(tag) => tag.name === matchedTag,
						); // Assuming tag name is unique
						return foundTag ? foundTag.id : null;
					})
					.filter((id) => id !== null) as string[];

				console.log(`Matched tags for event ${event.id}:`, tagIds);
				// Update Event record and connect or create EventTag entries
				if (!tagIds.length) return;

				await db.event.update({
					where: { id: event.id },
					data: {
						EventMusicTag: {
							connectOrCreate: tagIds.length
								? tagIds.map((tagId) => ({
										where: {
											eventId_musicTagId: {
												eventId: event.id,
												musicTagId: tagId,
											},
										},
										create: {
											musicTagId: tagId,
										},
									}))
								: undefined,
						},
					},
				});
			}

			if (matchedEventTags.length > 0) {
				// Get tag IDs from matchedTags and allTags
				const tagIds = matchedEventTags
					.map((matchedTag) => {
						// Find the corresponding tag in allTags and return its id
						const foundTag = allEventTags.find(
							(tag) => tag.name === matchedTag,
						); // Assuming tag name is unique
						return foundTag ? foundTag.id : null;
					})
					.filter((id) => id !== null) as string[];

				console.log(`Matched tags for event ${event.id}:`, tagIds);
				// Update Event record and connect or create EventTag entries
				if (!tagIds.length) return;

				await db.event.update({
					where: { id: event.id },
					data: {
						EventEventTag: {
							connectOrCreate: tagIds.length
								? tagIds.map((tagId) => ({
										where: {
											eventId_eventTagId: {
												eventId: event.id,
												eventTagId: tagId,
											},
										},
										create: {
											eventTagId: tagId,
										},
									}))
								: undefined,
						},
					},
				});
			}
		}

		return NextResponse.json(
			{ message: "Success!", data: eventsNeedingTags },
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
