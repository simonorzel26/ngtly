import { ngtlyPrompt, zodResponse } from "@shared";
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

	return NextResponse.json(
		{ prompt: ngtlyPrompt, zod: zodResponse },
		{
			status: 200,
		},
	);
}
