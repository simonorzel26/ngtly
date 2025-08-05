import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

import { zValidator } from "@hono/zod-validator";
import { db } from "@ngtly/db";
import { add, format, set } from "date-fns";
import { bearerAuth } from "hono/bearer-auth";
import { z } from "zod";

const eventQuerySchema = z.union([
	z.object({ from: z.string(), to: z.string() }),
	z.object({ date: z.string().optional() }),
]);

export const runtime = "nodejs";

const app = new Hono()
	.basePath("/api/v1")
	.use(cors({ origin: "*", maxAge: 86400 }))
	.use(
		bearerAuth({
			token: process.env.API_BEARER_TOKEN || "",
		}),
	);

app.get("/cities", async (c) => {
	const cities = await db.city.findMany({ orderBy: { rank: "asc" } });
	return c.json(cities);
});

app.get("/cities/:name", async (c) => {
	const city = await db.city.findFirst({
		where: {
			name: { equals: c.req.param("name"), mode: "insensitive" },
		},
	});
	return c.json(city);
});

app.get("/cities/:name/clubs", async (c) => {
	const clubs = await db.club.findMany({
		where: {
			city: {
				name: { equals: c.req.param("name"), mode: "insensitive" },
			},
		},
	});
	return c.json(clubs);
});

app.get(
	"/cities/:name/events",
	zValidator("query", eventQuerySchema),
	async (c) => {
		const query = c.req.valid("query");

		try {
			const today = new Date();

			const fromDate = set(
				new Date("from" in query ? query.from : query.date ?? today),
				{ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
			);
			const toDate = set(
				new Date(
					"to" in query
						? query.to
						: add(new Date(query.date ?? today), { days: 1 }),
				),
				{
					hours: 0,
					minutes: 0,
					seconds: 0,
					milliseconds: 0,
				},
			);

			const clubs = await db.event.findMany({
				where: {
					club: {
						city: {
							name: { equals: c.req.param("name"), mode: "insensitive" },
						},
					},
					eventDate: {
						gte: format(fromDate, "yyyy-MM-dd"),
						lt: format(toDate, "yyyy-MM-dd"),
					},
				},
			});
			return c.json(clubs);
		} catch (e) {
			return c.json(
				{ error: e instanceof Error ? e.message : "Something went wrong" },
				400,
			);
		}
	},
);

app.get("/events/:id", async (c) => {
	const event = await db.event.findUnique({
		where: {
			id: c.req.param("id"),
		},
	});
	if (!event) return c.json({ error: "Event not found" }, 404);
	const similarEvents = await db.event.findMany({
		where: {
			OR: [
				{
					eventTypesEnglish: {
						hasSome: event.eventTypesEnglish,
					},
				},
				{
					clubId: event.clubId,
				},
			],
			city: event.city,
			eventDate: {
				gte: event.eventDate,
			},
		},
		take: 12,
	});
	return c.json({ event, similarEvents });
});

app.get(
	"/events",
	zValidator(
		"query",
		z.object({
			id: z
				.union([z.string(), z.array(z.string())])
				.optional()
				.default([])
				.transform((v) => (Array.isArray(v) ? v : [v])),
		}),
	),
	async (c) => {
		try {
			const query = c.req.valid("query");
			if (!query.id?.length) return c.json([]);

			const events = await db.event.findMany({
				where: {
					id: {
						in: query.id,
					},
				},
			});
			return c.json(events);
		} catch (e) {
			console.error(e);
			return c.json(
				{ error: e instanceof Error ? e.message : "Something went wrong" },
				400,
			);
		}
	},
);

export const GET = handle(app);
