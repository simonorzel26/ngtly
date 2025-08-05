import {
	addDays,
	addHours,
	endOfDay,
	endOfToday,
	endOfTomorrow,
	endOfWeek,
	startOfDay,
	startOfToday,
	startOfTomorrow,
	startOfWeek,
} from "date-fns";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import EventList from "~/components/EventList";
import { getImageUrlFromEventId } from "~/components/EventList/EventItem/images";
import Hero from "~/components/Hero";
import { getDictionary } from "~/i18n/dictionaries";
import { Locale } from "~/i18n/routes";
import { sortEventsByDate } from "~/lib/utils";
import type { Cities } from "~/utils/globalTypes";
import { db } from "../../../db";

type Props = {
	params: { citySlug: string };
	searchParams: { [key: string]: string | undefined };
};

async function fetchCityBySlug(citySlug: string) {
	// Convert slug to proper city name
	const cityNameMap: Record<string, string> = {
		cologne: "Cologne",
		berlin: "Berlin",
		birmingham: "Birmingham",
		brussels: "Brussels",
		hamburg: "Hamburg",
		prague: "Prague",
		copenhagen: "Copenhagen",
		amsterdam: "Amsterdam",
		budapest: "Budapest",
		munich: "Munich",
		vienna: "Vienna",
		lisbon: "Lisbon",
		london: "London",
		madrid: "Madrid",
		frankfurt: "Frankfurt",
		barcelona: "Barcelona",
		rotterdam: "Rotterdam",
		stockholm: "Stockholm",
		sevilla: "Sevilla",
		paris: "Paris",
		oslo: "Oslo",
		duesseldorf: "Düsseldorf",
		dublin: "Dublin",
		nuremberg: "Nuremberg",
		dresden: "Dresden",
		krakow: "Krakow",
		warsaw: "Warsaw",
		milan: "Milan",
		sofia: "Sofia",
		"san-francisco": "San Francisco",
	};

	const cityName = cityNameMap[citySlug.toLowerCase()];
	if (!cityName) {
		return null;
	}

	// Find city by the proper name
	const city = await db.city.findFirst({
		where: {
			name: {
				equals: cityName,
				mode: "insensitive",
			},
		},
		include: {
			country: true,
			clubs: {
				include: {
					events: {
						where: {
							eventDate: {
								gte: startOfToday().toISOString(),
								lte: addHours(startOfToday(), 72).toISOString(), // Next 3 days
							},
						},
						orderBy: { eventDate: "asc" },
						take: 5,
						include: {
							club: { include: { location: true } },
							EventEventTag: { include: { eventTag: true } },
							EventMusicTag: { include: { musicTag: true } },
						},
					},
				},
			},
		},
	});

	return city;
}

async function getEventCounts(cityName: string) {
	const today = startOfToday();
	const tomorrow = startOfTomorrow();
	const endTomorrow = endOfTomorrow();

	// Calculate weekend dates to match frontend logic
	const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
	let weekendStart: Date;
	let weekendEnd: Date;

	// Calculate days until Friday
	let daysUntilFriday = (5 - currentDay + 7) % 7;
	// If today is Friday, set to 0
	if (currentDay === 5) daysUntilFriday = 0;

	// Calculate days until Sunday
	const daysUntilSunday = (7 - currentDay + 7) % 7;

	// If it's already the weekend (Friday-Sunday), use current weekend
	if (currentDay === 5 || currentDay === 6 || currentDay === 0) {
		// If it's Friday
		if (currentDay === 5) {
			weekendStart = startOfDay(today);
			weekendEnd = endOfDay(addDays(today, 2));
		}
		// If it's Saturday
		else if (currentDay === 6) {
			weekendStart = startOfDay(addDays(today, -1));
			weekendEnd = endOfDay(addDays(today, 1));
		}
		// If it's Sunday
		else {
			weekendStart = startOfDay(addDays(today, -2));
			weekendEnd = endOfDay(today);
		}
	} else {
		// Calculate next weekend
		weekendStart = startOfDay(addDays(today, daysUntilFriday));
		weekendEnd = endOfDay(addDays(today, daysUntilSunday));
	}

	// Use the same city name format as in fetchEvents
	const cityForQuery = cityName.toLowerCase();

	const [todayCount, tomorrowCount, weekendCount] = await Promise.all([
		// Today's events
		db.event.count({
			where: {
				city: cityForQuery,
				eventDate: {
					gte: today.toISOString(),
					lt: tomorrow.toISOString(),
				},
			},
		}),
		// Tomorrow's events
		db.event.count({
			where: {
				city: cityForQuery,
				eventDate: {
					gte: tomorrow.toISOString(),
					lt: endTomorrow.toISOString(),
				},
			},
		}),
		// Weekend events (Friday to Sunday)
		db.event.count({
			where: {
				city: cityForQuery,
				eventDate: {
					gte: weekendStart.toISOString(),
					lte: weekendEnd.toISOString(),
				},
			},
		}),
	]);

	return {
		today: todayCount,
		tomorrow: tomorrowCount,
		weekend: weekendCount,
	};
}

