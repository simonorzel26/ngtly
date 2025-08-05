"use client";

import type { PromotedEvent } from "@prisma/ngtlyClient";
import {
	addDays,
	endOfDay,
	format,
	isToday,
	isTomorrow,
	parseISO,
	startOfDay,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { EventsTypeOutput } from "~/app/[citySlug]/page";
import GMW from "~/components/GlobalMaxWidth";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import Logo from "../Logo";
import TextEventItem from "./EventItem/TextEventItem";

interface EventListProps {
	events: EventsTypeOutput;
	club?: string;
	searchParams?: { [key: string]: string | undefined };
	promotedEvents?: PromotedEvent[];
	countryName: string;
	cityName: string;
	eventCounts?: {
		today: number;
		tomorrow: number;
		weekend: number;
	};
}

// Helper function to get upcoming weekend dates
const getWeekendDates = (): [Date, Date] => {
	const today = new Date();
	const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

	// Calculate days until Friday
	let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
	// If today is Friday, set to 0
	if (dayOfWeek === 5) daysUntilFriday = 0;

	// Calculate days until Sunday
	const daysUntilSunday = (7 - dayOfWeek + 7) % 7;

	// If it's already the weekend (Friday-Sunday), use current weekend
	if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
		// If it's Friday
		if (dayOfWeek === 5) {
			return [startOfDay(today), endOfDay(addDays(today, 2))]; // Friday to Sunday
		}
		// If it's Saturday
		if (dayOfWeek === 6) {
			return [startOfDay(addDays(today, -1)), endOfDay(addDays(today, 1))]; // Friday to Sunday
		}
		// If it's Sunday

		return [startOfDay(addDays(today, -2)), endOfDay(today)]; // Friday to Sunday
	}

	const fridayDate = addDays(today, daysUntilFriday);
	const sundayDate = addDays(today, daysUntilSunday);

	return [startOfDay(fridayDate), endOfDay(sundayDate)];
};

// Format date to YYYY-MM-DD for URL
const formatDateForUrl = (date: Date): string => {
	return format(date, "yyyy-MM-dd");
};

