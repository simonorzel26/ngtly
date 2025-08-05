import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Event } from "@prisma/ngtlyClient"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToSubcurrency(amount: number, factor = 100) {
	return Math.round(amount * factor);
}

export const sortEventsByDate = (events: Event[]) => events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

export const upperCaseString = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);