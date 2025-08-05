"use client";
import { isFuture } from "date-fns";
import { CalendarIcon, EllipsisIcon, FlagIcon, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import type { EventTypeOutput } from "~/app/[citySlug]/page";
import { copyToClipboard } from "~/components/CopyLink";
import Mapbox from "~/components/MapBox";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { createReportedEvent } from "./eventItem-actions";
import { getImageUrlFromEventId } from "./images";

// Helper function to add UTM parameters to URLs
const addUtmParams = (url: string): string => {
	if (!url) return url;

	try {
		const urlObj = new URL(url);

		// Add UTM parameters if they don't exist
		if (!urlObj.searchParams.has("utm_source")) {
			urlObj.searchParams.append("utm_source", "ngtly.com");
		}
		if (!urlObj.searchParams.has("utm_medium")) {
			urlObj.searchParams.append("utm_medium", "web");
		}
		if (!urlObj.searchParams.has("utm_campaign")) {
			urlObj.searchParams.append("utm_campaign", "venue_referral");
		}

		return urlObj.toString();
	} catch (e) {
		// If the URL is invalid, return the original URL
		console.error("Invalid URL:", url);
		return url;
	}
};

// Note: This component is maintained for reference, but we'll be using TextEventItem for all cities.
// See TextEventItem.tsx for the primary implementation.
const EventItem = ({
	event,
	club,
	index,
	promoted = false,
	countryName,
}: {
	event: EventTypeOutput;
	club?: string;
	index: number;
	promoted?: boolean;
	countryName: string;
}) => {
	const reportEvent = async () => {
		const reportedEvent = await createReportedEvent(event.id);
		if (!reportedEvent) {
			return toast("Failed to report event", {
				description: "Please try again later",
			});
		}
		toast("Event successfully reported to the admins!", {
			description: "Give me a few minutes",
		});
	};

	const soldOut = event.EventEventTag?.find(
		(tag: { eventTag?: { name?: string } }) =>
			tag.eventTag?.name === "Sold Out",
	);

	// Process URLs to include UTM parameters - add these for use in the dialog content
	const clubUrl = event.club?.url ? addUtmParams(event.club.url) : null;
	const ticketsUrl = event.ticketsUrl ? addUtmParams(event.ticketsUrl) : null;
	const eventCanonicalUrl = event.eventCaniconalUrl
		? addUtmParams(event.eventCaniconalUrl)
		: null;

	return (
		<Card
			className={`w-full h-full ${promoted ? "border-2 border-[#bef264]" : ""}`}
		>
			<Dialog>
				<DialogTrigger asChild>
					<div className="relative w-full h-80 rounded-lg flex flex-col justify-end overflow-hidden cursor-pointer">
						{soldOut && (
							<div className="absolute justify-center items-center h-full w-full z-10">
								<div className="flex flex-row justify-center items-center backdrop:blur-sm bg-black/60 w-full h-full">
									<div className="flex text-white text-4xl uppercase">
										Sold Out
									</div>
								</div>
							</div>
						)}
						<Image
							src={getImageUrlFromEventId(event.id)}
							alt={`${event.name} at ${event.club} event poster`}
							fill
							placeholder="blur"
							className="absolute z-0 top-0 object-cover"
							blurDataURL={getImageUrlFromEventId(event.id)}
							priority={index < 3}
						/>
						<div
							className="absolute inset-0"
							style={{
								backgroundImage:
									"linear-gradient(to top, rgba(40,40,40, 1) 0%, rgba(40,40,40, 0.98) 40%, rgba(40,40,40, 0.1) 60%, rgba(40,40,40, 0.1) 100%)",
							}}
						>
							<div className="grid grid-cols-3 max-w-[90%] min-h-8 gap-1 m-4 mt-2 mr-12 items-center">
								{event.EventMusicTag?.map(
									({ musicTag }: { musicTag?: { name?: string } }) => (
										<TooltipProvider key={event.name + musicTag?.name}>
											<Tooltip>
												<TooltipTrigger asChild>
													<div className="bg-[#bef965] opacity-90 col-span-1 text-background mt-2 py-1 px-2 text-xs rounded-sm justify-center text-center line-clamp-1 overflow-hidden overflow-ellipsis">
														{musicTag?.name && musicTag.name.length > 5
															? `${musicTag.name.slice(0, 5)}.`
															: musicTag?.name}
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<p>{musicTag?.name}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									),
								)}
							</div>

							<div className="grid grid-cols-3 max-w-[90%] gap-1 m-4 mt-28 mr-12 items-center">
								{event.EventEventTag?.map(
									({ eventTag }: { eventTag?: { name?: string } }) => (
										<TooltipProvider key={event.name + eventTag?.name}>
											<Tooltip>
												<TooltipTrigger asChild>
													<div className="bg-[#f665f9] opacity-90 col-span-1 text-background mt-2 py-1 px-2 text-xs rounded-sm justify-center text-center line-clamp-1 overflow-hidden overflow-ellipsis">
														{eventTag?.name && eventTag.name.length > 5
															? `${eventTag.name.slice(0, 5)}.`
															: eventTag?.name}
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<p>{eventTag?.name}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									),
								)}
							</div>
						</div>

						<div className="absolute top-0 right-0 m-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]/90"
									>
										<EllipsisIcon size={18} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-full">
									<DropdownMenuItem onClick={() => copyToClipboard({ event })}>
										<LinkIcon size={18} className="mr-2" />
										<span>Copy Link</span>
									</DropdownMenuItem>
									{process.env.NEXT_PUBLIC_APP_TYPE === "web" &&
										isFuture(new Date(event.eventDate)) && (
											<DropdownMenuItem>
												<CalendarIcon size={18} className="mr-2" />
												<Link href={`/promote/event/${event.id}`}>
													<span>Promote this event</span>
												</Link>
											</DropdownMenuItem>
										)}
									<DropdownMenuItem onClick={reportEvent}>
										<FlagIcon size={18} className="mr-2" />
										<span>Report</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="relative p-4 flex flex-col">
							<h2 className="text-white font-bold text-2xl line-clamp-1">
								{event.name}
							</h2>
							<h3 className="text-white font-semibold text-lg line-clamp-1 hover:text-white/80 transition-all">
								{event.clubName}
							</h3>
							<p className="text-white line-clamp-1">
								{event.eventDate}
								{event.eventStartTime && `, ${event.eventStartTime}`}
							</p>
						</div>
					</div>
				</DialogTrigger>

				<DialogContent className="max-w-3xl w-full">
					{/* Dialog content has been updated to match TextEventItem - see TextEventItem.tsx for the implementation */}
					{/* The variables clubUrl, ticketsUrl, and eventCanonicalUrl are now available for use in the dialog content */}
				</DialogContent>
			</Dialog>
		</Card>
	);
};

export default EventItem;
