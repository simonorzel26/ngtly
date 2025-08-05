import { addDays, differenceInDays, startOfToday, subMonths } from "date-fns";
import type { Metadata } from "next";
import GMW from "~/components/GlobalMaxWidth";
import { db } from "../../../db";

export const metadata: Metadata = {
	title: "Open Stats - Ngtly Platform Overview",
	description:
		"Real-time statistics and insights about the Ngtly nightlife platform",
};

async function getStatistics() {
	const today = startOfToday();
	const oneMonthAgo = subMonths(today, 1);
	const tomorrow = addDays(today, 1);

	const [
		totalEvents,
		eventsThisMonth,
		eventsToday,
		eventsTomorrow,
		totalClubs,
		clubsWithEvents,
		totalCities,
		citiesWithEvents,
		upcomingEvents,
		clubsWithoutEvents,
	] = await Promise.all([
		// Total events
		db.event.count(),

		// Events added in the last month
		db.event.count({
			where: {
				eventDate: {
					gte: oneMonthAgo.toISOString(),
				},
			},
		}),

		// Events today
		db.event.count({
			where: {
				eventDate: {
					gte: today.toISOString(),
					lt: tomorrow.toISOString(),
				},
			},
		}),

		// Events tomorrow
		db.event.count({
			where: {
				eventDate: {
					gte: tomorrow.toISOString(),
					lt: addDays(tomorrow, 1).toISOString(),
				},
			},
		}),

		// Total clubs
		db.club.count(),

		// Clubs with events
		db.club.count({
			where: {
				events: {
					some: {},
				},
			},
		}),

		// Total cities
		db.city.count(),

		// Cities with events
		db.city.count({
			where: {
				clubs: {
					some: {
						events: {
							some: {},
						},
					},
				},
			},
		}),

		// Upcoming events (next 7 days)
		db.event.count({
			where: {
				eventDate: {
					gte: today.toISOString(),
					lte: addDays(today, 7).toISOString(),
				},
			},
		}),

		// Clubs without events
		db.club.count({
			where: {
				events: {
					none: {},
				},
			},
		}),
	]);

	return {
		totalEvents,
		eventsThisMonth,
		eventsToday,
		eventsTomorrow,
		totalClubs,
		clubsWithEvents,
		clubsWithoutEvents,
		totalCities,
		citiesWithEvents,
		upcomingEvents,
		eventCoverage:
			totalClubs > 0 ? ((clubsWithEvents / totalClubs) * 100).toFixed(1) : "0",
		cityCoverage:
			totalCities > 0
				? ((citiesWithEvents / totalCities) * 100).toFixed(1)
				: "0",
	};
}

