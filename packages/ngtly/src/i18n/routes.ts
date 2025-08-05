import { Cities, Countries } from "~/utils/globalTypes";

// Define supported locales explicitly
export enum Locale {
	EN = "en",
	DE = "de",
}
export enum BaseRouteNames {
	ABOUT = "about",
	ADD_EVENT = "add-event",
	BLOG = "blog",
	BRANDING = "branding",
	CITIES = "cities",
	CLUBS = "clubs",
	CONTACT = "contact",
	COOKIE_POLICY = "cookie-policy",
	INFO = "info",
	LIBRARY = "library",
	MARKETING = "marketing",
	PAYMENT_SUCCESS = "payment-success",
	PRIVACY_POLICY = "privacy-policy",
	PROMOTE = "promote",
	TERMS_OF_SERVICE = "terms-of-service",
	NIGHTLIFE = "nightlife",
}

export type TranslationRoutes = BaseRouteNames;

export type CombinedRouteEnums = BaseRouteNames | Cities;

export const baseRoutes: Partial<
	Record<CombinedRouteEnums, { [locale in Locale]: string }>
> = {
	[BaseRouteNames.BLOG]: {
		[Locale.EN]: "blog",
		[Locale.DE]: "blog",
	},
	[BaseRouteNames.CONTACT]: {
		[Locale.EN]: "contact",
		[Locale.DE]: "kontakt",
	},
	[BaseRouteNames.COOKIE_POLICY]: {
		[Locale.EN]: "cookie-policy",
		[Locale.DE]: "cookies",
	},
	[BaseRouteNames.PAYMENT_SUCCESS]: {
		[Locale.EN]: "payment-success",
		[Locale.DE]: "zahlung-erfolgreich",
	},
	[BaseRouteNames.PRIVACY_POLICY]: {
		[Locale.EN]: "privacy-policy",
		[Locale.DE]: "datenschutzrichtlinie",
	},
	[BaseRouteNames.PROMOTE]: {
		[Locale.EN]: "promote",
		[Locale.DE]: "bewerben",
	},
	[BaseRouteNames.TERMS_OF_SERVICE]: {
		[Locale.EN]: "terms-of-service",
		[Locale.DE]: "nutzungsbedingungen",
	},
	[BaseRouteNames.NIGHTLIFE]: {
		[Locale.EN]: "nightlife",
		[Locale.DE]: "nachtleben",
	},
} as const;
export type CityTranslation = Partial<
	Record<Cities, Partial<Record<Locale, string>>>
>;

export type CountryTranslation = Partial<Record<Locale, string>> & {
	cities?: CityTranslation;
};

export const countryTranslations: Partial<
	Record<Countries, CountryTranslation>
