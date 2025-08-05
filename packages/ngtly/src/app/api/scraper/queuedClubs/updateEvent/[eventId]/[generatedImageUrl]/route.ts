import { db } from "@ngtly/db";
import { type NextRequest, NextResponse } from "next/server";
import { checkGETSecret } from "../../../../../../../utils/apiAuth";

// Disable caching for this route
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(
	request: NextRequest,
	{ params }: { params: { eventId: string; generatedImageUrl: string } },
) {
	console.log("updateEvent", params);
	// Check if the secret is correct
	const unauthorized = await checkGETSecret(request);

	if (unauthorized) {
		return unauthorized;
	}

	const { eventId, generatedImageUrl } = params;

	if (!eventId || !generatedImageUrl) {
		return NextResponse.json(
			{
				error: "Missing eventId",
			},
			{
				status: 400,
			},
		);
	}

	await db.event.update({
		where: {
			id: eventId,
		},
		data: {
			generatedImage: generatedImageUrl,
			imageInQueue: false,
		},
	});

	return NextResponse.json("Success!", {
		status: 200,
	});
}
