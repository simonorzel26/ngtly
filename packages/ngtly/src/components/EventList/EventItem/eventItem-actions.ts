"use server";

import { db } from "../../../../db";

enum Reason {
	INVALID_URL = "INVALID_URL",
	INACCURATE = "INACCURATE",
	OTHER = "OTHER",
}

export const createReportedEvent = async (eventId: string) => {
	try {
		const potentialClubUrl = await db.reportedEvent.create({
			data: {
				eventId: eventId,
				reason: Reason.OTHER,
			},
		});
		return potentialClubUrl;
	} catch (error) {
		console.error(error);
		return null;
	}
};
