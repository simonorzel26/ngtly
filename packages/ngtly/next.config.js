/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import createMDX from "@next/mdx";
await import("../../env.js");
// const withPWA = require("@ducanh2912/next-pwa").default({
//   dest: "public",
// });

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
});

/** @type {import("next").NextConfig} */
const baseConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	output: "standalone",
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "ngtly-bucket-prod.s3.eu-central-1.amazonaws.com",
				port: "",
				pathname: "/event-images/**",
			},
			{
				protocol: "https",
				hostname: "ngtly.com",
				port: "",
				pathname: "/img/hero/**",
			},
			// just allow images from all domains
			{
				protocol: "https",
				hostname: "**",
				port: "",
				pathname: "/**",
			},
		],
	},
};

const withMDX = createMDX({
	// Add any MDX-specific plugins or configurations here
});

const config = baseConfig;

export default withPWA(withMDX(config));
