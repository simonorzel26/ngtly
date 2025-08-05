import Link from "next/link";
import React from "react";
import { RiTwitterXLine } from "react-icons/ri";
import GMW from "./GlobalMaxWidth";

const Footer = async () => {
	const socialItems = [
		{
			href: "https://x.com/ngtly_",
			icon: RiTwitterXLine,
			label: "Twitter",
			ariaLabel: "Follow us on Twitter",
		},
	];

	const legalItems = [
		{
			href: "/terms-of-service",
			label: "Terms of Service",
		},
		{
			href: "/privacy-policy",
			label: "Privacy Policy",
		},
		{
			href: "/cookie-policy",
			label: "Cookie Policy",
		},
	];

	return (
		<footer className="bg-black text-white py-8 mt-auto">
			<GMW>
				<div className="grid md:grid-cols-3 gap-8">
					{/* Brand */}
					<div>
						<h3 className="text-xl font-bold mb-4">Ngtly</h3>
						<p className="text-gray-400 text-sm">
							Discover the best nightlife events and clubs worldwide.
						</p>
					</div>

					{/* Social Links */}
					<div>
						<h4 className="text-lg font-semibold mb-4">Follow Us</h4>
						<div className="flex space-x-4">
							{socialItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-gray-400 hover:text-white transition-colors"
									aria-label={item.ariaLabel}
									target="_blank"
									rel="noopener noreferrer"
								>
									<item.icon className="w-5 h-5" />
								</Link>
							))}
						</div>
					</div>

					{/* Legal Links */}
					<div>
						<h4 className="text-lg font-semibold mb-4">Legal</h4>
						<ul className="space-y-2">
							{legalItems.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className="text-gray-400 hover:text-white transition-colors text-sm"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-8 border-t border-gray-800 text-center">
					<p className="text-gray-400 text-sm">
						© {new Date().getFullYear()} Ngtly. All rights reserved.
					</p>
				</div>
			</GMW>
		</footer>
	);
};

export default Footer;
