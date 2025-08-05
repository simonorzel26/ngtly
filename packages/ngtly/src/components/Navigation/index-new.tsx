import Link from "next/link";
import type React from "react";
import { db } from "../../../db";
import GMW from "../GlobalMaxWidth";
import Logo from "../Logo";

export default async function Navigation() {
	const cities = await db.city.findMany({
		include: {
			country: true,
		},
		orderBy: [{ rank: "asc" }, { name: "asc" }],
		take: 20,
	});

	if (!cities) {
		return null;
	}

	return (
		<nav className="relative bg-transparent py-4 w-full z-10 top-0">
			<GMW>
				<div className="flex items-center">
					<div className="mr-12">
						<Logo />
					</div>

					<div className="hidden md:flex grow justify-between uppercase font-semibold">
						<ul className="flex space-x-4 items-center">
							{/* Add navigation items here if needed */}
						</ul>

						<ul className="flex space-x-4 items-center">
							{/* Add right-side navigation items here if needed */}
						</ul>
					</div>

					<div className="md:hidden ml-auto">
						{/* Mobile menu placeholder - can be enhanced later */}
						<button
							type="button"
							className="text-gray-300 focus:outline-none focus:text-white"
						>
							<svg
								aria-label="Open Menu"
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Open Menu</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</GMW>
		</nav>
	);
}
