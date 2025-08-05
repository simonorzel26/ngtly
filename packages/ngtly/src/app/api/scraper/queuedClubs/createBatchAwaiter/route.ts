import { db } from "@ngtly/db";
import { type NextRequest, NextResponse } from "next/server";
import { checkGETSecret } from "../../../../../utils/apiAuth";

// Disable caching for this route
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function GET(request: NextRequest) {
	// Check if the secret is correct
	const unauthorized = await checkGETSecret(request);

	if (unauthorized) {
		return unauthorized;
	}

	const batchId = request.nextUrl.searchParams.get("batchId");

	if (!batchId) {
		return NextResponse.json({
			status: 400,
			message: "Missing batchId",
		});
	}

	const batchAwaiter = await db.batchAwaiter
		.create({
			data: {
				batchId,
				batchStatus: "in_progress",
			},
		})
		.catch((error) => {
			console.error("Error creating batchAwaiter:", (error as Error).message);
			throw new Error("Error creating batchAwaiter");
		});

	return NextResponse.json(batchAwaiter, {
		status: 200,
	});
}
