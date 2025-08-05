import type { Event } from "@prisma/ngtlyClient";

/**
 * Helper function to get music type options from events
 */
export const getMusicTypeOptions = (events: Event[]) => {
	const musicTypes: { [key: string]: number } = events
		.flatMap((event) => event.musicTypesEnglish || [])
		.reduce((acc: { [key: string]: number }, type: string) => {
			if (!type) return acc;
			acc[type] = (acc[type] || 0) + 1;
			return acc;
		}, {});

	return Object.entries(musicTypes)
		.sort((a, b) => b[1] - a[1])
		.map(([type, count]) => ({
			id: type,
			label: type,
			count,
		}));
};

/**
 * Helper function to get event type options from events
 */
export const getEventTypeOptions = (events: Event[]) => {
	const eventTypes: { [key: string]: number } = events
		.flatMap((event) => event.eventTypesEnglish || [])
		.reduce((acc: { [key: string]: number }, type: string) => {
			if (!type) return acc;
			acc[type] = (acc[type] || 0) + 1;
			return acc;
		}, {});

	return Object.entries(eventTypes)
		.sort((a, b) => b[1] - a[1])
		.map(([type, count]) => ({
			id: type,
			label: type,
			count,
		}));
};

/**
 * Helper function to get party type options from events
 */
export const getPartyTypeOptions = (events: Event[]) => {
	const partyTypes: { [key: string]: number } = events
		.flatMap((event) => event.partyTypesEnglish || [])
		.reduce((acc: { [key: string]: number }, type: string) => {
			if (!type) return acc;
			acc[type] = (acc[type] || 0) + 1;
			return acc;
		}, {});

	return Object.entries(partyTypes)
		.sort((a, b) => b[1] - a[1])
		.map(([type, count]) => ({
			id: type,
			label: type,
			count,
		}));
};

/**
 * Helper function to get club options from events
 */
export const getClubs = (events: Event[]) => {
	const clubCounts: { [key: string]: number } = {};

	// biome-ignore lint/complexity/noForEach: becau
	events.forEach((event) => {
		if (event.clubName) {
			clubCounts[event.clubName] = (clubCounts[event.clubName] || 0) + 1;
		}
	});

	return Object.entries(clubCounts)
		.sort((a, b) => b[1] - a[1])
		.map(([clubName, count]) => ({
			id: clubName,
			label: clubName,
			count,
		}));
};
