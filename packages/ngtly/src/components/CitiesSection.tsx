"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import GMW from "./GlobalMaxWidth";

type City = {
	id: string;
	name: string;
	country: {
		name: string;
	};
	_count: {
		clubs: number;
	};
	rank?: number | null;
};

type CitiesSectionProps = {
	cities: City[];
};

export function CitiesSection({ cities }: CitiesSectionProps) {
	const [showAll, setShowAll] = useState(false);
	const displayedCities = showAll ? cities : cities.slice(0, 12);

	return (
		<section className="bg-[#282828] text-white py-16">
			<GMW>
				<div className="mb-12">
					<h2 className="font-headline text-3xl md:text-4xl font-semibold uppercase mb-4">
						Explore Cities
					</h2>
					<p className="text-white/70 text-lg">
						Dive into the nightlife of Europe's most vibrant cities
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{displayedCities.map((city) => (
						<Link
							key={city.id}
							href={`/${city.name.toLowerCase().replace(/\s+/g, "-")}`}
							className="group block"
						>
							<div className="relative overflow-hidden rounded-lg aspect-[4/3] transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
								{/* City Image */}
								<Image
									src={`/img/hero/${city.name}.webp`}
									alt={`${city.name} nightlife`}
									fill
									className="object-cover"
									placeholder="blur"
									blurDataURL="/img/hero/placeholder.webp"
								/>
								{/* Dark overlay */}
								<div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />
								{/* City info */}
								<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
									<h3 className="text-xl font-bold mb-1 group-hover:text-[#bef264] transition-colors duration-200 font-headline uppercase">
										{city.name}
									</h3>
									<p className="text-sm opacity-90 mb-2">{city.country.name}</p>
									<div className="flex items-center justify-between">
										<span className="text-xs bg-[#bef264]/20 backdrop-blur-sm px-2 py-1 rounded-full border border-[#bef264]/30">
											{city._count.clubs} venues
										</span>
										{city.rank && (
											<span className="text-xs opacity-75">
												Rank #{city.rank}
											</span>
										)}
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Show More Button */}
				{cities.length > 12 && (
					<div className="text-center mt-8">
						{" "}
						<button
							type="button"
							onClick={() => setShowAll(!showAll)}
							className="bg-[#bef264] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#a8dd4e] transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-[#bef264]/20"
						>
							{showAll ? "Show Less" : `Show All ${cities.length} Cities`}
						</button>
					</div>
				)}
			</GMW>
		</section>
	);
}
