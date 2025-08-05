import { db } from "@ngtly/db";
import { imagePrompt } from "@shared";
import { type NextRequest, NextResponse } from "next/server";
import { checkGETSecret } from "../../../../../../utils/apiAuth";

// Disable caching for this route
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(
	request: NextRequest,
	{ params }: { params: { eventId: string } },
) {
	// Check if the secret is correct
	const unauthorized = await checkGETSecret(request);

	if (unauthorized) {
		return unauthorized;
	}

	const { eventId } = params;

	if (!eventId) {
		return NextResponse.json(
			{
				error: "No eventId provided",
			},
			{
				status: 400,
			},
		);
	}

	const event = await db.event.findUnique({
		where: {
			id: eventId,
		},
	});

	if (!event) {
		return NextResponse.json(
			{
				error: "No event found",
			},
			{
				status: 404,
			},
		);
	}

	return NextResponse.json(imagePrompt(event.name, event.clubName), {
		status: 200,
	});
}