export default async function OpenStatsPage() {
	const stats = await getStatistics();
	const lastUpdated = new Date().toLocaleString();

	// Platform metrics
	const launchDate = new Date("2018-07-01");
	const daysLive = differenceInDays(new Date(), launchDate);
	const hoursInvested = 830;
	const monthlyCosts = 55; // $30 server + $25 scraping
	const yearlyCosts = monthlyCosts * 12;

	const statCards = [
		{
			title: "Events This Month",
			value: stats.eventsThisMonth.toLocaleString(),
			description: "Events added in the last 30 days",
			color: "text-[#bef264]",
		},
		{
			title: "Total Clubs",
			value: stats.totalClubs.toLocaleString(),
			description: "Venues in our database",
			color: "text-[#bef264]",
		},
		{
			title: "Clubs Without Events",
			value: stats.clubsWithoutEvents.toLocaleString(),
			description: "Venues needing event data",
			color: "text-[#bef264]",
		},
		{
			title: "Total Events",
			value: stats.totalEvents.toLocaleString(),
			description: "All events in database",
			color: "text-[#bef264]",
		},
		{
			title: "Events Today",
			value: stats.eventsToday.toLocaleString(),
			description: "Happening right now",
			color: "text-[#bef264]",
		},
		{
			title: "Events Tomorrow",
			value: stats.eventsTomorrow.toLocaleString(),
			description: "Coming up next",
			color: "text-[#bef264]",
		},
		{
			title: "Upcoming Events",
			value: stats.upcomingEvents.toLocaleString(),
			description: "Next 7 days",
			color: "text-[#bef264]",
		},
		{
			title: "Active Cities",
			value: `${stats.citiesWithEvents}/${stats.totalCities}`,
			description: `${stats.cityCoverage}% coverage`,
			color: "text-[#bef264]",
		},
		{
			title: "Event Coverage",
			value: `${stats.eventCoverage}%`,
			description: `${stats.clubsWithEvents}/${stats.totalClubs} clubs have events`,
			color: "text-[#bef264]",
		},
	];

	return (
		<>
			{/* Hero Section */}
			<section className="bg-black text-white py-16">
				<GMW>
					<div className="mb-12">
						<h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 uppercase">
							Open Statistics
						</h1>
						<p className="text-white/70 text-lg mb-2">
							Real-time overview of the Ngtly nightlife platform
						</p>
						<p className="text-white/50 text-sm">Last updated: {lastUpdated}</p>
					</div>
				</GMW>
			</section>

			{/* Platform Stats Section */}
			<section className="bg-black text-white py-16">
				<GMW>
					<div className="mb-12">
						<h2 className="font-headline text-3xl md:text-4xl font-semibold uppercase mb-4">
							Platform Statistics
						</h2>
						<p className="text-white/70 text-lg">
							Live data from our nightlife database
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
						{statCards.map((card) => (
							<div
								key={card.value + card.title}
								className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
							>
								<div
									className={`text-3xl font-bold mb-2 font-headline ${card.color}`}
								>
									{card.value}
								</div>
								<div className="text-xl font-semibold text-white mb-2 uppercase font-headline">
									{card.title}
								</div>
								<div className="text-white/60 text-sm">{card.description}</div>
							</div>
						))}
					</div>
				</GMW>
			</section>

			{/* Platform Health Section */}
			<section className="bg-[#1a1a1a] text-white py-16">
				<GMW>
					<div className="mb-12">
						<h2 className="font-headline text-3xl md:text-4xl font-semibold uppercase mb-4">
							Platform Health
						</h2>
						<p className="text-white/70 text-lg">
							Current status and areas for improvement
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-black border border-gray-800 rounded-lg p-8">
							<h3 className="text-lg font-semibold mb-4 text-green-400 font-headline uppercase">
								✅ Active Metrics
							</h3>
							<ul className="space-y-2 text-white/70">
								<li>• {stats.clubsWithEvents} clubs actively posting events</li>
								<li>• {stats.citiesWithEvents} cities with nightlife data</li>
								<li>• {stats.upcomingEvents} events scheduled for this week</li>
								<li>• {stats.eventCoverage}% of clubs have event listings</li>
							</ul>
						</div>
						<div className="bg-black border border-gray-800 rounded-lg p-8">
							<h3 className="text-lg font-semibold mb-4 text-yellow-400 font-headline uppercase">
								⚠️ Areas for Improvement
							</h3>
							<ul className="space-y-2 text-white/70">
								<li>• {stats.clubsWithoutEvents} clubs need event data</li>
								<li>
									• {stats.totalCities - stats.citiesWithEvents} cities without
									events
								</li>
								<li>
									• {(100 - Number.parseFloat(stats.eventCoverage)).toFixed(1)}%
									of clubs inactive
								</li>
								<li>• Event coverage could be expanded</li>
							</ul>
						</div>
					</div>
				</GMW>
			</section>

			{/* Platform Metrics Section */}
			<section className="bg-black text-white py-16">
				<GMW>
					<div className="mb-12">
						<h2 className="font-headline text-3xl md:text-4xl font-semibold uppercase mb-4">
							Platform Metrics
						</h2>
						<p className="text-white/70 text-lg">
							Key performance indicators and operational data
						</p>
					</div>
					<div className="grid md:grid-cols-4 gap-8 text-center">
						<div className="p-8">
							<div className="text-4xl font-bold text-[#bef264] mb-2 font-headline">
								{daysLive}+
							</div>
							<div className="text-xl font-semibold text-white mb-2 uppercase font-headline">
								Days Live
							</div>
							<div className="text-white/70">Since July 2018</div>
						</div>
						<div className="p-8">
							<div className="text-4xl font-bold text-[#bef264] mb-2 font-headline">
								{hoursInvested}+
							</div>
							<div className="text-xl font-semibold text-white mb-2 uppercase font-headline">
								Hours Invested
							</div>
							<div className="text-white/70">Development time</div>
						</div>
						<div className="p-8">
							<div className="text-4xl font-bold text-[#bef264] mb-2 font-headline">
								${monthlyCosts}
							</div>
							<div className="text-xl font-semibold text-white mb-2 uppercase font-headline">
								Monthly Costs
							</div>
							<div className="text-white/70">Server + scraping</div>
						</div>
						<div className="p-8">
							<div className="text-4xl font-bold text-[#bef264] mb-2 font-headline">
								${yearlyCosts}
							</div>
							<div className="text-xl font-semibold text-white mb-2 uppercase font-headline">
								Yearly Costs
							</div>
							<div className="text-white/70">Total operational</div>
						</div>
					</div>
				</GMW>
			</section>

			{/* Cost Breakdown Section */}
			<section className="bg-[#1a1a1a] text-white py-16">
				<GMW>
					<div className="mb-12">
						<h2 className="font-headline text-3xl md:text-4xl font-semibold uppercase mb-4">
							Cost Breakdown
						</h2>
						<p className="text-white/70 text-lg">
							Transparent operational costs
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-black border border-gray-800 rounded-lg p-8">
							<h3 className="text-lg font-semibold mb-4 text-[#bef264] font-headline uppercase">
								Monthly Expenses
							</h3>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-white/70">Server Infrastructure</span>
									<span className="text-white font-semibold">$30</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-white/70">Scraping Services</span>
									<span className="text-white font-semibold">$25</span>
								</div>
								<div className="border-t border-gray-800 pt-4 flex justify-between items-center">
									<span className="text-white font-semibold">
										Total Monthly
									</span>
									<span className="text-[#bef264] font-bold text-xl">
										${monthlyCosts}
									</span>
								</div>
							</div>
						</div>
						<div className="bg-black border border-gray-800 rounded-lg p-8">
							<h3 className="text-lg font-semibold mb-4 text-[#bef264] font-headline uppercase">
								Annual Overview
							</h3>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-white/70">Total Annual Costs</span>
									<span className="text-white font-semibold">
										${yearlyCosts}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-white/70">Cost per Day</span>
									<span className="text-white font-semibold">
										${(monthlyCosts / 30).toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-white/70">Cost per Event</span>
									<span className="text-white font-semibold">
										$
										{stats.totalEvents > 0
											? (yearlyCosts / stats.totalEvents).toFixed(2)
											: "0.00"}
									</span>
								</div>
								<div className="border-t border-gray-800 pt-4 flex justify-between items-center">
									<span className="text-white/70">Platform Age</span>
									<span className="text-[#bef264] font-semibold">
										{daysLive} days
									</span>
								</div>
							</div>
						</div>
					</div>
				</GMW>
			</section>

			{/* CTA Section */}
			<section className="bg-gradient-to-r from-[#bef264] to-[#a8dd4e] text-black py-16">
				<GMW>
					<div className="text-center">
						<h2 className="font-headline text-4xl font-bold mb-6 uppercase">
							Open Source & Transparent
						</h2>
						<p className="text-xl mb-8 max-w-2xl mx-auto font-medium">
							We believe in transparency. These stats are updated in real-time
							and show the true state of our platform.
						</p>
						<div className="text-sm text-black/70">
							<p>
								Questions about our data or methodology? We're happy to share
								more details.
							</p>
						</div>
					</div>
				</GMW>
			</section>
		</>
	);
}
