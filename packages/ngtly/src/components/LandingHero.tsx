import Image from "next/image";
import { CitySearch } from "./CitySearch";
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

interface LandingHeroProps {
	cities: City[];
}

export function LandingHero({ cities }: LandingHeroProps) {
	return (
		<div className="relative h-[60vh] md:h-[70vh] w-full">
			{/* Background Image */}
			<Image
				src="/img/hero/berlin.webp"
				alt="Berlin nightlife scene"
				fill
				className="object-cover"
				placeholder="blur"
				blurDataURL="/img/hero/berlin.webp"
				priority
			/>
			{/* Dark overlay for better text readability */}
			<div className="absolute inset-0 bg-black/60" /> {/* Content */}
			<div className="relative h-full flex items-center justify-center">
				<GMW>
					<div className="text-center max-w-5xl mx-auto px-4">
						{/* Main Heading */}
						<h1 className="font-headline text-white text-5xl md:text-7xl lg:text-8xl font-semibold uppercase mb-8 tracking-tight leading-tight">
							Discover Nightlife
						</h1>

						{/* Subheading */}
						<p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed">
							Find the best electronic music events, clubs, and parties
							worldwide
						</p>

						{/* Search Component */}
						<div className="max-w-2xl mx-auto">
							<CitySearch cities={cities} variant="hero" />
						</div>

						{/* Optional subtle call-to-action */}
						<div className="mt-8 text-white/60 text-sm">
							Search from {cities.length}+ cities worldwide
						</div>
					</div>
				</GMW>
			</div>
		</div>
	);
}
