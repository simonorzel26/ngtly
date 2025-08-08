"use client";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";
import type { EventTypeOutput } from "~/app/[citySlug]/page";
import { Button } from "../ui/button";

export const copyToClipboard = async ({
	event,
}: { event: EventTypeOutput }) => {
	try {
		const baseUrl =
			process.env.NEXT_PUBLIC_PROD_DOMAIN_URL || "https://ngtly.com";
		const cityUrl = `${baseUrl}/${event.city}`;

		await navigator.clipboard.writeText(cityUrl);
		toast("City link copied to clipboard!", {
			description: "Share this link to show events in this city!",
		});
	} catch (err) {
		console.error("Failed to copy: ", err);
	}
};

const CopyLink = ({ event }: { event: EventTypeOutput }) => {
	return (
		<Button
			onClick={() => copyToClipboard({ event })}
			variant="outline"
			className="mb-4"
		>
			<LinkIcon size={18} className="mr-2" />
			<span>Copy Link</span>
		</Button>
	);
};

export default CopyLink;
