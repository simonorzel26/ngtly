import type { MetadataRoute } from "next";
import {
	BaseRouteNames,
	Locale,
	baseRoutes,
	countryTranslations,
} from "~/i18n/routes";
import type { Cities, Countries } from "~/utils/globalTypes";
import isSeededCity from "~/utils/isSeededCity";

// Remove trailing slashes from the base URL.
const getBaseUrl = (): string => {
	const baseUrl = process.env.NEXT_PUBLIC_PROD_DOMAIN_URL || "";
	return baseUrl.replace(/\/+$/, "");
};

// Escape XML special characters so that the generated XML is valid.
function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now: Date = new Date();
	const baseUrl = getBaseUrl();

	// Initialize sitemap with the homepage.
	const allSites: MetadataRoute.Sitemap = [
		{
			url: escapeXml(baseUrl),
			lastModified: now,
			changeFrequency: "daily",
		},
		{
			url: `${escapeXml(baseUrl)}/sitemap.xml`,
			lastModified: now,
			changeFrequency: "daily",
		},
		{
			url: `${escapeXml(baseUrl)}/de`,
			lastModified: now,
			changeFrequency: "daily",
		},
		{
			url: `${escapeXml(baseUrl)}/en`,
			lastModified: now,
			changeFrequency: "daily",
		},
		{
			url: `${escapeXml(baseUrl)}/en/${BaseRouteNames.TERMS_OF_SERVICE}`,
			lastModified: now,
			changeFrequency: "yearly",
		},
		{
			url: `${escapeXml(baseUrl)}/en/${BaseRouteNames.COOKIE_POLICY}`,
			lastModified: now,
			changeFrequency: "yearly",
		},
		{
			url: `${escapeXml(baseUrl)}/en/${BaseRouteNames.PRIVACY_POLICY}`,
			lastModified: now,
			changeFrequency: "yearly",
		},
	];

	// Define supported locales.
	const supportedLocales: Locale[] = [Locale.EN, Locale.DE];

	// Loop through each country in the city translations.
	for (const countryKey in countryTranslations) {
		const countryData = countryTranslations[countryKey as Countries];
		if (!countryData?.cities) continue;

		// Loop through each city.
		for (const cityKey in countryData.cities) {
			const cityTrans = countryData.cities[cityKey as Cities];
			// Get the English value to determine if the city is seeded.
			const cityEn: string | undefined = cityTrans?.[Locale.EN];
			if (!cityEn || cityEn === "unknown" || !isSeededCity(cityEn)) continue;

			// Only seeded cities get a high priority and daily update frequency.
			const priority = 1;
			const changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] =
				"daily";

			// Generate a URL for each supported locale.
			for (const locale of supportedLocales) {
				const countryTranslated = countryData[locale];
				const cityTranslated = cityTrans?.[locale];
				const nightlifeTranslated =
					baseRoutes[BaseRouteNames.NIGHTLIFE]?.[locale];
				if (!countryTranslated || !cityTranslated || !nightlifeTranslated)
					continue;

				const url = `${baseUrl}/${locale}/${countryTranslated}/${cityTranslated}/${nightlifeTranslated}`;
				allSites.push({
					url: escapeXml(url),
					lastModified: now,
					changeFrequency,
					priority,
				});
			}
		}
	}

	return allSites;
}
