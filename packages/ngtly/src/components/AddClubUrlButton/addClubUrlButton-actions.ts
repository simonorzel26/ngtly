"use server";

import type { AddClubUrlButtonProps } from ".";
import { db } from "../../../db";

export const addClubUrlButtonActions = async (
	formData: AddClubUrlButtonProps,
	city?: string,
) => {
	try {
		const potentialClubUrl = await db.potentialClubUrl.create({
			data: {
				url: formData.url,
				city: city,
			},
		});
		return potentialClubUrl;
	} catch (error) {
		console.error(error);
		return null;
	}
};