async function fetchEvents(city: string, searchParams: Props["searchParams"]) {
	const dateRangeArray = searchParams?.dateRange?.split(",");
	const isValidDateRange = dateRangeArray?.length === 2;

	const events = await db.event.findMany({
		where: {
			city: city.toLowerCase(),
			eventDate: {
				gte: isValidDateRange
					? dateRangeArray[0]
					: startOfToday().toISOString(),
				lte: isValidDateRange
					? dateRangeArray[1]
					: startOfTomorrow().toISOString(),
			},
		},
		include: {
			club: { include: { location: true } },
			EventEventTag: { include: { eventTag: true } },
			EventMusicTag: { include: { musicTag: true } },
		},
	});

	if (events) {
		sortEventsByDate(events);
	}
	return events;
}

export type EventsTypeOutput = Awaited<ReturnType<typeof fetchEvents>>;
export type EventTypeOutput = EventsTypeOutput[number];

export async function generateMetadata({
	params,
}: {
	params: { citySlug: string };
}): Promise<Metadata> {
	const city = await fetchCityBySlug(params.citySlug);

	if (!city) {
		return {
			title: "City not found - Ngtly",
			description: "The requested city could not be found.",
		};
	}

	const { dict } = await getDictionary(Locale.EN); // Default to English for now
	const title = `Nightlife in ${city.name} - Events, Clubs & Parties | Ngtly`;
	const description = `Discover the best nightlife events, clubs, and parties in ${city.name}, ${city.country.name}. Find electronic music events, house parties, and more.`;

	return {
		title,
		description,
		alternates: {
			canonical: `https://ngtly.com/${params.citySlug}`,
		},
		openGraph: {
			title,
			description,
			url: `https://ngtly.com/${params.citySlug}`,
			siteName: "ngtly",
			locale: "en",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}

export default async function CityPage({ params, searchParams }: Props) {
	const city = await fetchCityBySlug(params.citySlug);

	if (!city) {
		notFound();
	}

	const { dict } = await getDictionary(Locale.EN); // Default to English for now
	const [events, eventCounts] = await Promise.all([
		fetchEvents(city.name, searchParams),
		getEventCounts(city.name),
	]);

	// JSON-LD structured data for the city page
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Place",
		name: city.name,
		address: {
			"@type": "PostalAddress",
			addressLocality: city.name,
			addressCountry: city.country.name,
		},
		url: `https://ngtly.com/${params.citySlug}`,
		description: `Nightlife events and clubs in ${city.name}, ${city.country.name}`,
	};

	return (
		<>
			<Script
				id="json-ld"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Hero
				city={city.name}
				country={city.country.name}
				translatedCity={city.name}
				events={events}
				eventCounts={eventCounts}
			/>
			<div className=" mx-auto py-8  max-w-7xl">
				<>
					<EventList
						events={events}
						cityName={city.name}
						countryName={city.country.name}
						eventCounts={eventCounts}
					/>
				</>
			</div>
		</>
	);
}