> = {
	[Countries.GERMANY]: {
		[Locale.EN]: "germany",
		[Locale.DE]: "deutschland",
		cities: {
			[Cities.BERLIN]: { [Locale.EN]: "berlin", [Locale.DE]: "berlin" },
			[Cities.COLOGNE]: { [Locale.EN]: "cologne", [Locale.DE]: "koeln" },
			[Cities.MUNICH]: { [Locale.EN]: "munich", [Locale.DE]: "muenchen" },
			[Cities.HAMBURG]: { [Locale.EN]: "hamburg", [Locale.DE]: "hamburg" },
			[Cities.FRANKFURT]: {
				[Locale.EN]: "frankfurt",
				[Locale.DE]: "frankfurt",
			},
			[Cities.DUESSELDORF]: {
				[Locale.EN]: "duesseldorf",
				[Locale.DE]: "düsseldorf",
			},
			[Cities.NUREMBERG]: {
				[Locale.EN]: "nuremberg",
				[Locale.DE]: "nueremberg",
			},
			[Cities.DRESDEN]: { [Locale.EN]: "dresden", [Locale.DE]: "dresden" },
		},
	},
	[Countries.UNITED_KINGDOM]: {
		[Locale.EN]: "uk",
		[Locale.DE]: "uk",
		cities: {
			[Cities.LONDON]: { [Locale.EN]: "london", [Locale.DE]: "london" },
			[Cities.BIRMINGHAM]: {
				[Locale.EN]: "birmingham",
				[Locale.DE]: "birmingham",
			},
		},
	},
	[Countries.FRANCE]: {
		[Locale.EN]: "france",
		[Locale.DE]: "frankreich",
		cities: {
			[Cities.PARIS]: { [Locale.EN]: "paris", [Locale.DE]: "paris" },
		},
	},
	[Countries.SPAIN]: {
		[Locale.EN]: "spain",
		[Locale.DE]: "spanien",
		cities: {
			[Cities.MADRID]: { [Locale.EN]: "madrid", [Locale.DE]: "madrid" },
			[Cities.BARCELONA]: {
				[Locale.EN]: "barcelona",
				[Locale.DE]: "barcelona",
			},
			[Cities.SEVILLA]: { [Locale.EN]: "sevilla", [Locale.DE]: "sevilla" },
		},
	},
	[Countries.NETHERLANDS]: {
		[Locale.EN]: "netherlands",
		[Locale.DE]: "niederlande",
		cities: {
			[Cities.AMSTERDAM]: {
				[Locale.EN]: "amsterdam",
				[Locale.DE]: "amsterdam",
			},
			[Cities.ROTTERDAM]: {
				[Locale.EN]: "rotterdam",
				[Locale.DE]: "rotterdam",
			},
		},
	},
	[Countries.BELGIUM]: {
		[Locale.EN]: "belgium",
		[Locale.DE]: "belgien",
		cities: {
			[Cities.BRUSSELS]: { [Locale.EN]: "brussels", [Locale.DE]: "brüssel" },
		},
	},
	[Countries.AUSTRIA]: {
		[Locale.EN]: "austria",
		[Locale.DE]: "oesterreich",
		cities: {
			[Cities.VIENNA]: { [Locale.EN]: "vienna", [Locale.DE]: "wien" },
		},
	},
	[Countries.PORTUGAL]: {
		[Locale.EN]: "portugal",
		[Locale.DE]: "portugal",
		cities: {
			[Cities.LISBON]: { [Locale.EN]: "lisbon", [Locale.DE]: "lissabon" },
		},
	},
	[Countries.DENMARK]: {
		[Locale.EN]: "denmark",
		[Locale.DE]: "dänemark",
		cities: {
			[Cities.COPENHAGEN]: {
				[Locale.EN]: "copenhagen",
				[Locale.DE]: "kopenhagen",
			},
		},
	},
	[Countries.SWEDEN]: {
		[Locale.EN]: "sweden",
		[Locale.DE]: "schweden",
		cities: {
			[Cities.STOCKHOLM]: {
				[Locale.EN]: "stockholm",
				[Locale.DE]: "stockholm",
			},
		},
	},
	[Countries.NORWAY]: {
		[Locale.EN]: "norway",
		[Locale.DE]: "norwegen",
		cities: {
			[Cities.OSLO]: { [Locale.EN]: "oslo", [Locale.DE]: "oslo" },
		},
	},
	[Countries.IRELAND]: {
		[Locale.EN]: "ireland",
		[Locale.DE]: "irland",
		cities: {
			[Cities.DUBLIN]: { [Locale.EN]: "dublin", [Locale.DE]: "dublin" },
		},
	},
	[Countries.CZECH_REPUBLIC]: {
		[Locale.EN]: "czech-republic",
		[Locale.DE]: "tschechien",
		cities: {
			[Cities.PRAGUE]: { [Locale.EN]: "prague", [Locale.DE]: "prag" },
		},
	},
	[Countries.POLAND]: {
		[Locale.EN]: "poland",
		[Locale.DE]: "polen",
		cities: {
			[Cities.KRAKOW]: { [Locale.EN]: "krakow", [Locale.DE]: "krakau" },
			[Cities.WARSAW]: { [Locale.EN]: "warsaw", [Locale.DE]: "warschau" },
		},
	},
	[Countries.ITALY]: {
		[Locale.EN]: "italy",
		[Locale.DE]: "italien",
		cities: {
			[Cities.MILAN]: { [Locale.EN]: "milan", [Locale.DE]: "mailand" },
		},
	},
	[Countries.BULGARIA]: {
		[Locale.EN]: "bulgaria",
		[Locale.DE]: "bulgarien",
		cities: {
			[Cities.SOFIA]: { [Locale.EN]: "sofia", [Locale.DE]: "sofia" },
		},
	},
	[Countries.UNITED_STATES]: {
		[Locale.EN]: "usa",
		[Locale.DE]: "usa",
		cities: {
			[Cities.SAN_FRANCISCO]: {
				[Locale.EN]: "san-francisco",
				[Locale.DE]: "san-francisco",
			},
		},
	},
};

