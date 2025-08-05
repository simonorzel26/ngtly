"use client";

import type React from "react";
import type { EventTypeOutput, EventsTypeOutput } from "~/app/[citySlug]/page";
import GMW from "../GlobalMaxWidth";
import MultipleItemsMapbox from "../MapBox/multipleItemsMapBox";

interface HeroMapProps {
	events: EventsTypeOutput;
	cityName: string;
	countryName: string;
}

const HeroMap: React.FC<HeroMapProps> = ({ events, cityName, countryName }) => {
	return (
		<div className="w-full bg-[#121212] relative pt-4 pb-8">
			<GMW>
				<div className="space-y-4">
					<div className="flex flex-col">
						<h1 className="text-4xl md:text-5xl font-bold text-white">
							{cityName}
						</h1>
						<p className="text-lg text-white/70">
							Nightlife in {cityName}, {countryName}
						</p>
					</div>

					<div className="h-[300px] w-full rounded-lg overflow-hidden border border-[#333]">
						<MultipleItemsMapbox events={events} />
					</div>

					<p className="text-sm text-white/60">
						Discover the top clubs, bars, and events in {cityName}. Whether
						you're searching for nightlife near you or planning a night out,
						we've got you covered.
					</p>
				</div>
			</GMW>
		</div>
	);
};

export default HeroMap;
