import Link from "next/link";
import type React from "react";
import { Button } from "~/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { getDictionary } from "~/i18n/dictionaries";
import {
	BaseRouteNames,
	type Locale,
	getTranslatedRouteFromRoute,
} from "~/i18n/routes";
import { db } from "../../../db";
import AddEventButton from "../AddEventButton";
import BuyMeACoffeeButton from "../BuyMeACoffeeButton";
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

	// Filter cities for display
	const filteredCities = cities.slice(0, 20);

	// Define nav items using translations
	const navItemsLeft: { href: string; label: string }[] = [
		// { href: "/blog", label: "Blog" },
	];

	const navItemsRight: { href: string; label: string }[] = [];

	return (
		<>
			{process.env.NEXT_PUBLIC_APP_TYPE === "web" ? (
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
									{/* <AddEventButton /> */}
								</ul>
							</div>

							<div className="md:hidden ml-auto">
								<Sheet>
									<SheetTrigger asChild>
										<button
											type="button"
											className="text-gray-300 focus:outline-none focus:text-white"
										>
											<svg
												xlinkTitle={dict("navigation.menu.openMenu")}
												aria-label={dict("navigation.menu.openMenu")}
												className="w-6 h-6"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<title>{dict("navigation.menu.openMenu")}</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M4 6h16M4 12h16m-7 6h7"
												/>
											</svg>
										</button>
									</SheetTrigger>
									<SheetContent>
										<SheetHeader className="text-left">
											<SheetTitle>{dict("navigation.menu.title")}</SheetTitle>
										</SheetHeader>

										<div className="grid gap-4 py-4">
											{navItemsLeft.map((item) => (
												<SheetClose key={item.href} asChild>
													<Link
														href={item.href}
														className="text-gray-300 hover:text-white"
													>
														{item.label}
													</Link>
												</SheetClose>
											))}
											<BuyMeACoffeeButton />
										</div>
										<SheetFooter className="mt-4">
											<SheetClose asChild>
												<Button type="button">
													{dict("navigation.menu.closeMenu")}
												</Button>
											</SheetClose>
										</SheetFooter>
									</SheetContent>
								</Sheet>
							</div>
						</div>
					</GMW>
				</nav>
			) : (
				<nav className="hidden fixed top-0 right-0 bg-transparent py-4 w-full z-10">
					<GMW>
						<div className="flex items-center">
							<div className="md:hidden ml-auto">
								<Sheet>
									<SheetTrigger asChild>
										<button
											type="button"
											className="text-gray-300 focus:outline-none focus:text-white"
										>
											<svg
												xlinkTitle={dict("navigation.menu.openMenu")}
												aria-label={dict("navigation.menu.openMenu")}
												className="w-6 h-6"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<title>{dict("navigation.menu.openMenu")}</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M4 6h16M4 12h16m-7 6h7"
												/>
											</svg>
										</button>
									</SheetTrigger>
									<SheetContent>
										<SheetHeader className="text-left">
											<SheetTitle>{dict("navigation.menu.title")}</SheetTitle>
											<SheetDescription>
												{dict("navigation.menu.chooseCity")}
											</SheetDescription>
										</SheetHeader>

										<div className="grid gap-4 py-4">
											{filteredCities.map((item) => (
												<SheetClose key={item.name} asChild>
													<Link
														href={`/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
														className="text-gray-300 hover:text-white"
													>
														{item.name}
													</Link>
												</SheetClose>
											))}
										</div>
									</SheetContent>
								</Sheet>
							</div>
						</div>
					</GMW>
				</nav>
			)}
		</>
	);
}