// Function to create a reverse lookup hash
const createReverseHash = (
	routes: Partial<Record<CombinedRouteEnums, { [locale in Locale]: string }>>,
) => {
	return Object.fromEntries(
		Object.entries(routes).flatMap(([route, routeDefinition]) => {
			return Object.entries(routeDefinition).map(([locale, url]) => [
				url,
				{ route, locale },
			]);
		}),
	);
};

// Create reverse hashes for base routes
const baseRoutesReverseHash = createReverseHash(baseRoutes);

// Function to create a reverse hash for city translations with countries
const createCityReverseHash = (
	translations: typeof countryTranslations,
): Record<string, { route: string; locale: string; country: string }> => {
	const reverseHash: Record<
		string,
		{ route: string; locale: string; country: string }
	> = {};

	// biome-ignore lint/complexity/noForEach: because
	Object.entries(translations).forEach(([countryKey, countryData]) => {
		const { cities } = countryData; // Extract cities object

		// biome-ignore lint/complexity/noForEach: because
		Object.entries(cities as Record<string, Record<Locale, string>>).forEach(
			([cityKey, cityTranslations]) => {
				// biome-ignore lint/complexity/noForEach: because
				Object.entries(cityTranslations).forEach(([locale, cityUrl]) => {
					reverseHash[cityUrl] = {
						route: cityKey,
						locale,
						country: countryKey,
					};
				});
			},
		);
	});

	return reverseHash;
};

// Create reverse hash for city translations
export const cityTranslationsReverseHash =
	createCityReverseHash(countryTranslations);

// Function to split path into valid segments
export const splitPath = (path: string): string[] => {
	return path
		.split("/")
		.filter(Boolean)
		.filter((segment) => segment.length > 2); // Remove empty and short segments
};

// Function to get translated route from an internal route
// Function to get translated route from an internal route, considering country and city
export const getTranslatedRouteFromRoute = (
	locale: Locale,
	country?: Countries,
	city?: Cities,
	routes?: BaseRouteNames[],
): {
	tCountry?: string;
	tCity?: string;
	tRoute?: string;
} => {
	const extraRoutes = routes
		?.map((route) => baseRoutes[route as BaseRouteNames]?.[locale])
		.join("/");
	if (!country || (!city && extraRoutes))
		return { tCountry: undefined, tCity: undefined, tRoute: extraRoutes };
	const countryData = countryTranslations[country];
	if (!countryData)
		return {
			tCountry: undefined,
			tCity: undefined,
			tRoute: undefined,
		};
	if (!city)
		return {
			tCountry: countryData[locale],
			tCity: undefined,
			tRoute: undefined,
		};
	const cityTranslation = countryData?.cities?.[city];
	const localCountry = countryData[locale];
	if (!cityTranslation)
		return {
			tCountry: countryData[locale],
			tCity: undefined,
			tRoute: undefined,
		};

	const localCity = cityTranslation[locale];
	if (!localCity)
		return {
			tCountry: localCountry,
			tCity: localCity,
			tRoute: undefined,
		};

	// Return the translated city name
	return {
		tCountry: localCountry,
		tCity: localCity,
		tRoute: `/${locale}/${localCountry}/${localCity}/${extraRoutes}`,
	};
};

// Rewrite mappings are used to transform non-canonical URLs into canonical ones.
export type RewriteMapping = {
	from: string;
	to: string;
};

let cachedRewriteMappings: RewriteMapping[] | null = null;

