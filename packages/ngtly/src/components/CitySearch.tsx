"use client";

import {
	Cross2Icon,
	DotFilledIcon,
	MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type City = {
	id: string;
	name: string;
	country: {
		name: string;
	};
	_count: {
		clubs: number;
	};
};

type CitySearchProps = {
	cities: City[];
	variant?: "default" | "cta" | "hero";
};

export function CitySearch({ cities, variant = "default" }: CitySearchProps) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const filteredCities = useMemo(() => {
		if (!query.trim()) return [];

		return cities
			.filter(
				(city) =>
					city.name.toLowerCase().includes(query.toLowerCase()) ||
					city.country.name.toLowerCase().includes(query.toLowerCase()),
			)
			.slice(0, 8);
	}, [cities, query]);

	const handleCitySelect = (cityName: string) => {
		const citySlug = cityName.toLowerCase().replace(/\s+/g, "-");
		router.push(`/${citySlug}`);
		setQuery("");
		setIsOpen(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (filteredCities.length > 0 && filteredCities[0]) {
			handleCitySelect(filteredCities[0].name);
		}
	};

	const inputStyles =
		variant === "cta"
			? "bg-gray-800/80 border-gray-600/50 text-white placeholder-white/70 focus:border-[#bef264] focus:ring-[#bef264]/20"
			: variant === "hero"
				? "bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-white/50 focus:border-[#bef264] focus:ring-[#bef264]/30 shadow-2xl hover:bg-white/15 transition-all duration-300 font-light tracking-wider"
				: "bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 placeholder-gray-600 focus:border-[#bef264] focus:ring-[#bef264]/20 shadow-xl";

	const containerStyles = variant === "cta" ? "relative" : "relative";

	return (
		<div className={containerStyles}>
			<form onSubmit={handleSubmit} className="relative group">
				<div className="relative">
					<MagnifyingGlassIcon
						className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-colors duration-200 ${variant === "hero" ? "text-white/60 group-focus-within:text-[#bef264]" : variant === "cta" ? "text-white/70" : "text-gray-400"}`}
					/>
					<input
						type="text"
						placeholder={
							variant === "hero"
								? "Search for a city..."
								: "Search for a city..."
						}
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setIsOpen(true);
						}}
						onFocus={() => setIsOpen(true)}
						className={`w-full pl-16 pr-6 ${variant === "hero" ? "py-6" : "py-4"} rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${variant === "hero" ? "text-xl font-light" : "text-lg"} ${inputStyles}`}
					/>
					{variant === "hero" && (
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#bef264]/5 to-transparent pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
					)}
				</div>
			</form>

			{/* Search Results Dropdown */}
			{isOpen && query.trim() && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-[9998]"
						onClick={() => setIsOpen(false)}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								setIsOpen(false);
							}
						}}
						role="button"
						tabIndex={0}
						aria-label="Close search results"
					/>

					{/* Results */}
					<div
						className={`absolute top-full left-0 right-0 mt-3 ${variant === "hero" ? "bg-black/90 backdrop-blur-xl border-white/20" : "bg-white/95 backdrop-blur-sm border-white/20"} rounded-2xl shadow-2xl border z-[9999] max-h-80 overflow-y-auto`}
					>
						{filteredCities.length > 0 ? (
							<div className="p-2">
								{filteredCities.map((city) => (
									<button
										type="button"
										key={city.id}
										onClick={() => handleCitySelect(city.name)}
										className={`w-full p-4 text-left rounded-xl transition-all duration-200 group ${variant === "hero" ? "hover:bg-white/10 hover:backdrop-blur-lg" : "hover:bg-gray-50"}`}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-4">
												<DotFilledIcon
													className={`w-6 h-6 ${variant === "hero" ? "text-[#bef264]" : "text-[#bef264]"}`}
												/>
												<div>
													<div
														className={`font-semibold ${variant === "hero" ? "text-white group-hover:text-[#bef264]" : "text-gray-900 group-hover:text-[#bef264]"} transition-colors duration-200`}
													>
														{city.name}
													</div>
													<div
														className={`text-sm ${variant === "hero" ? "text-white/70" : "text-gray-500"}`}
													>
														{city.country.name}
													</div>
												</div>
											</div>
											<div
												className={`text-xs ${variant === "hero" ? "text-white/60" : "text-gray-400"} bg-gray-500/20 px-2 py-1 rounded-full`}
											>
												{city._count.clubs} clubs
											</div>
										</div>
									</button>
								))}
							</div>
						) : (
							<div
								className={`p-8 text-center ${variant === "hero" ? "text-white/70" : "text-gray-500"}`}
							>
								<div className="text-lg font-medium mb-2">No cities found</div>
								<div className="text-sm">
									Try searching for "{query}" differently
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
