export const languages = {
	en: "English",
	de: "Deutsch",
} as const;

export type Language = keyof typeof languages;
export const defaultLanguage: Language = "en";

export const locales = Object.keys(languages) as Language[];

export function isValidLanguage(lang: string): lang is Language {
	return lang in languages;
}
