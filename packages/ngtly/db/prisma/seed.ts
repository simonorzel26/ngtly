import * as fs from "node:fs";
import * as path from "node:path";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/ngtlyClient";
import { eventTags } from "~/lib/tagger/eventTags";
import { musicTags } from "~/lib/tagger/musicTags";
import {
	Cities,
	type City,
	type Clubs,
	type FormattedCity,
} from "~/utils/globalTypes";
import amsterdam from "./cityData/amsterdam";
import barcelona from "./cityData/barcelona";
import berlin from "./cityData/berlin";
import birmingham from "./cityData/birmingham";
import brussels from "./cityData/brussels";
import budapest from "./cityData/budapest";
import cologne from "./cityData/cologne";
import copenhagen from "./cityData/copenhagen";
import dresden from "./cityData/dresden";
import dublin from "./cityData/dublin";
import duesseldorf from "./cityData/duesseldorf";
import frankfurt from "./cityData/frankfurt";
import hamburg from "./cityData/hamburg";
import krakow from "./cityData/krakow";
import lisbon from "./cityData/lisbon";
import london from "./cityData/london";
import madrid from "./cityData/madrid";
import milan from "./cityData/milan";
import munich from "./cityData/munich";
import nuremberg from "./cityData/nuremberg";
import oslo from "./cityData/oslo";
import paris from "./cityData/paris";
import prague from "./cityData/prague";
import rotterdam from "./cityData/rotterdam";
import sanFrancisco from "./cityData/san-francisco";
import sevilla from "./cityData/sevilla";
import sofia from "./cityData/sofia";
import stockholm from "./cityData/stockholm";
import vienna from "./cityData/vienna";
import warsaw from "./cityData/warsaw";
// Helsinki
// Tallinn
// Anvers
const prisma = new PrismaClient();

export const clubs: Clubs[] = [
	{ city: Cities.COLOGNE, clubs: cologne },
	{ city: Cities.BERLIN, clubs: berlin },
	{ city: Cities.BRUSSELS, clubs: brussels },
	{ city: Cities.BIRMINGHAM, clubs: birmingham },
	{ city: Cities.HAMBURG, clubs: hamburg },
	{ city: Cities.PRAGUE, clubs: prague },
	{ city: Cities.COPENHAGEN, clubs: copenhagen },
	{ city: Cities.AMSTERDAM, clubs: amsterdam },
	{ city: Cities.BUDAPEST, clubs: budapest },
	{ city: Cities.MUNICH, clubs: munich },
	{ city: Cities.VIENNA, clubs: vienna },
	{ city: Cities.LISBON, clubs: lisbon },
	{ city: Cities.MADRID, clubs: madrid },
	{ city: Cities.BARCELONA, clubs: barcelona },
	{ city: Cities.FRANKFURT, clubs: frankfurt },
	{ city: Cities.LONDON, clubs: london },
	{ city: Cities.ROTTERDAM, clubs: rotterdam },
	{ city: Cities.STOCKHOLM, clubs: stockholm },
	{ city: Cities.SEVILLA, clubs: sevilla },
	{ city: Cities.PARIS, clubs: paris },
	{ city: Cities.OSLO, clubs: oslo },
	{ city: Cities.DUESSELDORF, clubs: duesseldorf },
	{ city: Cities.DUBLIN, clubs: dublin },
	{ city: Cities.NUREMBERG, clubs: nuremberg },
	{ city: Cities.DRESDEN, clubs: dresden },
	{ city: Cities.KRAKOW, clubs: krakow },
	{ city: Cities.WARSAW, clubs: warsaw },
	{ city: Cities.MILAN, clubs: milan },
	{ city: Cities.SOFIA, clubs: sofia },
	{ city: Cities.SAN_FRANCISCO, clubs: sanFrancisco },
];

async function main() {
	const citiesFilePath = path.join(__dirname, "cities.json");
	const citiesFile = fs.readFileSync(citiesFilePath, "utf-8");
	const citiesData = (JSON.parse(citiesFile) as City[]).map((city: City) => {
		return {
			rank: Number.parseInt(city.rank),
			city: city.city.toLowerCase(),
			country: city.country.toLowerCase(),
			population: Number.parseInt(city.population.replace(/,/g, "")),
			timezone: new Date(city.timezone),
		};
	}) as FormattedCity[];

	console.log("Cities data loaded successfully!");

	const countries = new Set<string>();

	// Collect unique country names
	citiesData.map((city: FormattedCity) => {
		countries.add(city.country);
	});

	console.log("Countries collected successfully!");

	// Create countries
	const countryMap: Record<string, string> = {};
	for (const country of countries) {
		const createdCountry = await prisma.country
			.create({
				data: {
					name: country,
				},
			})
			.catch((e: { code: string }) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e.code === "P2002") {
					console.error(`Country ${country} already exists in the database!`);
					return;
				}
			});

		if (!createdCountry) {
			const dbCountry = await prisma.country.findUnique({
				where: {
					name: country,
				},
			});
			if (!dbCountry) {
				return;
			}

			console.log(`Country ${country} seeded successfully!`);
			countryMap[country] = dbCountry.id;
			continue;
		}
		console.log(`Country ${country} seeded successfully!`);
		countryMap[country] = createdCountry.id;
	}

	console.log("Countries seeded successfully!");

	// Create cities with references to their countries
	for (const cityData of citiesData) {
		const city = await prisma.city
			.create({
				data: {
					rank: cityData.rank,
					name: cityData.city,
					country: {
						connect: {
							id: countryMap[cityData.country],
						},
					},
					population: cityData.population,
					timezone: cityData.timezone,
				},
			})
			.catch((e: PrismaClientKnownRequestError) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e.code === "P2002") {
					console.error(
						`City ${cityData.city} already exists in the database!`,
					);
					return;
				}
			});
		console.log(`City ${cityData.city} seeded successfully! ${city?.id}`);
	}

	console.log("Countries and cities seeded successfully!");

	// Create clubs
	for (const club of clubs) {
		const city = await prisma.city.findFirst({
			where: {
				name: club.city,
			},
		});

		if (!city) {
			console.error(`City ${club.city} not found in the database!`);
			continue;
		}

		for (const clubData of club.clubs) {
			await prisma.club
				.create({
					data: {
						name: clubData.clubName,
						urlSlug: clubData.clubName.toLowerCase().replace(/ /g, "-"),
						url: clubData.url,
						city: {
							connect: {
								id: city.id,
							},
						},
					},
				})
				.catch((e: PrismaClientKnownRequestError) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (e.code === "P2002") {
						console.error(
							`Club ${clubData.clubName} already exists in the database!`,
						);
						return;
					}
				});
			console.log(`Club ${clubData.clubName} seeded successfully!`);
		}
	}

	musicTags.map(async (tag) => {
		await prisma.musicTag
			.create({
				data: {
					name: tag.tag,
				},
			})
			.catch((e: PrismaClientKnownRequestError) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e.code === "P2002") {
					console.error(`Category ${tag.tag} already exists in the database!`);
					return;
				}
			});
		console.log(`Category ${tag.tag} seeded successfully!`);
	});

	eventTags.map(async (tag) => {
		await prisma.eventTag
			.create({
				data: {
					name: tag.tag,
				},
			})
			.catch((e: PrismaClientKnownRequestError) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e.code === "P2002") {
					console.error(`Category ${tag.tag} already exists in the database!`);
					return;
				}
			});
		console.log(`Category ${tag.tag} seeded successfully!`);
	});
}

await main()
	.then(async () => {
		await prisma.$disconnect();
		process.exit(1);
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
