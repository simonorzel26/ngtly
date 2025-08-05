"use client";

import { isFuture } from "date-fns";
import {
	CalendarIcon,
	ClockIcon,
	EllipsisIcon,
	EuroIcon,
	FlagIcon,
	LinkIcon,
	MapPinIcon,
	Music2Icon,
	TagsIcon,
	TicketIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { toast } from "sonner";
import type { EventTypeOutput } from "~/app/[citySlug]/page";
import { copyToClipboard } from "~/components/CopyLink";
import Mapbox from "~/components/MapBox";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
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

const TextEventItem = ({
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

	const selectedImage = useMemo(() => {
		// Validate event.eventImage if it exists
		if (event.eventImage) {
			try {
				// Check if it's a valid URL
				new URL(event.eventImage);
				return event.eventImage;
			} catch {
				// If invalid URL, fall back to generated image
				console.warn(
					`Invalid event image URL for event ${event.id}: ${event.eventImage}`,
				);
			}
		}
		// Use generated image from event ID as fallback
		return getImageUrlFromEventId(event.id);
	}, [event.id, event.eventImage]);

	// Group tags by type for better organization
	const musicTags =
		event.EventMusicTag?.map(
			({ musicTag }: { musicTag?: { name?: string } }) => musicTag?.name,
		).filter((name): name is string => Boolean(name)) || [];
	const eventTags =
		event.EventEventTag?.map(
			({ eventTag }: { eventTag?: { name?: string } }) => eventTag?.name,
		).filter((name): name is string => Boolean(name)) || [];

	// Process URLs to include UTM parameters
	const clubUrl = event.club?.url ? addUtmParams(event.club.url) : null;
	const ticketsUrl = event.ticketsUrl ? addUtmParams(event.ticketsUrl) : null;
	const eventCanonicalUrl = event.eventCaniconalUrl
		? addUtmParams(event.eventCaniconalUrl)
		: null;

	// For debugging - remove in production
	React.useEffect(() => {
		if (event.ticketsUrl) {
			console.log("Original ticket URL:", event.ticketsUrl);
			console.log("Processed ticket URL:", ticketsUrl);
		}
	}, [event.ticketsUrl, ticketsUrl]);

	return (
		<Card
			className={`w-full transition-all duration-300 hover:shadow-lg bg-[#1e1e1e] border-[#333] ${promoted ? "border-[#bef264]" : "border-[#333]"}`}
		>
			<Dialog>
				<DialogTrigger asChild>
					<div className="cursor-pointer">
						<div className="flex flex-row gap-3 p-3 relative">
							{/* Event Image */}
							<div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 rounded-md overflow-hidden">
								{selectedImage && (
									<Image
										src={selectedImage}
										alt={`${event.name} at ${event.clubName} event poster`}
										fill
										className="object-cover"
										placeholder="blur"
										blurDataURL={selectedImage}
										priority={index < 3}
									/>
								)}
								{soldOut && (
									<div className="absolute inset-0 bg-black/70 flex items-center justify-center">
										<span className="text-white font-bold text-sm md:text-base transform rotate-[-20deg] bg-red-600 px-2 py-1 rounded-sm">
											SOLD OUT
										</span>
									</div>
								)}
							</div>

							{/* Event Details */}
							<div className="flex-1 min-w-0 pr-8">
								{/* Event Name and Venue */}
								<h2 className="text-lg md:text-xl font-bold line-clamp-1 text-white hover:text-[#bef264] transition-colors">
									{event.name}
								</h2>
								<h3 className="text-base md:text-lg font-medium line-clamp-1 text-white/80">
									{event.clubName}
								</h3>

								{/* Add description with line clamp */}
								{(event.shortEnglishDescription ||
									event.longEnglishDescription) && (
									<p className="text-sm text-white/80 line-clamp-2 mt-1">
										{event.shortEnglishDescription ||
											event.longEnglishDescription}
									</p>
								)}

								{/* Date and Time */}
								<div className="flex items-center mt-1 text-sm text-white/70">
									<CalendarIcon size={14} className="mr-1 flex-shrink-0" />
									<span className="line-clamp-1">{event.eventDate}</span>
									{event.eventStartTime && (
										<>
											<span className="mx-1">·</span>
											<ClockIcon size={14} className="mr-1 flex-shrink-0" />
											<span>{event.eventStartTime}</span>
										</>
									)}
								</div>

								{/* Tags Section - Condensed for mobile */}
								<div className="mt-2 flex flex-wrap gap-1">
									{musicTags.length > 0 &&
										musicTags.slice(0, 2).map((tag: string) => (
											<Badge
												key={`music-${tag}-${event.id}`}
												variant="secondary"
												className="bg-[#bef264]/90 text-background text-xs"
											>
												{tag && tag.length > 10
													? `${tag.slice(0, 10)}...`
													: tag}
											</Badge>
										))}
									{eventTags.length > 0 &&
										eventTags.slice(0, 2).map((tag: string) => (
											<Badge
												key={`event-${tag}-${event.id}`}
												variant="secondary"
												className="bg-[#f665f9]/90 text-background text-xs"
											>
												{tag && tag.length > 10
													? `${tag.slice(0, 10)}...`
													: tag}
											</Badge>
										))}
									{musicTags.length + eventTags.length > 4 && (
										<Badge
											variant="outline"
											className="text-xs text-white border-white/20"
										>
											+{musicTags.length + eventTags.length - 4} more
										</Badge>
									)}
								</div>
							</div>

							{/* Actions Menu */}
							<div className="absolute top-2 right-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 rounded-full hover:bg-white/10"
										>
											<EllipsisIcon size={18} className="text-white" />
											<span className="sr-only">Open menu</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="bg-[#1e1e1e] border-[#333]"
									>
										<DropdownMenuItem
											onClick={() => copyToClipboard({ event })}
											className="text-white hover:text-white hover:bg-white/10"
										>
											<LinkIcon size={16} className="mr-2 text-white" />
											<span>Copy Link</span>
										</DropdownMenuItem>
										{process.env.NEXT_PUBLIC_APP_TYPE === "web" &&
											isFuture(new Date(event.eventDate)) && (
												<DropdownMenuItem className="text-white hover:text-white hover:bg-white/10">
													<CalendarIcon size={16} className="mr-2 text-white" />
													<Link href={`/promote/event/${event.id}`}>
														<span>Promote this event</span>
													</Link>
												</DropdownMenuItem>
											)}
										<DropdownMenuItem
											onClick={reportEvent}
											className="text-white hover:text-white hover:bg-white/10"
										>
											<FlagIcon size={16} className="mr-2 text-white" />
											<span>Report</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
				</DialogTrigger>

				{/* Detail Dialog */}
				<DialogContent className="max-w-3xl w-full bg-[#121212] border border-[#333]">
					<DialogHeader>
						<DialogTitle className="text-xl md:text-2xl text-white">
							{event.name}
						</DialogTitle>
						<DialogDescription className="text-white/70">
							<span className="font-medium text-white/90">
								{event.clubName}
							</span>{" "}
							• {event.eventDate}{" "}
							{event.eventStartTime && `• ${event.eventStartTime}`}
						</DialogDescription>
					</DialogHeader>

					<ScrollArea className="max-h-[70vh]">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
							{/* Event Image and Primary Actions */}
							<div className="space-y-4">
								<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
									{selectedImage && (
										<Image
											src={selectedImage}
											alt={`${event.name} event poster`}
											fill
											className="object-cover"
										/>
									)}
									{soldOut && (
										<div className="absolute inset-0 bg-black/70 flex items-center justify-center">
											<span className="text-white font-bold text-2xl transform rotate-[-20deg] bg-red-600 px-4 py-2 rounded">
												SOLD OUT
											</span>
										</div>
									)}
								</div>

								<div className="flex flex-col gap-2">
									{clubUrl && (
										<Button
											variant="default"
											asChild
											className="w-full bg-[#bef264] text-[#121212] hover:bg-[#a8dd4e]"
										>
											<Link
												href={clubUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												View Original Event
											</Link>
										</Button>
									)}

									{ticketsUrl && (
										<Button
											variant="outline"
											asChild
											className="w-full border-[#444] text-white hover:bg-[#333]"
										>
											<Link
												href={ticketsUrl}
												target="_blank"
												rel="noopener noreferrer"
												data-type="ticket-link"
											>
												<TicketIcon size={16} className="mr-2" />
												Buy Tickets
											</Link>
										</Button>
									)}

									{eventCanonicalUrl && (
										<Button
											variant="secondary"
											asChild
											className="w-full bg-[#222] hover:bg-[#333] text-white"
										>
											<Link
												href={eventCanonicalUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<LinkIcon size={16} className="mr-2" />
												Event Link
											</Link>
										</Button>
									)}
								</div>
							</div>

							{/* Event Details */}
							<div className="space-y-4">
								{/* Event Info */}
								<Card className="border-[#333] bg-[#1e1e1e]">
									<CardContent className="pt-6">
										<div className="space-y-3">
											{event.entryPrice !== 0 && (
												<div className="flex items-center">
													<EuroIcon size={16} className="mr-2 text-white/70" />
													<span className="font-medium mr-2 text-white/90">
														Entry Price:
													</span>
													<span className="text-white">{event.entryPrice}</span>
												</div>
											)}

											{musicTags.length > 0 && (
												<div>
													<div className="flex items-center mb-1">
														<Music2Icon
															size={16}
															className="mr-1 text-white/70"
														/>
														<span className="font-medium text-white/90">
															Music:
														</span>
													</div>
													<div className="flex flex-wrap gap-1">
														{musicTags.map((tag: string) => (
															<Badge
																key={`music-detail-${tag}-${event.id}`}
																variant="secondary"
																className="bg-[#bef264]/90 text-background"
															>
																{tag}
															</Badge>
														))}
													</div>
												</div>
											)}

											{eventTags.length > 0 && (
												<div className="mt-2">
													<div className="flex items-center mb-1">
														<TagsIcon
															size={16}
															className="mr-1 text-white/70"
														/>
														<span className="font-medium text-white/90">
															Event Tags:
														</span>
													</div>
													<div className="flex flex-wrap gap-1">
														{eventTags.map((tag) => (
															<Badge
																key={`event-detail-${tag}-${event.id}`}
																variant="secondary"
																className="bg-[#f665f9]/90 text-background"
															>
																{tag}
															</Badge>
														))}
													</div>
												</div>
											)}

											{event.artists && event.artists.length > 0 && (
												<div className="mt-2">
													<span className="font-medium block mb-1 text-white/90">
														Artists:
													</span>
													<div className="flex flex-wrap gap-1">
														{event.artists.map((artist: string) => (
															<Badge
																key={`artist-${artist}-${event.id}`}
																variant="outline"
																className="border-[#444] text-white"
															>
																{artist}
															</Badge>
														))}
													</div>
												</div>
											)}

											{event.organizers && event.organizers.length > 0 && (
												<div className="mt-2">
													<span className="font-medium block mb-1 text-white/90">
														Organizers:
													</span>
													<div className="flex flex-wrap gap-1">
														{event.organizers.map((organizer: string) => (
															<Badge
																key={`organizer-${organizer}-${event.id}`}
																variant="outline"
																className="border-[#444] text-white"
															>
																{organizer}
															</Badge>
														))}
													</div>
												</div>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Description */}
								{event.longEnglishDescription && (
									<Card className="border-[#333] bg-[#1e1e1e]">
										<CardHeader className="pb-2">
											<CardTitle className="text-lg text-white">
												Description
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-white/80">
												{event.longEnglishDescription}
											</p>
										</CardContent>
									</Card>
								)}
							</div>

							{/* Map Section - Full Width */}
							{event.club?.location?.latitude &&
								event.club?.location?.longitude && (
									<div className="col-span-1 md:col-span-2 mt-2">
										<div className="flex items-center mb-2">
											<MapPinIcon size={16} className="mr-1 text-white/70" />
											<span className="font-medium text-white/90">
												Location
											</span>
										</div>
										<div className="h-48 w-full rounded-lg overflow-hidden">
											<Mapbox
												latitude={event.club.location.latitude}
												longitude={event.club.location.longitude}
												zoom={14}
											/>
										</div>
									</div>
								)}
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</Card>
	);
};

export default TextEventItem;
