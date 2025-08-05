import Link from "next/link";
import React from "react";

const Logo = ({ size = "md", text = "ngtly" }) => {
	const sizeClasses: { [key: string]: string } = {
		sm: "text-lg md:text-xl lg:text-2xl",
		md: "text-xl md:text-2xl lg:text-3xl",
		lg: "text-4xl md:text-6xl lg:text-7xl",
	};

	return (
		<>
			{process.env.NEXT_PUBLIC_APP_TYPE === "web" ? (
				<Link
					href="/"
					className={`font-headline font-medium bg-gradient-to-r from-lime-500 via-lime-300 to-green-300 inline-block text-transparent bg-clip-text ${sizeClasses[size]}`}
				>
					{text.toUpperCase()}
				</Link>
			) : (
				<div
					className={`font-headline font-medium bg-gradient-to-r from-lime-500 via-lime-300 to-green-300 inline-block text-transparent bg-clip-text ${sizeClasses[size]}`}
				>
					{text.toUpperCase()}
				</div>
			)}
		</>
	);
};

export default Logo;