export default function EventList({
	events,
	club,
	searchParams,
	promotedEvents,
	countryName,
	cityName,
	eventCounts,
}: EventListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const urlParams = useSearchParams();

	const today = startOfDay(new Date());
	const tomorrow = startOfDay(addDays(today, 1));
	const [weekend, weekendEnd] = getWeekendDates();

	// Read date range from URL if available
	const dateRangeParam = urlParams.get("dateRange");
	const dateRangeArray = dateRangeParam?.split(",");

	// Determine initial date type based on URL params
	const getInitialDateType = ():
		| "today"
		| "tomorrow"
		| "weekend"
		| "custom" => {
		if (!dateRangeArray || dateRangeArray.length !== 2) return "today";

		const startDate = dateRangeArray[0] ? parseISO(dateRangeArray[0]) : null;
		const endDate = dateRangeArray[1] ? parseISO(dateRangeArray[1]) : null;

		if (!startDate || !endDate) return "today";

		// Check if it's today (same start and end date, and date is today)
		if (
			format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd") &&
			isToday(startDate)
		) {
			return "today";
		}

		// Check if it's tomorrow
		if (
			format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd") &&
			isTomorrow(startDate)
		) {
			return "tomorrow";
		}

		// Check if it's weekend
		if (
			format(startDate, "yyyy-MM-dd") === format(weekend, "yyyy-MM-dd") &&
			format(endDate, "yyyy-MM-dd") === format(weekendEnd, "yyyy-MM-dd")
		) {
			return "weekend";
		}

		return "custom";
	};

	// Get initial selected date from URL or use today
	const getInitialSelectedDate = (): Date => {
		if (!dateRangeArray || dateRangeArray.length !== 2) return today;

		const startDate = dateRangeArray[0] ? parseISO(dateRangeArray[0]) : null;
		if (!startDate) return today;

		return startDate;
	};

	// State for selected date type (today, tomorrow, weekend, custom)
	const [dateType, setDateType] = useState<
		"today" | "tomorrow" | "weekend" | "custom"
	>(getInitialDateType());

	// State for selected date (defaults to today)
	const [selectedDate, setSelectedDate] = useState<Date>(
		getInitialSelectedDate(),
	);

	// Update URL when date changes
	const updateUrl = (
		type: "today" | "tomorrow" | "weekend" | "custom",
		date?: Date,
	) => {
		let start: Date;
		let end: Date;

		switch (type) {
			case "today":
				start = today;
				end = endOfDay(today);
				break;
			case "tomorrow":
				start = tomorrow;
				end = endOfDay(tomorrow);
				break;
			case "weekend":
				start = weekend;
				end = weekendEnd;
				break;
			case "custom":
				start = date || today;
				end = endOfDay(date || today);
				break;
			default:
				start = today;
				end = endOfDay(today);
		}

		// Format dates for URL
		const dateRangeValue = `${formatDateForUrl(start)},${formatDateForUrl(end)}`;

		// Create new query params
		const params = new URLSearchParams(urlParams.toString());
		params.set("dateRange", dateRangeValue);

		// Update URL with new query params
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const promotedEvent = promotedEvents?.[0];
	const promotedEventId = promotedEvent?.eventId;

	// Handle date selection
	const handleDateSelect = (
		type: "today" | "tomorrow" | "weekend" | "custom",
		date?: Date,
	) => {
		setDateType(type);

		switch (type) {
			case "today":
				setSelectedDate(today);
				break;
			case "tomorrow":
				setSelectedDate(tomorrow);
				break;
			case "weekend":
				setSelectedDate(weekend);
				break;
			case "custom":
				if (date) setSelectedDate(date);
				break;
		}

		// Update URL params
		updateUrl(type, date);
	};

	// Count events for each filter type (fallback for when eventCounts not provided)
	const countEvents = (type: "today" | "tomorrow" | "weekend"): number => {
		return events.filter((event) => {
			try {
				const date = new Date(event.eventDate);

				if (type === "today") return isToday(date);
				if (type === "tomorrow") return isTomorrow(date);
				if (type === "weekend") return date >= weekend && date <= weekendEnd;

				return false;
			} catch (e) {
				return false;
			}
		}).length;
	};

	// Use server-side event counts if available, otherwise fall back to client-side counting
	const todayCount = eventCounts?.today ?? countEvents("today");
	const tomorrowCount = eventCounts?.tomorrow ?? countEvents("tomorrow");
	const weekendCount = eventCounts?.weekend ?? countEvents("weekend");

	return (
		<GMW>
			<div className="flex flex-col w-full">
				{/* Date Filter Section */}
				<div className="py-4 flex flex-wrap gap-2 items-center justify-between bg-[#1a1a1a] rounded-lg p-4 mb-4">
					<div className="flex gap-2">
						<Button
							variant={dateType === "today" ? "default" : "outline"}
							onClick={() => handleDateSelect("today")}
							className={
								dateType === "today"
									? "bg-[#bef264] text-[#121212] hover:bg-[#a8dd4e]"
									: "border-[#333] text-white hover:bg-[#333] hover:text-white"
							}
						>
							Today{todayCount > 0 ? ` (${todayCount})` : ""}
						</Button>
						<Button
							variant={dateType === "tomorrow" ? "default" : "outline"}
							onClick={() => handleDateSelect("tomorrow")}
							className={
								dateType === "tomorrow"
									? "bg-[#bef264] text-[#121212] hover:bg-[#a8dd4e]"
									: "border-[#333] text-white hover:bg-[#333] hover:text-white"
							}
						>
							Tomorrow{tomorrowCount > 0 ? ` (${tomorrowCount})` : ""}
						</Button>
						<Button
							variant={dateType === "weekend" ? "default" : "outline"}
							onClick={() => handleDateSelect("weekend")}
							className={
								dateType === "weekend"
									? "bg-[#bef264] text-[#121212] hover:bg-[#a8dd4e]"
									: "border-[#333] text-white hover:bg-[#333] hover:text-white"
							}
						>
							Weekend{weekendCount > 0 ? ` (${weekendCount})` : ""}
						</Button>
					</div>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									"min-w-[240px] justify-start text-left border-[#333] text-white hover:bg-[#333] hover:text-white",
									dateType === "custom" && "bg-[#333] text-white",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-auto p-0 bg-[#1e1e1e] border-[#333]"
							align="start"
						>
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={(date) => date && handleDateSelect("custom", date)}
								initialFocus
								className="bg-[#1e1e1e] text-white"
							/>
						</PopoverContent>
					</Popover>
				</div>

				{/* Event List */}
				{events.length > 0 ? (
					<div className="flex flex-col gap-4 w-full mb-4">
						{/* We're not filtering client-side anymore since we're triggering server fetches */}
						{/* The server already gives us the filtered events based on the URL params */}
						{events.map((event, index) => (
							<TextEventItem
								key={event.id}
								event={event}
								club={club}
								index={index}
								countryName={countryName}
								promoted={event.id === promotedEventId}
							/>
						))}
					</div>
				) : (
					<main className="max-w-7xl mx-auto p-10 text-white text-center bg-transparent">
						<Logo size="md" />
						<h3 className="text-2xl font-extrabold mt-4 mb-8">
							No events found for this date.
						</h3>
						<p className="text-lg mb-4">
							Try selecting another date, or check back soon.
						</p>
						<Link href="/" className="text-[#bef264] hover:underline">
							Back to the homepage
						</Link>
					</main>
				)}
			</div>
		</GMW>
	);
}
