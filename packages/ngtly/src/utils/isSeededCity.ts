import { Cities } from "./globalTypes";

export const seededCities = Object.values(Cities);

const isSeededCity = (cityName: string) =>
	seededCities.includes(cityName as Cities);

export default isSeededCity;
