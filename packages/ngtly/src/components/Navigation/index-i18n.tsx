import Link from "next/link";
import type React from "react";
import { getDictionary } from "~/i18n/dictionaries";
import type { Locale } from "~/i18n/routes";
import { db } from "../../../db";
import GMW from "../GlobalMaxWidth";
import Logo from "../Logo";

export default async function Navigation({ locale }: { locale: Locale }) {
	const { dict } = await getDictionary(locale);
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

	// Define nav items using translations
	const navItemsLeft: { href: string; label: string }[] = [
		// { href: "/blog", label: dict("navigation.navItemsLeft.blog") },
	];

	const navItemsRight: { href: string; label: string }[] = [];

	return (
		<nav className="relative bg-transparent py-4 w-full z-10 top-0">
			<GMW>
				<div className="flex items-center">
					<div className="mr-12">
						<Logo />
					</div>

					<div className="hidden md:flex grow justify-between uppercase font-semibold">
						<ul className="flex space-x-4 items-center">
							{navItemsLeft.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className="text-gray-300 hover:text-white"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>

						<ul className="flex space-x-4 items-center">
							{navItemsRight.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className="text-gray-300 hover:text-white"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="md:hidden ml-auto">
						{/* Mobile menu placeholder */}
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