export const generateRewriteMappings = (): RewriteMapping[] => {
	if (cachedRewriteMappings) return cachedRewriteMappings;

	const mappings: RewriteMapping[] = [];

	// 1. Base (non-city) route rewrites.
	// biome-ignore lint/complexity/noForEach: because
	Object.entries(baseRoutes).forEach(([routeKey, translations]) => {
		// biome-ignore lint/complexity/noForEach: because
		Object.entries(translations).forEach(([locale, path]) => {
			if (locale !== Locale.EN) {
				const enPath = baseRoutes[routeKey as BaseRouteNames]?.[Locale.EN];
				mappings.push({
					from: `/${locale}/${path}`,
					to: `/${locale}/${enPath}`,
				});
			}
		});
	});

	// 2. Country-level rewrites.
	// For example, rewrite "/de/deutschland" to "/de/germany"
	// biome-ignore lint/complexity/noForEach: because
	Object.entries(countryTranslations).forEach(([countryKey, countryData]) => {
		const canonicalCountry = countryData[Locale.EN];
		if (!canonicalCountry) return;
		// For each non-English locale translation in the country entry:
		// biome-ignore lint/complexity/noForEach: because
		(Object.keys(countryData) as Locale[]).forEach((locale) => {
			if (locale !== Locale.EN) {
				const translatedCountry = countryData[locale];
				if (translatedCountry) {
					mappings.push({
						from: `/${locale}/${translatedCountry}`,
						to: `/${locale}/${canonicalCountry}`,
					});
				}
			}
		});
	});

	// 3. City page rewrites.
	// For example, rewrite "/de/deutschland/koeln/nachtleben" to "/de/germany/cologne/nightlife"
	// biome-ignore lint/complexity/noForEach: because
	Object.entries(countryTranslations).forEach(([countryKey, countryData]) => {
		const countryEn = countryData[Locale.EN];
		if (!countryEn || !countryData.cities) return;
		// biome-ignore lint/complexity/noForEach: because
		Object.entries(countryData.cities).forEach(([cityKey, cityTrans]) => {
			// biome-ignore lint/complexity/noForEach: because
			Object.entries(cityTrans).forEach(([locale, cityTranslated]) => {
				if (locale !== Locale.EN) {
					const countryTranslated = countryData[locale as Locale];
					const cityEn = cityTrans[Locale.EN];
					const nightlifeTranslated =
						baseRoutes[BaseRouteNames.NIGHTLIFE]?.[locale as Locale];
					const nightlifeEn = baseRoutes[BaseRouteNames.NIGHTLIFE]?.[Locale.EN];
					if (
						!countryTranslated ||
						!cityEn ||
						!nightlifeTranslated ||
						!nightlifeEn
					)
						return;
					const fromPath = `/${locale}/${countryTranslated}/${cityTranslated}/${nightlifeTranslated}`;
					const toPath = `/${locale}/${countryEn}/${cityEn}/${nightlifeEn}`;
					mappings.push({ from: fromPath, to: toPath });
				}
			});
		});
	});

	cachedRewriteMappings = mappings;
	return mappings;
};

// Aggregate all city translations into an object keyed by city.
export const allCitiesHash: Record<
	Cities,
	Partial<Record<Locale, string>>
> = Object.entries(countryTranslations).reduce(
	(acc, [, countryData]) => {
		if (countryData.cities) {
			// biome-ignore lint/complexity/noForEach: because
			Object.entries(countryData.cities).forEach(([cityKey, translations]) => {
				acc[cityKey as Cities] = translations;
			});
		}
		return acc;
	},
	{} as Record<Cities, Partial<Record<Locale, string>>>,
);

export const translateCountry = (
	country: string,
	locale: Locale,
): string | undefined => {
	const countryTranslation =
		countryTranslations[country as Countries]?.[locale];
	return countryTranslation;
};

export const translateCity = (
	city: string,
	locale: Locale,
): string | undefined => {
	const cityTranslation = allCitiesHash[city as Cities]?.[locale];
	return cityTranslation;
};

export const translateRoute = (
	route: BaseRouteNames,
	locale: Locale,
): string | undefined => {
	const routeTranslation = baseRoutes[route as BaseRouteNames]?.[locale];
	return routeTranslation;
};
