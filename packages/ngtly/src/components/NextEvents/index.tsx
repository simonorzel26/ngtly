import { endOfTomorrow, startOfToday } from "date-fns";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "~/components/ui/carousel";
import {
	BaseRouteNames,
	type Locale,
	getTranslatedRouteFromRoute,
} from "~/i18n/routes";
import type { Cities, Countries } from "~/utils/globalTypes";
import { db } from "../../../db";
import EventItem from "../EventList/EventItem";

// Helper function to fetch events for a city
async function fetchEventsForCity(city: string, limit = 12) {
	return unstable_cache(
		async () => {
			const events = await db.event.findMany({
				where: {
					city: city.toLowerCase(),
					eventDate: {
						gte: startOfToday().toISOString(),
						lte: endOfTomorrow().toISOString(),
					},
				},
				include: {
					club: {
						include: {
							location: true,
						},
					},
					EventEventTag: {
						include: {
							eventTag: true,
						},
					},
					EventMusicTag: {
						include: {
							musicTag: true,
						},
					},
				},
				orderBy: {
					eventDate: "asc",
				},
				take: limit, // Limit the result to 12 events
			});
			return events;
		},
		[`events-${city.toLowerCase()}`],
		{ revalidate: 14400 }, // Revalidate every 4 hours (14400 seconds)
	)();
}

// Component to display the next events for Berlin and Cologne in a carousel
export default async function NextEvents({
	country,
	city,
	locale,
	otherEvents = false,
}: {
	country: Countries;
	city: Cities;
	locale: Locale;
	otherEvents?: boolean;
}) {
	const events = await fetchEventsForCity(city);
	const { tRoute, tCity, tCountry } = getTranslatedRouteFromRoute(
		locale,
		country,
		city,
		[BaseRouteNames.NIGHTLIFE],
	);

	return (
		<div className="mx-auto my-12">
			<h2 className=" text-2xl font-bold mb-6 overflow-wrap">
				Upcoming Events in{" "}
				<Link href={`${tRoute}`} className="underline">
					{tCity}, {tCountry}
				</Link>
			</h2>
			<Carousel className="w-full max-w-4xl overflow-hidden min-w-4xl">
				<CarouselContent className="-ml-4 md:-ml-4">
					{events.length > 0 ? (
						events.map((event, index) => (
							<CarouselItem
								className="basis-full md:max-w-full md:basis-1/3 lg:basis-1/3 pl-4"
								key={event.id}
							>
								<EventItem event={event} index={index} countryName="Germany" />
							</CarouselItem>
						))
					) : (
						<p>
							Currently no events for {tCity}, {tCountry}.
						</p>
					)}
				</CarouselContent>
			</Carousel>

			{otherEvents && (
				<h2 className="text-2xl font-bold my-6">
					<Link href="/cities" className="underline">
						Other Cities
					</Link>
				</h2>
			)}
		</div>
	);
}
