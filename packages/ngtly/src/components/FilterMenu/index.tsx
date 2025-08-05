"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	addDays,
	endOfDay,
	format,
	getDay,
	isSameDay,
	parseISO,
	startOfDay,
	startOfToday,
	startOfTomorrow,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "~/lib/utils";
import GP from "../GlobalPadding";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const formSchema = z.object({
	quickDate: z.string(),
	dateRange: z.object({
		from: z.date(),
		to: z.date(),
	}),
	clubs: z.array(z.string()),
	musicTypes: z.array(z.string()),
	partyTypes: z.array(z.string()),
	eventTypes: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface Option {
	id: string;
	label: string;
	count?: number;
}

interface FilterMenuProps {
	musicTypes: Option[];
	partyTypes: Option[];
	eventTypes: Option[];
	clubFilters: Option[];
	children: React.ReactNode;
}

const getNextFridayAndSunday = (today: Date): [Date, Date] => {
	const dayOfWeek = getDay(today);
	const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
	const daysUntilSunday = (7 - dayOfWeek + 7) % 7;
	const nextFriday = startOfDay(addDays(today, daysUntilFriday));
	const nextSunday = startOfDay(addDays(today, daysUntilSunday));
	return [nextFriday, nextSunday];
};

const checkIfTodayTomorrowOrWeekend = (
	dateRange: string[] | undefined,
	weekendDates: Date[],
): string => {
	const today = startOfDay(new Date());
	const tomorrow = startOfDay(addDays(today, 1));
	const formattedToday = format(today, "yyyy-MM-dd");
	const formattedTomorrow = format(tomorrow, "yyyy-MM-dd");

	if (!dateRange) return "today";
	if (dateRange[0] === dateRange[1]) {
		if (dateRange[0] === formattedToday) return "today";
		if (dateRange[0] === formattedTomorrow) return "tomorrow";
	}
	if (
		weekendDates[0] &&
		weekendDates[1] &&
		dateRange[0] === format(weekendDates[0], "yyyy-MM-dd") &&
		dateRange[1] === format(weekendDates[1], "yyyy-MM-dd")
	) {
		return "weekend";
	}
	return "range";
};

const FilterMenu: React.FC<FilterMenuProps> = ({
	musicTypes,
	partyTypes,
	eventTypes,
	clubFilters,
	children,
}) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const today = startOfToday();
	const tomorrowsDate = startOfTomorrow();
	const weekendDates = getNextFridayAndSunday(today);
	const dateRangeParams = searchParams.get("dateRange")?.split(",");
	const quickDateParam = searchParams.get("d");

	const quickDate =
		quickDateParam ||
		checkIfTodayTomorrowOrWeekend(dateRangeParams, weekendDates);

	const getSearchParams = (key: string): string[] =>
		searchParams
			.get(key)
			?.split(",")
			.filter((i) => i !== "") || [];

	const [showAllClubs, setShowAllClubs] = useState(false);
	const [isClient, setIsClient] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			quickDate,
			dateRange: {
				from:
					quickDateParam === "weekend"
						? weekendDates[0]
						: dateRangeParams?.[0]
							? startOfDay(parseISO(dateRangeParams[0]))
							: today,
				to:
					quickDateParam === "weekend"
						? weekendDates[1]
						: dateRangeParams?.[1]
							? endOfDay(parseISO(dateRangeParams[1]))
							: dateRangeParams?.[0]
								? endOfDay(parseISO(dateRangeParams[0]))
								: endOfDay(today),
			},
			clubs: getSearchParams("clubs"),
			musicTypes: getSearchParams("musicTypes"),
			partyTypes: getSearchParams("partyTypes"),
			eventTypes: getSearchParams("eventTypes"),
		},
	});

	const createQueryString = useCallback(
		(params: Record<string, string | string[]>) => {
			const urlParams = new URLSearchParams(searchParams.toString());
			Object.entries(params).map(([key, value]) => {
				if (Array.isArray(value) && value.length > 0) {
					urlParams.set(key, value.join(","));
				} else if (typeof value === "string" && value !== "") {
					urlParams.set(key, value);
				} else {
					urlParams.delete(key);
				}
			});
			return urlParams.toString();
		},
		[searchParams],
	);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!searchParams) return;
		const formValues = form.getValues();
		const params: Record<string, string | string[]> = {
			d: formValues.quickDate,
			dateRange: `${format(formValues.dateRange.from, "yyyy-MM-dd")},${format(formValues.dateRange.to, "yyyy-MM-dd")}`,
			clubs: formValues.clubs,
			musicTypes: formValues.musicTypes,
			partyTypes: formValues.partyTypes,
			eventTypes: formValues.eventTypes,
		};

		router.push(`${pathname}?${createQueryString(params)}`, { scroll: false });
	}, [form.watch(), createQueryString, pathname, router, searchParams]);

	const renderDateButtons = () => (
		<div className="md:hidden flex justify-start items-center align-middle space-x-2">
			<Button
				type="button"
				id="date-today"
				onClick={() => form.setValue("dateRange", { from: today, to: today })}
			>
				Today
			</Button>
			<Button
				type="button"
				id="date-tomorrow"
				onClick={() =>
					form.setValue("dateRange", { from: tomorrowsDate, to: tomorrowsDate })
				}
			>
				Tomorrow
			</Button>
			<Button
				type="button"
				id="date-weekend"
				onClick={() =>
					form.setValue("dateRange", {
						from: weekendDates[0],
						to: weekendDates[1],
					})
				}
			>
				Weekend
			</Button>
		</div>
	);

	const renderDateRangeField = () => (
		<FormField
			control={form.control}
			name="dateRange"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="hidden md:flex">Date Range</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								aria-label="Select date range"
								id="date"
								variant="outline"
								className={cn(
									"w-full h-auto justify-start text-left font-normal",
									!field.value && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{field.value.from && (
									<div className="flex flex-col">
										<div>
											{format(field.value.from, "LLL dd, y")}
											{field.value.to &&
												!isSameDay(field.value.from, field.value.to) &&
												" - "}
										</div>
										{field.value.to &&
											!isSameDay(field.value.from, field.value.to) && (
												<div>{format(field.value.to, "LLL dd, y")}</div>
											)}
									</div>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={field.value.from}
								selected={field.value}
								onSelect={(range) => {
									if (!range?.from) return;
									const to = range.to
										? endOfDay(range.to)
										: endOfDay(range.from);
									field.onChange({ from: startOfDay(range.from), to });
									form.setValue("quickDate", "range");
								}}
								numberOfMonths={1}
								className="bg-secondary"
							/>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);

	const renderCheckboxGroup = (
		name: keyof FormValues,
		options: Option[],
		label: string,
	) => (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<div className="mb-2">
						<FormLabel className="text-base">{label}</FormLabel>
					</div>
					{options.slice(0, showAllClubs ? options.length : 3).map((item) => (
						<FormField
							key={item.id}
							control={form.control}
							name={name}
							render={({ field }) => (
								<FormItem
									key={item.id}
									className="flex flex-row items-start space-x-3 space-y-0"
								>
									<FormControl>
										<Checkbox
											aria-label={item.label}
											checked={
												Array.isArray(field.value) &&
												field.value.includes(item.id)
											}
											onCheckedChange={(checked) => {
												if (Array.isArray(field.value)) {
													const updatedValue = checked
														? [...field.value, item.id]
														: field.value.filter((value) => value !== item.id);
													field.onChange(updatedValue);
												}
											}}
										/>
									</FormControl>
									<FormLabel className="font-normal">{`${item.label} (${item.count})`}</FormLabel>
								</FormItem>
							)}
						/>
					))}
					{!showAllClubs && options.length > 3 && (
						<button
							type="button"
							aria-label="Show all"
							onClick={() => setShowAllClubs(true)}
							className="text-white underline"
						>
							Show all {options.length}
						</button>
					)}
					{showAllClubs && (
						<button
							type="button"
							aria-label="Show less"
							onClick={() => setShowAllClubs(false)}
							className="text-white underline"
						>
							Show less
						</button>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
	return (
		<div className="pt-4 rounded-lg w-full md:max-w-xs overflow-hidden pb-4">
			<div className="md:pb-8 md:bg-background rounded-lg md:rounded-r-lg md:rounded-l-none md:h-full md:w-full">
				{isClient && (
					<Form {...form}>
						<form className="w-full flex">
							<div className="flex flex-col md:hidden w-full">
								{renderDateButtons()}

								{renderDateRangeField()}
							</div>
							<div className="hidden md:flex w-full flex-1">
								<GP>
									<div className="h-60 pt-4 pb-4">{children}</div>
									<Accordion
										type="single"
										collapsible
										className="w-full"
										defaultValue={
											typeof window !== "undefined" &&
											window.screen.width >= 768
												? "item-1"
												: ""
										}
									>
										<AccordionItem value="item-1">
											<AccordionTrigger>
												<h2 className="font-headline text-white tracking-normal font-normal uppercase text-left text-lg md:text-xl lg:text-2xl">
													Filters
												</h2>
											</AccordionTrigger>
											<AccordionContent className="mt-4 h-full space-y-4">
												<FormField
													control={form.control}
													name="quickDate"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Date</FormLabel>
															<Select
																aria-label="Select quick date"
																onValueChange={(value) => {
																	const dateRangeOptions: Record<
																		string,
																		{ from: Date; to: Date }
																	> = {
																		today: {
																			from: startOfDay(today),
																			to: endOfDay(today),
																		},
																		tomorrow: {
																			from: startOfDay(tomorrowsDate),
																			to: endOfDay(tomorrowsDate),
																		},
																		weekend: {
																			from: startOfDay(weekendDates[0]),
																			to: endOfDay(weekendDates[1]),
																		},
																	};
																	const selectedRange = dateRangeOptions[
																		value as keyof typeof dateRangeOptions
																	] || {
																		from: startOfDay(today),
																		to: endOfDay(today),
																	};
																	form.setValue("dateRange", selectedRange);
																	form.setValue("quickDate", value);
																}}
																defaultValue={field.value}
															>
																<FormControl aria-label="Select a quick date">
																	<SelectTrigger aria-label="Select a quick date">
																		<SelectValue placeholder="Select a date" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem aria-label="Today" value="today">
																		Today
																	</SelectItem>
																	<SelectItem
																		aria-label="Tomorrow"
																		value="tomorrow"
																	>
																		Tomorrow
																	</SelectItem>
																	<SelectItem
																		aria-label="This Weekend"
																		value="weekend"
																	>
																		This Weekend
																	</SelectItem>
																	<SelectItem
																		aria-label="Date Range"
																		value="range"
																	>
																		Date Range
																	</SelectItem>
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
												{renderDateRangeField()}
												{renderCheckboxGroup("clubs", clubFilters, "Clubs")}
												{/* {renderCheckboxGroup("musicTypes", musicTypes, "Music Types")}
                        {renderCheckboxGroup("partyTypes", partyTypes, "Party Types")}
                        {renderCheckboxGroup("eventTypes", eventTypes, "Event Types")} */}
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</GP>
							</div>
						</form>
					</Form>
				)}
			</div>
		</div>
	);
};

export default FilterMenu;
