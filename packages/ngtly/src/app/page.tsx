import { addDays, startOfToday } from "date-fns";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { CitiesSection } from "~/components/CitiesSection";
import { CitySearch } from "~/components/CitySearch";
import TextEventItem from "~/components/EventList/EventItem/TextEventItem";
import GMW from "~/components/GlobalMaxWidth";
import { LandingHero } from "~/components/LandingHero";
import { db } from "../../db";

export const metadata: Metadata = {
	title: "Ngtly - Discover Nightlife Events Worldwide",
	description:
		"Find the best nightlife events, clubs, and parties in cities across Europe and beyond. Electronic music, house parties, and more.",
	alternates: {
		canonical: "https://ngtly.com",
	},
	openGraph: {
		title: "Ngtly - Discover Nightlife Events Worldwide",
		description:
			"Find the best nightlife events, clubs, and parties in cities across Europe and beyond.",
		url: "https://ngtly.com",
		siteName: "ngtly",
		locale: "en",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Ngtly - Discover Nightlife Events Worldwide",
		description:
			"Find the best nightlife events, clubs, and parties in cities across Europe and beyond.",
	},
};

async function getCities() {
	const cities = await db.city.findMany({
		where: {
			clubs: {
				some: {
					events: {
						some: {
							eventDate: {
								gte: startOfToday().toISOString(),
							},
						},
					},
				},
			},
		},
		include: {
			country: true,
			_count: {
				select: {
					clubs: true,
				},
			},
		},
		orderBy: [{ rank: "asc" }, { name: "asc" }],
	});

	return cities;
}

async function getFeaturedEvents() {
	const events = await db.event.findMany({
		where: {
			eventDate: {
				gte: startOfToday().toISOString(),
				lte: addDays(startOfToday(), 7).toISOString(),
			},
		},
		include: {
			club: { include: { location: true } },
			EventEventTag: { include: { eventTag: true } },
			EventMusicTag: { include: { musicTag: true } },
		},
		orderBy: { eventDate: "asc" },
		take: 50,
	});

	return events;
}

export type EventsTypeOutput = Awaited<ReturnType<typeof getFeaturedEvents>>;
export type EventTypeOutput = EventsTypeOutput[number];

export default async function HomePage() {
	const cities = await getCities();
	const featuredEvents = await getFeaturedEvents();

	// JSON-LD structured data for the homepage
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		url: "https://ngtly.com",
		name: "Ngtly",
		description: "Discover nightlife events worldwide",
		publisher: {
			"@type": "Organization",
			name: "Ngtly",
			url: "https://ngtly.com",
			logo: {
				"@type": "ImageObject",
				url: "https://ngtly.com/logo-ngtly_1024.png",
			},
		},
		potentialAction: {
			"@type": "SearchAction",
			target: "https://ngtly.com/{search_term_string}",
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<>
			<Script
				id="json-ld"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* Landing Hero with Search */}
			<LandingHero cities={cities} />

			{/* Featured Cities Section */}
			<CitiesSection cities={cities} />

			{/* Featured Events Section */}
			{featuredEvents.length > 0 && (
				<section className="bg-black text-white py-16">
					<GMW>
						<div className="mb-12">
							<h2 className="font-headline text-3xl md:text-4xl font-semibold uppercase mb-4">
								This Week's Featured Events
							</h2>
							<p className="text-white/70 text-lg">
								Discover what's happening in nightlife worldwide
							</p>
						</div>
						<div className="grid grid-cols-1 gap-4">
							{featuredEvents.slice(0, 8).map((event, index) => (
								<TextEventItem
									key={event.id}
									event={event}
									index={index}
									countryName="Worldwide"
								/>
							))}
						</div>
						{featuredEvents.length > 8 && (
							<div className="text-center mt-8">
								<p className="text-white/60 text-sm">
									Showing {Math.min(8, featuredEvents.length)} of{" "}
									{featuredEvents.length} events this week
								</p>
							</div>
						)}
					</GMW>
				</section>
			)}

			{/* Stats Section */}
			<section className="bg-[#1a1a1a] text-white py-16">
				<GMW>
					<div className="grid md:grid-cols-3 gap-8 text-center">
						<div className="p-8">
							<div className="text-4xl font-bold text-[#bef264] mb-2 font-headline">
								{cities.length}+
							</div>
							<div className="text-xl font-semibold text-white mb-2 uppercase font-headline">
								Cities
							</div>
							<div className="text-white/70">Across Europe and beyond</div>
						</div>
						<div className="p-8">
							<div className="text-4xl font-bold text-[#bef264] mb-2 font-headline">
								{cities.reduce((acc, city) => acc + city._count.clubs, 0)}+
							</div>
							<div className="text-xl font-semibold text-white mb-2 uppercase font-headline">
								Clubs
							</div>
							<div className="text-white/70">Venues and event spaces</div>
						</div>
						<div className="p-8">
							<div className="text-4xl font-bold text-[#bef264] mb-2 font-headline">
								24/7
							</div>
							<div className="text-xl font-semibold text-white mb-2 uppercase font-headline">
								Updates
							</div>
							<div className="text-white/70">Fresh events daily</div>
						</div>
					</div>
				</GMW>
			</section>

			{/* CTA Section */}
			<section className="bg-gradient-to-r from-[#bef264] to-[#a8dd4e] text-black py-16">
				<GMW>
					<div className="text-center">
						<h2 className="font-headline text-4xl font-bold mb-6 uppercase">
							Ready to Explore?
						</h2>
						<p className="text-xl mb-8 max-w-2xl mx-auto font-medium">
							Join thousands of nightlife enthusiasts discovering the best
							events in their city
						</p>
						<div className="max-w-md mx-auto">
							<CitySearch cities={cities.slice(0, 20)} variant="cta" />
						</div>
					</div>
				</GMW>
			</section>
		</>
	);
}
