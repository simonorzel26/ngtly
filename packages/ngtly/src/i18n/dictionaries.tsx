import "server-only";
import type { Locale } from "./routes";

type JSONModule<T> = { default: T };

export enum Locales {
	en = "en",
	de = "de",
}

async function importJSON<T>(directory: string, filename: string): Promise<T> {
	try {
		const module: JSONModule<T> = await import(
			`${directory}/${filename}.json`,
			{
				with: { type: "json" },
			}
		);
		return module.default;
	} catch (error) {
		console.error(`Error importing ${directory}/${filename}.json:`, error);
		throw new Error(`Failed to import ${directory}/${filename}.json`);
	}
}

interface Dictionary {
	// biome-ignore lint/suspicious/noExplicitAny: because
	[key: string]: any;
}

interface RoutingConfig {
	// biome-ignore lint/suspicious/noExplicitAny: because
	[key: string]: any;
}

/**
 * Recursively resolves a nested key in the dictionary object using dot notation.
 */
// biome-ignore lint/suspicious/noExplicitAny: because
function resolveNestedKey(obj: Record<string, any>, key: string): any {
	return key
		.split(".")
		.reduce((acc, part) => (acc?.[part] ? acc[part] : null), obj);
}

export async function getDictionary(locale: Locale): Promise<{
	dict: (key: string, opts?: { [key: string]: string }) => string;
}> {
	const dictionary = await importJSON<Dictionary>("./dictionaries", locale);

	const dict = (key: string, opts?: { [key: string]: string }): string => {
		const value = resolveNestedKey(dictionary, key);
		// replace all %{key} with the corresponding value
		return (
			value.replaceAll(
				/\%\{(\w+)\}/g,
				// biome-ignore lint/suspicious/noExplicitAny: because
				(_: any, key: string | number) => opts?.[key],
			) ?? key
		); // Fallback to the key itself if no value is found
	};

	return { dict };
}
