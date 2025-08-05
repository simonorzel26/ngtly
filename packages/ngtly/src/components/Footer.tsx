import Link from "next/link";
import React from "react";
import { RiTwitterXLine } from "react-icons/ri";
import GMW from "~/components/GlobalMaxWidth";
import { getDictionary } from "~/i18n/dictionaries";
import {
	BaseRouteNames,
	type Locale,
	getTranslatedRouteFromRoute,
} from "~/i18n/routes";

const Footer = async ({ locale }: { locale: Locale }) => {
	const { dict } = await getDictionary(locale);

	const socialItems = [
		{
			href: "https://x.com/ngtly_",
			icon: RiTwitterXLine,
			label: dict("footer.social.items.twitter.label"),
			ariaLabel: dict("footer.social.items.twitter.ariaLabel"),
		},
		{
			href: "/open",
			label: "Open Stats",
		},
		{
			href: `/${
				getTranslatedRouteFromRoute(locale, undefined, undefined, [
					BaseRouteNames.TERMS_OF_SERVICE,
				]).tRoute
			}`,
			label: dict("footer.legal.items.termsOfService"),
		},
		{
			href: `/${
				getTranslatedRouteFromRoute(locale, undefined, undefined, [
					BaseRouteNames.PRIVACY_POLICY,
				]).tRoute
			}`,
			label: dict("footer.legal.items.privacyPolicy"),
		},
		{
			href: `/${
				getTranslatedRouteFromRoute(locale, undefined, undefined, [
					BaseRouteNames.COOKIE_POLICY,
				]).tRoute
			}`,
			label: dict("footer.legal.items.cookiePolicy"),
		},
	];

	return (
		<footer className="text-white opacity-20 max-w-full overflow-hidden ">
			<div className=" py-4 text-wrap">
				<GMW>
					<div className="flex flex-col md:flex-row justify-between text-wrap">
						<div className="flex justify-between flex-col md:flex-row items-start">
							<p className="text-sm mt-4 md:mt-0 mb-4">
								{dict("footer.copyright.text").replace(
									"{year}",
									new Date().getFullYear().toString(),
								)}
							</p>
						</div>
						<div className="flex gap-4 text-wrap flex-wrap">
							{socialItems.map((item) => (
								<Link
									key={item.href}
									href={item.href as string}
									className="text-sm"
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				</GMW>
			</div>
		</footer>
	);
};

export default Footer;
