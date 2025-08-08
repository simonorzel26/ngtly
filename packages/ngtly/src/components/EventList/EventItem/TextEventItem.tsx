"use client";

import { formatDistanceToNow } from "date-fns";
import {
	BuildingIcon,
	CalendarIcon,
	ClockIcon,
	EuroIcon,
	LinkIcon,
	MapPinIcon,
	Music2Icon,
	RefreshCwIcon,
	StarIcon,
	TagsIcon,
	TicketIcon,
	UsersIcon,
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
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getImageUrlFromEventId } from "./images";

const addUtmParams = (url: string): string => {
	if (!url) return url;

	try {
		const urlObj = new URL(url);
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
	const soldOut = event.EventEventTag?.find(
		(tag: { eventTag?: { name?: string } }) =>
			tag.eventTag?.name === "Sold Out",
	);

	const selectedImage = useMemo(() => {
		if (event.eventImage) {
			try {
				new URL(event.eventImage);
				return event.eventImage;
			} catch {
				console.warn(
					`Invalid event image URL for event ${event.id}: ${event.eventImage}`,
				);
			}
		}
		return getImageUrlFromEventId(event.id);
	}, [event.id, event.eventImage]);

	const musicTags =
		event.EventMusicTag?.map(
			({ musicTag }: { musicTag?: { name?: string } }) => musicTag?.name,
		).filter((name): name is string => Boolean(name)) || [];
	const eventTags =
		event.EventEventTag?.map(
			({ eventTag }: { eventTag?: { name?: string } }) => eventTag?.name,
		).filter((name): name is string => Boolean(name)) || [];

	const clubUrl = event.club?.url ? addUtmParams(event.club.url) : null;
	const ticketsUrl = event.ticketsUrl ? addUtmParams(event.ticketsUrl) : null;
	const eventCanonicalUrl = event.eventCaniconalUrl
		? addUtmParams(event.eventCaniconalUrl)
		: null;

	// Format date for display
	const formatEventDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return "Today";
		}
		if (date.toDateString() === tomorrow.toDateString()) {
			return "Tomorrow";
		}
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Card className="group relative overflow-hidden bg-[#1e1e1e] border border-[#333] hover:border-[#444] transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
			{/* Promotion Badge */}
			{event.promoted && (
				<div className="absolute top-3 left-3 z-20">
					<Badge className="bg-[#bef264] text-[#121212] font-semibold px-2 py-1 text-xs">
						<StarIcon size={12} className="mr-1" />
						PROMOTED
					</Badge>
				</div>
			)}

			{/* Sold Out Overlay */}
			{soldOut && (
				<div className="absolute top-3 right-3 z-20">
					<Badge className="bg-red-600 text-white font-semibold px-2 py-1 text-xs">
						SOLD OUT
					</Badge>
				</div>
			)}

			<Dialog>
				<DialogTrigger asChild>
					<div className="cursor-pointer">
						{/* Main Card Content */}
						<div className="flex flex-col md:flex-row gap-4 p-4">
							{/* Event Image */}
							<div className="relative h-32 w-full md:h-24 md:w-24 flex-shrink-0 rounded-lg overflow-hidden ring-2 ring-[#333] group-hover:ring-[#444] transition-all">
								{selectedImage && (
									<Image
										src={selectedImage}
										alt={`${event.name} at ${event.clubName} event poster`}
										fill
										className="object-cover transition-transform group-hover:scale-105"
										placeholder="blur"
										blurDataURL={selectedImage}
										priority={index < 3}
									/>
								)}
							</div>

							{/* Event Details */}
							<div className="flex-1 min-w-0">
								{/* Header Row */}
								<div className="flex items-start justify-between mb-2">
									<div className="flex-1 min-w-0">
										<h2 className="text-lg font-bold line-clamp-2 text-white group-hover:text-[#bef264] transition-colors mb-1">
											{event.name}
										</h2>
										<div className="flex items-center gap-2 text-sm text-white/70">
											<BuildingIcon size={14} className="flex-shrink-0" />
											<span className="line-clamp-1">{event.clubName}</span>
										</div>
									</div>

									{/* Share Button */}
									<Button
										onClick={(e) => {
											e.stopPropagation();
											copyToClipboard({ event });
										}}
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<LinkIcon size={16} className="text-white" />
									</Button>
								</div>

								{/* Key Info Row */}
								<div className="flex items-center gap-4 mb-3 text-sm">
									<div className="flex items-center text-white/70">
										<CalendarIcon size={14} className="mr-1 flex-shrink-0" />
										<span className="font-medium">
											{formatEventDate(event.eventDate)}
										</span>
									</div>
									{event.eventStartTime && (
										<div className="flex items-center text-white/70">
											<ClockIcon size={14} className="mr-1 flex-shrink-0" />
											<span>{event.eventStartTime}</span>
										</div>
									)}
									{event.entryPrice !== 0 && (
										<div className="flex items-center text-white">
											<EuroIcon size={14} className="mr-1 flex-shrink-0" />
											<span className="font-semibold">€{event.entryPrice}</span>
										</div>
									)}
									{event.city && (
										<div className="flex items-center text-white/70">
											<MapPinIcon size={14} className="mr-1 flex-shrink-0" />
											<span className="capitalize">{event.city}</span>
										</div>
									)}
								</div>

								{/* Description */}
								{(event.shortEnglishDescription ||
									event.longEnglishDescription) && (
									<p className="text-sm text-white/70 line-clamp-2 mb-3">
										{event.shortEnglishDescription ||
											event.longEnglishDescription}
									</p>
								)}

								{/* Artists Information - Only show if prominent */}
								{event.artists &&
									event.artists.length > 0 &&
									event.artists.length <= 3 && (
										<div className="flex items-center gap-1 text-sm text-white/80 mb-2">
											<UsersIcon size={14} className="flex-shrink-0" />
											<span className="line-clamp-1">
												{event.artists.join(", ")}
											</span>
										</div>
									)}

								{/* Tags Section - Simplified */}
								<div className="flex flex-wrap gap-1.5">
									{/* Music Tags - Show only first 2 */}
									{musicTags.slice(0, 2).map((tag: string) => (
										<Badge
											key={`music-${tag}-${event.id}`}
											variant="secondary"
											className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium"
										>
											{tag && tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
										</Badge>
									))}

									{/* Event Tags - Show only first 2 */}
									{eventTags.slice(0, 2).map((tag: string) => (
										<Badge
											key={`event-${tag}-${event.id}`}
											variant="secondary"
											className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-medium"
										>
											{tag && tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
										</Badge>
									))}

									{/* Show more indicator if there are more tags */}
									{musicTags.length + eventTags.length > 4 && (
										<Badge
											variant="outline"
											className="text-xs text-white/60 border-[#444]"
										>
											+{musicTags.length + eventTags.length - 4} more
										</Badge>
									)}
								</div>
							</div>
						</div>
					</div>
				</DialogTrigger>

				{/* Detail Dialog */}
				<DialogContent className="max-w-6xl w-full bg-[#1e1e1e] border border-[#333]">
					<DialogHeader className="pb-4">
						<DialogTitle className="text-2xl md:text-3xl text-white">
							{event.name}
						</DialogTitle>
						<DialogDescription className="text-white/70 text-lg">
							<span className="font-medium text-white">{event.clubName}</span> •{" "}
							{formatEventDate(event.eventDate)}{" "}
							{event.eventStartTime && `• ${event.eventStartTime}`}
							{event.city && ` • ${event.city}`}
						</DialogDescription>
					</DialogHeader>

					<ScrollArea className="max-h-[85vh]">
						<div className="grid grid-cols-1 xl:grid-cols-4 gap-6 p-1">
							{/* Left Column - Image and Actions */}
							<div className="space-y-4">
								{/* Smaller Event Image - More Minimalist */}
								<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
									{selectedImage && (
										<Image
											src={selectedImage}
											alt={`${event.name} event poster`}
											fill
											className="object-cover"
										/>
									)}
								</div>

								{/* Action Buttons */}
								<div className="flex flex-col gap-3">
									{clubUrl && (
										<Button
											variant="default"
											asChild
											className="w-full bg-[#bef264] text-[#121212] hover:bg-[#a8dd4e] font-medium"
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
											className="w-full border-[#444] text-white hover:bg-[#333] font-medium"
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

								{/* Enhanced Event Statistics */}
								<Card className="border-[#333] bg-[#1a1a1a]">
									<CardHeader className="pb-3">
										<CardTitle className="text-lg text-white flex items-center">
											<RefreshCwIcon size={18} className="mr-2" />
											Event Details
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3 text-sm">
											<div className="flex items-center justify-between">
												<span className="text-white/70">Entry Price:</span>
												<span className="text-white font-semibold">
													{event.entryPrice !== 0
														? `€${event.entryPrice}`
														: "Free"}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-white/70">Music Tags:</span>
												<span className="text-white">{musicTags.length}</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-white/70">Event Tags:</span>
												<span className="text-white">{eventTags.length}</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-white/70">Artists:</span>
												<span className="text-white">
													{event.artists?.length || 0}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-white/70">Organizers:</span>
												<span className="text-white">
													{event.organizers?.length || 0}
												</span>
											</div>
											{event.promoted && (
												<div className="flex items-center justify-between">
													<span className="text-white/70">Status:</span>
													<Badge className="bg-[#bef264] text-[#121212] text-xs">
														PROMOTED
													</Badge>
												</div>
											)}
											{event.scrapedAt && (
												<div className="flex items-center justify-between">
													<span className="text-white/70">Updated:</span>
													<span className="text-white/80 text-xs">
														{formatDistanceToNow(new Date(event.scrapedAt))} ago
													</span>
												</div>
											)}
											{event.url && (
												<div className="flex items-center justify-between">
													<span className="text-white/70">Source URL:</span>
													<span className="text-white/80 text-xs truncate max-w-[120px]">
														{event.url}
													</span>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Center Column - Main Event Details */}
							<div className="space-y-4">
								{/* Description */}
								{event.longEnglishDescription && (
									<Card className="border-[#333] bg-[#1a1a1a]">
										<CardHeader className="pb-3">
											<CardTitle className="text-lg text-white">
												Description
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-white/80 leading-relaxed">
												{event.longEnglishDescription}
											</p>
										</CardContent>
									</Card>
								)}

								{/* Artists */}
								{event.artists && event.artists.length > 0 && (
									<Card className="border-[#333] bg-[#1a1a1a]">
										<CardHeader className="pb-3">
											<CardTitle className="text-lg text-white flex items-center">
												<UsersIcon size={18} className="mr-2" />
												Artists
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-1.5">
												{event.artists.map((artist: string) => (
													<Badge
														key={`artist-${artist}-${event.id}`}
														variant="outline"
														className="border-[#444] text-white/80"
													>
														{artist}
													</Badge>
												))}
											</div>
										</CardContent>
									</Card>
								)}

								{/* Organizers */}
								{event.organizers && event.organizers.length > 0 && (
									<Card className="border-[#333] bg-[#1a1a1a]">
										<CardHeader className="pb-3">
											<CardTitle className="text-lg text-white flex items-center">
												<UsersIcon size={18} className="mr-2" />
												Organizers
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-1.5">
												{event.organizers.map((organizer: string) => (
													<Badge
														key={`organizer-${organizer}-${event.id}`}
														variant="outline"
														className="border-[#444] text-white/80"
													>
														{organizer}
													</Badge>
												))}
											</div>
										</CardContent>
									</Card>
								)}

								{/* Venue Location */}
								{event.club?.location?.fullAddress && (
									<Card className="border-[#333] bg-[#1a1a1a]">
										<CardHeader className="pb-3">
											<CardTitle className="text-lg text-white flex items-center">
												<MapPinIcon size={18} className="mr-2" />
												Location
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-white/80">
												{event.club.location.fullAddress}
											</p>
										</CardContent>
									</Card>
								)}
							</div>

							{/* Third Column - Music and Event Categories */}
							<div className="space-y-4">
								{/* Music Tags */}
								{musicTags.length > 0 && (
									<Card className="border-[#333] bg-[#1a1a1a]">
										<CardHeader className="pb-3">
											<CardTitle className="text-lg text-white flex items-center">
												<Music2Icon size={18} className="mr-2" />
												Music Tags
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-1.5">
												{musicTags.map((tag: string) => (
													<Badge
														key={`music-detail-${tag}-${event.id}`}
														variant="secondary"
														className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
													>
														{tag}
													</Badge>
												))}
											</div>
										</CardContent>
									</Card>
								)}

								{/* Event Tags */}
								{eventTags.length > 0 && (
									<Card className="border-[#333] bg-[#1a1a1a]">
										<CardHeader className="pb-3">
											<CardTitle className="text-lg text-white flex items-center">
												<TagsIcon size={18} className="mr-2" />
												Event Tags
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-1.5">
												{eventTags.map((tag) => (
													<Badge
														key={`event-detail-${tag}-${event.id}`}
														variant="secondary"
														className="bg-gradient-to-r from-purple-500 to-pink-600 text-white"
													>
														{tag}
													</Badge>
												))}
											</div>
										</CardContent>
									</Card>
								)}

								{/* Music Types */}
								{event.musicTypesEnglish &&
									event.musicTypesEnglish.length > 0 && (
										<Card className="border-[#333] bg-[#1a1a1a]">
											<CardHeader className="pb-3">
												<CardTitle className="text-lg text-white flex items-center">
													<Music2Icon size={18} className="mr-2" />
													Music Styles
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="flex flex-wrap gap-1.5">
													{event.musicTypesEnglish.map((type: string) => (
														<Badge
															key={`music-style-${type}-${event.id}`}
															variant="outline"
															className="border-[#444] text-white/80"
														>
															{type}
														</Badge>
													))}
												</div>
											</CardContent>
										</Card>
									)}
							</div>

							{/* Fourth Column - Event Types and Party Types */}
							<div className="space-y-4">
								{/* Event Types */}
								{event.eventTypesEnglish &&
									event.eventTypesEnglish.length > 0 && (
										<Card className="border-[#333] bg-[#1a1a1a]">
											<CardHeader className="pb-3">
												<CardTitle className="text-lg text-white flex items-center">
													<TagsIcon size={18} className="mr-2" />
													Event Types
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="flex flex-wrap gap-1.5">
													{event.eventTypesEnglish.map((type: string) => (
														<Badge
															key={`event-type-${type}-${event.id}`}
															variant="outline"
															className="border-[#444] text-white/80"
														>
															{type}
														</Badge>
													))}
												</div>
											</CardContent>
										</Card>
									)}

								{/* Party Types */}
								{event.partyTypesEnglish &&
									event.partyTypesEnglish.length > 0 && (
										<Card className="border-[#333] bg-[#1a1a1a]">
											<CardHeader className="pb-3">
												<CardTitle className="text-lg text-white flex items-center">
													<TagsIcon size={18} className="mr-2" />
													Party Types
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="flex flex-wrap gap-1.5">
													{event.partyTypesEnglish.map((type: string) => (
														<Badge
															key={`party-type-${type}-${event.id}`}
															variant="outline"
															className="border-[#444] text-white/80"
														>
															{type}
														</Badge>
													))}
												</div>
											</CardContent>
										</Card>
									)}

								{/* Club Information */}
								{event.club && (
									<Card className="border-[#333] bg-[#1a1a1a]">
										<CardHeader className="pb-3">
											<CardTitle className="text-lg text-white flex items-center">
												<BuildingIcon size={18} className="mr-2" />
												Club Information
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2 text-sm">
												<div className="flex items-center justify-between">
													<span className="text-white/70">Club Name:</span>
													<span className="text-white">{event.club.name}</span>
												</div>
												{event.club.url && (
													<div className="flex items-center justify-between">
														<span className="text-white/70">Club URL:</span>
														<span className="text-white/80 text-xs truncate max-w-[120px]">
															{event.club.url}
														</span>
													</div>
												)}
												{event.club.lastScrapedAt && (
													<div className="flex items-center justify-between">
														<span className="text-white/70">Club Updated:</span>
														<span className="text-white/80 text-xs">
															{formatDistanceToNow(
																new Date(event.club.lastScrapedAt),
															)}{" "}
															ago
														</span>
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								)}
							</div>

							{/* Map Section - Full Width */}
							{event.club?.location?.latitude &&
								event.club?.location?.longitude && (
									<div className="col-span-1 xl:col-span-4 mt-4">
										<Card className="border-[#333] bg-[#1a1a1a]">
											<CardHeader className="pb-3">
												<CardTitle className="text-lg text-white flex items-center">
													<MapPinIcon size={18} className="mr-2" />
													Location
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="h-80 w-full rounded-lg overflow-hidden border border-[#333]">
													<Mapbox
														latitude={event.club.location.latitude}
														longitude={event.club.location.longitude}
														zoom={14}
													/>
												</div>
											</CardContent>
										</Card>
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
