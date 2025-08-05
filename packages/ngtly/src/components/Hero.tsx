import type { Club, Event } from "@prisma/ngtlyClient";
import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { EventsTypeOutput } from "~/app/[citySlug]/page";
import type { EventsTypeOutput as HomeEventsTypeOutput } from "~/app/page";
import AddClubUrlButton from "./AddClubUrlButton";
import GMW from "./GlobalMaxWidth";
import MultipleItemsMapbox from "./MapBox/multipleItemsMapBox";

interface HeroProps {
	city: string;
	club?: Club;
	event?: Event;
	country: string;
	translatedCity: string;
	events?: EventsTypeOutput | HomeEventsTypeOutput;
	eventCounts?: {
		today: number;
		tomorrow: number;
		weekend: number;
	};
}

const Hero: React.FC<HeroProps> = ({
	city,
	club,
	country,
	event,
	translatedCity,
	events,
	eventCounts,
}) => {
	// Determine if we should show the map (only on city pages without specific club/event)
	const showMap = !club && !event && events && events.length > 0;
	const isGlobalHomepage = city === "global";

	return (
		<div className="relative h-1/4-screen max-h-[33vh] md:max-h-[33vh] h-96 w-full overflow-hidden">
			<div className="h-full w-full m-auto items-start justify-center">
				{process.env.NEXT_PUBLIC_APP_TYPE === "web" && !isGlobalHomepage && (
					<>
						<Image
							src={`/img/hero/${city}.webp`}
							alt={`${city} hero image`}
							height={1024}
							width={1792}
							placeholder="blur"
							blurDataURL="/img/hero/placeholder.webp"
							className="-z-10 absolute object-cover w-full h-full"
							priority
						/>
						<div
							className="absolute inset-0"
							style={{
								backgroundImage:
									"linear-gradient(to right, rgba(40,40,40, 0.97) 0%, rgba(40,40,40, 0.7) 50%, rgba(40,40,40, 0.1) 100%)",
							}}
						/>
					</>
				)}

				{/* Global homepage background */}
				{isGlobalHomepage && (
					<>
						<Image
							src="/img/hero/Berlin.webp"
							alt="Berlin nightlife scene"
							height={1024}
							width={1792}
							placeholder="blur"
							blurDataURL="/img/hero/placeholder.webp"
							className="-z-10 absolute object-cover w-full h-full"
							priority
						/>
						<div
							className="absolute inset-0"
							style={{
								backgroundImage:
									"linear-gradient(to right, rgba(40,40,40, 0.97) 0%, rgba(40,40,40, 0.7) 50%, rgba(40,40,40, 0.1) 100%)",
							}}
						/>
					</>
				)}

				{/* Hero Content */}
				<GMW>
					{/* Two-column layout for desktop */}
					<div className="relative h-full flex flex-col md:flex-row md:items-start md:justify-between pt-6 md:pt-10  max-w-7xl mx-auto">
						{/* Left column: Title and subtitle */}
						<div className="pb-8 md:pb-0 flex-1 md:max-w-6xl">
							<h2 className="font-headline text-white tracking-normal font-semibold uppercase text-left text-4xl md:text-5xl lg:text-7xl line-clamp-1">
								{event ? event.name : club ? club.name : translatedCity}
							</h2>
							{club ? (
								<Link
									id="hero-back"
									href={event ? `/${city}/${club.urlSlug}` : `/${city}`}
									className="hover:opacity-80"
								>
									<h3 className="font-headline text-white tracking-normal font-normal uppercase text-left text-xl md:text-2xl lg:text-3xl flex items-center">
										<ArrowLeft className="inline-block w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 mt-1 md:mt-0" />
										{event ? club.name : translatedCity}
									</h3>
								</Link>
							) : (
								<h3 className="font-headline text-white tracking-normal font-normal uppercase text-left text-xl md:text-2xl lg:text-3xl flex items-center">
									{country}
								</h3>
							)}

							{/* Event counts for city pages */}
							{eventCounts && !club && !event && (
								<div className="mt-6 flex flex-wrap gap-4">
									<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
										<div className="text-[#bef264] text-sm font-medium">
											Today
										</div>
										<div className="text-white text-lg font-semibold">
											{eventCounts.today}{" "}
											{eventCounts.today === 1 ? "event" : "events"}
										</div>
									</div>
									<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
										<div className="text-[#bef264] text-sm font-medium">
											Tomorrow
										</div>
										<div className="text-white text-lg font-semibold">
											{eventCounts.tomorrow}{" "}
											{eventCounts.tomorrow === 1 ? "event" : "events"}
										</div>
									</div>
									<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
										<div className="text-[#bef264] text-sm font-medium">
											Weekend
										</div>
										<div className="text-white text-lg font-semibold">
											{eventCounts.weekend}{" "}
											{eventCounts.weekend === 1 ? "event" : "events"}
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Map for Desktop/Tablet only */}
						{showMap && (
							<div className="hidden md:block w-[300px] xl:w-[380px] rounded-lg overflow-hidden shadow-lg mb-10  max-w-6xl">
								<div className=" backdrop-blur-sm border border-[#333] rounded-lg overflow-hidden">
									<div className="flex items-center justify-between px-3 py-2 bg-black/60 border-b border-[#333]">
										<div className="flex items-center">
											<MapPin className="w-4 h-4 text-[#bef264] mr-2" />
											<h4 className="text-white text-sm font-medium">
												{isGlobalHomepage
													? "Global Nightlife"
													: `${translatedCity} Nightlife`}
											</h4>
										</div>
										<span className="text-xs text-white/60">
											{events.length} {isGlobalHomepage ? "events" : "venues"}
										</span>
									</div>
									<div className="h-[180px] w-full">
										<MultipleItemsMapbox events={events} />
									</div>
								</div>
							</div>
						)}
					</div>
				</GMW>
			</div>
		</div>
	);
};

export default Hero;
