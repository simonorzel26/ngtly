import { type NextRequest, NextResponse } from "next/server";

export const checkGETSecret = async (request: NextRequest) => {
	const secret = request.nextUrl.searchParams.get("secret");

	if (!process.env.SECRET) {
		console.error("SECRET environment variable is not defined");
		return NextResponse.json(
			{ message: "Server configuration error" },
			{ status: 500 },
		);
	}

	if (!secret || secret !== process.env.SECRET) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	return null;
};
