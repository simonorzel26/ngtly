"use client";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";
import type { EventTypeOutput } from "~/app/[citySlug]/page";
import { Button } from "../ui/button";

export const copyToClipboard = async ({
	event,
}: { event: EventTypeOutput }) => {
	try {
		await navigator.clipboard.writeText(
			event?.club?.urlSlug
				? `${process.env.NEXT_PUBLIC_PROD_DOMAIN_URL}${event.city}/${event.club?.urlSlug}/${event.id}`
				: `${process.env.NEXT_PUBLIC_PROD_DOMAIN_URL}${event?.city}`,
		);
		toast("Event link copied to clipboard!", {
			description: "Now go share it with the world!",
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
