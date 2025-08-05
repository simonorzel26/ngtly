"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

interface TeaserTileProps {
	imageUrl: string;
	title: string;
	description: string;
	ctaText: string;
}

const TeaserTile: React.FC<TeaserTileProps> = ({
	imageUrl,
	title,
	description,
	ctaText,
}) => {
	const [showOverlay, setShowOverlay] = useState(false);

	const handleClick = () => {
		setShowOverlay(true); // Show overlay when button is clicked
	};

	const handleCloseOverlay = () => {
		setShowOverlay(false); // Close overlay when overlay is clicked
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			handleClick();
		}
	};

	return (
		<div className="rounded-xl shadow-md overflow-hidden border border-white/20 relative">
			<img
				className="w-full h-40 object-cover object-center"
				src={imageUrl}
				alt={title}
			/>

			<div className="p-4">
				<h3 className="text-xl font-semibold mb-2">{title}</h3>

				<p className="mb-4">{description}</p>

				<Button
					type="button"
					onClick={handleClick}
					onKeyDown={handleKeyPress}
					onKeyUp={handleKeyPress}
				>
					{ctaText}
				</Button>
			</div>

			{showOverlay && (
				<Button
					className="absolute inset-0 flex items-center justify-center m-2"
					onClick={handleCloseOverlay}
					onKeyDown={handleKeyPress}
					onKeyUp={handleKeyPress}
				>
					<div className="bg-black bg-opacity-50 backdrop-blur-lg absolute inset-0 rounded-xl" />

					<div className="p-4 rounded-xl shadow-md relative z-1">
						<h3 className="text-white text-lg font-semibold mb-4">
							Overlay Content
						</h3>

						<p className="mb-12">
							Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.
							Sit sit necessitatibus veritatis sed molestiae voluptates incidunt
							iure sapiente.
						</p>

						<Button type="button" variant="neon">
							Get started
						</Button>
					</div>
				</Button>
			)}
		</div>
	);
};

export default TeaserTile;
