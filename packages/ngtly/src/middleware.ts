import { i18nRouter } from "next-i18n-router";
import { type NextRequest, NextResponse } from "next/server";
import { generateRewriteMappings } from "./i18n/routes";
import i18nConfig from "./i18nConfig";
import { Cities } from "./utils/globalTypes";

const rewriteMappings = generateRewriteMappings(); // Compute mappings once at startup

// Get all city values from the Cities enum
const CITIES = Object.values(Cities);

export function middleware(request: NextRequest) {
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Bypass middleware for the sitemap route and homepage.
	if (pathname === "/sitemap.xml" || pathname === "/") {
		return NextResponse.next();
	}

	// Handle redirects from old routes to new structure
	const pathSegments = pathname.split("/").filter(Boolean);

	// Check for direct city access: /berlin -> allow it (remove redirect to home)
	if (pathSegments.length === 1) {
		const citySlug = pathSegments[0];
		if (citySlug && CITIES.includes(citySlug as Cities)) {
			// Allow city routes to pass through without i18n processing
			return NextResponse.next();
		}
	}

	// Check for old route patterns: /en/country/city/nightlife -> redirect to home
	if (
		pathSegments.length >= 4 &&
		(pathSegments[0] === "en" || pathSegments[0] === "de") &&
		pathSegments[3] === "nightlife"
	) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Check for old route patterns without nightlife: /en/country/city -> redirect to home
	if (
		pathSegments.length === 3 &&
		(pathSegments[0] === "en" || pathSegments[0] === "de")
	) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// For homepage and other routes, let them pass through normally
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|img|sw|manifest|marker|logo-ngtly_1024|^/img|/workbox.*$|sitemap.xml).*)",
	],
};
