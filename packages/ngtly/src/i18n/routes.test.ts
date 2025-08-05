import { describe, expect, test } from "bun:test";
import { performance } from "node:perf_hooks";
import { Cities } from "~/utils/globalTypes";
import {
	BaseRouteNames,
	GermanRouteNames,
	Locale,
	getRouteFromTranslatedRoute,
	getTranslatedRouteFromRoute,
	splitPath,
} from "./routes";

describe("Route Translation Tests", () => {
	describe("getTranslatedRouteFromRoute function", () => {
		test("gets the correct base URL", () => {
			const start = performance.now();

			expect(getTranslatedRouteFromRoute(Locale.EN, BaseRouteNames.ABOUT)).toBe(
				BaseRouteNames.ABOUT,
			);
			expect(getTranslatedRouteFromRoute(Locale.DE, BaseRouteNames.ABOUT)).toBe(
				GermanRouteNames.ABOUT,
			);

			const end = performance.now();
			console.log(` ${(end - start).toFixed(2)}ms`);
		});

		test("gets the correct city URL", () => {
			const start = performance.now();

			expect(getTranslatedRouteFromRoute(Locale.EN, Cities.COLOGNE)).toBe(
				"cologne",
			);
			expect(getTranslatedRouteFromRoute(Locale.DE, Cities.COLOGNE)).toBe(
				"köln",
			);

			const end = performance.now();
			console.log(`${(end - start).toFixed(2)}ms`);
		});
	});

	describe("getRouteFromTranslatedRoute function", () => {
		test("gets the correct base URL", () => {
			const start = performance.now();

			expect(getRouteFromTranslatedRoute(BaseRouteNames.ABOUT)).toBe(
				BaseRouteNames.ABOUT,
			);
			expect(getRouteFromTranslatedRoute(GermanRouteNames.ABOUT)).toBe(
				BaseRouteNames.ABOUT,
			);

			const end = performance.now();
			console.log(`${(end - start).toFixed(2)}ms`);
		});

		test("gets the correct city URL", () => {
			const start = performance.now();

			expect(getRouteFromTranslatedRoute(Cities.COLOGNE)).toBe("cologne");
			expect(getRouteFromTranslatedRoute("köln")).toBe(Cities.COLOGNE);

			const end = performance.now();
			console.log(`${(end - start).toFixed(2)}ms`);
		});
	});

	describe("splitPath function", () => {
		test("splits the path", () => {
			const start = performance.now();

			expect(splitPath("/fr/kontakt/")).toEqual(["kontakt"]);

			expect(splitPath("/about")).toEqual(["about"]);
			expect(splitPath("/ueber-uns")).toEqual(["ueber-uns"]);
			expect(splitPath("/de/ueber-uns")).toEqual(["ueber-uns"]);
			expect(splitPath("/kontakt/")).toEqual(["kontakt"]);
			expect(splitPath("/bloggen")).toEqual(["bloggen"]);
			expect(splitPath("/en/cologne")).toEqual(["cologne"]);
			expect(splitPath("/cologne/berlin")).toEqual(["cologne", "berlin"]);
			expect(splitPath("/cologne/berlin/berlin")).toEqual([
				"cologne",
				"berlin",
				"berlin",
			]);
			expect(splitPath("/cologne/berlin/berlin/berlin")).toEqual([
				"cologne",
				"berlin",
				"berlin",
				"berlin",
			]);
			expect(splitPath("/cologne/berlin/berlin/berlin/berlin")).toEqual([
				"cologne",
				"berlin",
				"berlin",
				"berlin",
				"berlin",
			]);
			// some unexpected edge cases
			expect(
				splitPath("/en/cologne/berlin/berlin/berlin/berlin/berlin"),
			).toEqual(["cologne", "berlin", "berlin", "berlin", "berlin", "berlin"]);
			expect(
				splitPath("/cologne/berlin/berlin/berlin/berlin/berlin/berlin"),
			).toEqual([
				"cologne",
				"berlin",
				"berlin",
				"berlin",
				"berlin",
				"berlin",
				"berlin",
			]);
			// non-characters
			expect(
				splitPath("/cologne/berlin/berlin/berlin/berlin/berlin/berlin/berlin"),
			).toEqual([
				"cologne",
				"berlin",
				"berlin",
				"berlin",
				"berlin",
				"berlin",
				"berlin",
				"berlin",
			]);

			const end = performance.now();
			console.log(`${(end - start).toFixed(2)}ms`);
		});
	});
});
