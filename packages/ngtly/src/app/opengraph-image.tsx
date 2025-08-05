import { ImageResponse } from "next/og";
import Logo from "~/components/Logo";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "ngtly.com";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }: { params: { city: string } }) {
	// Font
	const montserratRegular = fetch(
		new URL("public/fonts/Montserrat-Regular.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		// ImageResponse JSX element
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "rgb(21, 21, 21)",
			}}
		>
			<div
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<svg
					width="250"
					height="239"
					viewBox="0 0 250 239"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					role="img"
					aria-label="ngtly Logo"
					aria-labelledby="ngtly Logo"
				>
					<path
						d="M0 238.394L81.2442 209.378L162.488 180.362L58.0316 75.9053L0 238.394ZM145.427 128.482L210.306 63.6026C215.994 57.9155 225.162 57.9155 230.85 63.6026L237.697 70.4503L250 58.1476L243.152 51.2999C230.734 38.8811 210.422 38.8811 198.004 51.2999L133.124 116.179L145.427 128.482ZM93.5469 62.9062L86.6992 69.7539L99.0018 82.0566L105.85 75.2089C118.268 62.7901 118.268 42.4791 105.85 30.0604L99.0018 23.2126L86.6992 35.6314L93.5469 42.4791C99.1179 48.0501 99.1179 57.3352 93.5469 62.9062ZM174.791 120.938L156.337 139.392L168.64 151.695L187.094 133.24C192.781 127.553 201.95 127.553 207.637 133.24L226.323 151.927L238.626 139.624L219.94 120.938C207.405 108.519 187.21 108.519 174.791 120.938ZM151.578 51.2999L109.912 92.9666L122.214 105.269L163.881 63.6026C176.3 51.1838 176.3 30.8728 163.881 18.454L145.427 0L133.124 12.3027L151.578 30.7567C157.149 36.4438 157.149 45.7289 151.578 51.2999Z"
						fill="url(#paint0_linear_978_170)"
					/>
					<title id="title" style={{ display: "none" }}>
						ngtly Logo
					</title>
					<defs>
						<linearGradient
							id="paint0_linear_978_170"
							x1="0.500002"
							y1="243"
							x2="290.5"
							y2="156"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#84CC16" />
							<stop offset="0.540755" stop-color="#BEF264" />
							<stop offset="1" stop-color="#86EFAC" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div
				style={{
					fontSize: 100,
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundClip: "text",
					color: "transparent",
					backgroundImage:
						"linear-gradient(to right, rgb(132, 204, 22), rgb(190, 242, 100), rgb(134, 239, 172))",
					marginTop: 100,
				}}
			>
				<Logo />
				.com
			</div>
		</div>,
		// ImageResponse options
		{
			// For convenience, we can re-use the exported opengraph-image
			// size config to also set the ImageResponse's width and height.
			...size,
			fonts: [
				{
					name: "Montserrat",
					data: await montserratRegular,
					style: "normal",
					weight: 400,
				},
			],
		},
	);
}
