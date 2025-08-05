import type { Metadata } from "next";
import { Toaster } from "sonner";
import CookieConsent from "~/components/CookieConsent";
import Footer from "~/components/Footer";
import Navigation from "~/components/Navigation";
import { Locale } from "~/i18n/routes";
import "~/styles/globals.css";
import PlausibleProvider from "next-plausible";
import {
	Open_Sans as FontBody,
	Montserrat as FontHeadline,
	Inter as FontSans,
} from "next/font/google";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontHeadline = FontHeadline({
	weight: ["100", "400", "700"],
	subsets: ["latin"],
	variable: "--font-headline",
});

const fontBody = FontBody({
	subsets: ["latin"],
	variable: "--font-body",
});

export const metadata: Metadata = {
	title: "Ngtly - Discover Nightlife Events Worldwide",
	description:
		"Find the best nightlife events, clubs, and parties in cities across Europe and beyond.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${fontSans.variable} ${fontHeadline.variable} ${fontBody.variable}`}
		>
			<head>
				<PlausibleProvider
					domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN_PROD || "ngtly.com"}
					selfHosted={true}
					customDomain="https://t.ngtly.com"
					enabled={true}
				/>
			</head>
			<body className="font-sans antialiased">
				<div className="min-h-screen flex flex-col">
					<Navigation locale={Locale.EN} />
					<main className="flex-1">{children}</main>
					<Footer locale={Locale.EN} />
				</div>
				<Toaster />
				<CookieConsent />
			</body>
		</html>
	);
}
