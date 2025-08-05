"use client";

import Link from "next/link";
import { useState } from "react";

type City = {
	id: string;
	name: string;
	rank: number;
	country: {
		name: string;
	};
	_count: {
		clubs: number;
	};
};

type FeaturedCitiesProps = {
	cities: City[];
};

const cityImages: Record<string, string> = {
	berlin: "/img/cities/berlin.jpg",
	london: "/img/cities/london.jpg",
	paris: "/img/cities/paris.jpg",
	amsterdam: "/img/cities/amsterdam.jpg",
	barcelona: "/img/cities/barcelona.jpg",
	prague: "/img/cities/prague.jpg",
	vienna: "/img/cities/vienna.jpg",
	madrid: "/img/cities/madrid.jpg",
	cologne: "/img/cities/cologne.jpg",
	munich: "/img/cities/munich.jpg",
};

export function FeaturedCities({ cities }: FeaturedCitiesProps) {
	const [showAll, setShowAll] = useState(false);

	// Get featured cities (top 12 by rank)
	const featuredCities = cities
		.filter((city) => city._count.clubs > 0)
		.sort((a, b) => a.rank - b.rank)
		.slice(0, showAll ? cities.length : 12);

	const getCitySlug = (cityName: string) => {
		return cityName.toLowerCase().replace(/\s+/g, "-");
	};

	const getCityImage = (cityName: string) => {
		const slug = getCitySlug(cityName);
		// For now, just return a gradient since we don't have images yet
		// TODO: Add actual city images later
		return "";
	};

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{featuredCities.map((city) => (
					<Link
						key={city.id}
						href={`/city/${getCitySlug(city.name)}`}
						className="group block"
					>
						<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 aspect-[4/3] transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
							{/* Background gradient for cities without images */}
							<div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-80" />

							{/* City image if available */}
							<div
								className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-300"
								style={{
									backgroundImage: `url(${getCityImage(city.name)})`,
									backgroundColor: "transparent",
								}}
							/>

							{/* Content overlay */}
							<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

							{/* City info */}
							<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
								<h3 className="text-xl font-bold mb-1 group-hover:text-purple-200 transition-colors duration-200">
									{city.name}
								</h3>
								<p className="text-sm opacity-90 mb-2">{city.country.name}</p>
								<div className="flex items-center justify-between">
									<span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
										{city._count.clubs} venues
									</span>
									<span className="text-xs opacity-75">Rank #{city.rank}</span>
								</div>
							</div>

							{/* Hover effect */}
							<div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300" />
						</div>
					</Link>
				))}
			</div>

			{/* Show more/less button */}
			{cities.length > 12 && (
				<div className="text-center">
					{" "}
					<button
						type="button"
						onClick={() => setShowAll(!showAll)}
						className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
					>
						{showAll ? "Show Less" : `Show All ${cities.length} Cities`}
					</button>
				</div>
			)}
		</div>
	);
}
