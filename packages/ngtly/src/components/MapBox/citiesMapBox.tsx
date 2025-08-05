"use client";
import type React from "react";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { seededCities } from "~/utils/isSeededCity";

interface CitiesMapBoxProps {
	zoom?: number;
}

const CitiesMapBox: React.FC<CitiesMapBoxProps> = ({ zoom = 2 }) => {
	const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

	// Ensure the Mapbox token exists
	if (!accessToken) {
		console.error("Mapbox token not available");
		return <p>Mapbox token not available</p>;
	}

	// Center the map around the average location (e.g., central Europe)
	const averageLatitude = 51.1657;
	const averageLongitude = 10.4515;

	return (
		<Map
			initialViewState={{
				longitude: averageLongitude,
				latitude: averageLatitude,
				zoom,
			}}
			style={{ width: "100%", height: "100%", borderRadius: "10px" }}
			mapStyle="mapbox://styles/simonorzel/cm0dzho4e002j01pkf3t47w59"
			mapboxAccessToken={accessToken}
			attributionControl={false}
			preserveDrawingBuffer={false}
		>
			<TooltipProvider>
				{seededCities.map((city) => {
					const cityCoordinates = getCityCoordinates(city);
					return (
						<Link href={`/${city}`} key={city}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Marker
										key={city}
										latitude={cityCoordinates.latitude}
										longitude={cityCoordinates.longitude}
									>
										<img
											src="/marker.svg"
											alt={`${city} Marker`}
											style={{
												width: "30px",
												height: "30px",
												cursor: "pointer",
											}}
										/>
									</Marker>
								</TooltipTrigger>
								<TooltipContent>
									<p>{city}</p>
								</TooltipContent>
							</Tooltip>
						</Link>
					);
				})}
			</TooltipProvider>
		</Map>
	);
};

// Example function to get latitude and longitude for a given city name
const getCityCoordinates = (cityName: string) => {
	// First letter uppercase
	const cityNameUpper = cityName.charAt(0).toUpperCase() + cityName.slice(1);
	// Replace this function with a more comprehensive list of city coordinates
	const cityCoordinates: {
		[key: string]: { latitude: number; longitude: number };
	} = {
		London: { latitude: 51.5074, longitude: -0.1278 },
		Berlin: { latitude: 52.52, longitude: 13.405 },
		Madrid: { latitude: 40.4168, longitude: -3.7038 },
		Rome: { latitude: 41.9028, longitude: 12.4964 },
		Kiev: { latitude: 50.4501, longitude: 30.5234 },
		Paris: { latitude: 48.8566, longitude: 2.3522 },
		Bucharest: { latitude: 44.4268, longitude: 26.1025 },
		Budapest: { latitude: 47.4979, longitude: 19.0402 },
		Hamburg: { latitude: 53.5511, longitude: 9.9937 },
		Warsaw: { latitude: 52.2297, longitude: 21.0122 },
		Belgrade: { latitude: 44.7866, longitude: 20.4489 },
		Vienna: { latitude: 48.2082, longitude: 16.3738 },
		Kharkov: { latitude: 49.9935, longitude: 36.2304 },
		Barcelona: { latitude: 41.3851, longitude: 2.1734 },
		Milan: { latitude: 45.4642, longitude: 9.19 },
		Munich: { latitude: 48.1351, longitude: 11.582 },
		Prague: { latitude: 50.0755, longitude: 14.4378 },
		Sofia: { latitude: 42.6977, longitude: 23.3219 },
		Dnepropetrovsk: { latitude: 48.4647, longitude: 35.0462 },
		Donetsk: { latitude: 48.0159, longitude: 37.8029 },
		Naples: { latitude: 40.8518, longitude: 14.2681 },
		Birmingham: { latitude: 52.4862, longitude: -1.8904 },
		Odessa: { latitude: 46.4825, longitude: 30.7233 },
		Cologne: { latitude: 50.9375, longitude: 6.9603 },
		Turin: { latitude: 45.0703, longitude: 7.6869 },
		Zagreb: { latitude: 45.815, longitude: 15.9819 },
		Zaporozhye: { latitude: 47.8388, longitude: 35.1396 },
		Lodz: { latitude: 51.7592, longitude: 19.455 },
		Marseille: { latitude: 43.2965, longitude: 5.3698 },
		Riga: { latitude: 56.9496, longitude: 24.1052 },
		Lvov: { latitude: 49.8397, longitude: 24.0297 },
		Athens: { latitude: 37.9838, longitude: 23.7275 },
		Salonika: { latitude: 40.6401, longitude: 22.9444 },
		Stockholm: { latitude: 59.3293, longitude: 18.0686 },
		Krakow: { latitude: 50.0647, longitude: 19.945 },
		Valencia: { latitude: 39.4699, longitude: -0.3763 },
		Amsterdam: { latitude: 52.3676, longitude: 4.9041 },
		Leeds: { latitude: 53.8008, longitude: -1.5491 },
		"Kryvy-Rig": { latitude: 47.9105, longitude: 33.3918 },
		Sevilla: { latitude: 37.3891, longitude: -5.9845 },
		Palermo: { latitude: 38.1157, longitude: 13.3615 },
		Kishineu: { latitude: 47.0105, longitude: 28.8638 },
		Genova: { latitude: 44.4056, longitude: 8.9463 },
		Frankfurt: { latitude: 50.1109, longitude: 8.6821 },
		Breslau: { latitude: 51.1079, longitude: 17.0385 },
		Glasgow: { latitude: 55.8642, longitude: -4.2518 },
		Zaragoza: { latitude: 41.6488, longitude: -0.8891 },
		Essen: { latitude: 51.4556, longitude: 7.0116 },
		Rotterdam: { latitude: 51.9225, longitude: 4.4792 },
		Dortmund: { latitude: 51.5136, longitude: 7.4653 },
		Stuttgart: { latitude: 48.7758, longitude: 9.1829 },
		Vilnius: { latitude: 54.6872, longitude: 25.2797 },
		Poznan: { latitude: 52.4064, longitude: 16.9252 },
		Duesseldorf: { latitude: 51.2277, longitude: 6.7735 },
		Lisbon: { latitude: 38.7223, longitude: -9.1393 },
		Helsinki: { latitude: 60.1695, longitude: 24.9355 },
		Malaga: { latitude: 36.7213, longitude: -4.4214 },
		Bremen: { latitude: 53.0793, longitude: 8.8017 },
		Sheffield: { latitude: 53.3811, longitude: -1.4701 },
		Sarajevo: { latitude: 43.8563, longitude: 18.4131 },
		Duisburg: { latitude: 51.4344, longitude: 6.7623 },
		Hannover: { latitude: 52.3759, longitude: 9.732 },
		Mykolaiv: { latitude: 46.975, longitude: 31.9946 },
		Oslo: { latitude: 59.9139, longitude: 10.7522 },
		Copenhagen: { latitude: 55.6761, longitude: 12.5683 },
		Mariupol: { latitude: 47.0971, longitude: 37.5434 },
		Leipzig: { latitude: 51.3397, longitude: 12.3731 },
		Nuremberg: { latitude: 49.4521, longitude: 11.0767 },
		Bradford: { latitude: 53.795, longitude: -1.7594 },
		Dublin: { latitude: 53.3498, longitude: -6.2603 },
		Dresden: { latitude: 51.0504, longitude: 13.7373 },
		Gomel: { latitude: 52.4412, longitude: 30.9878 },
		Liverpool: { latitude: 53.4084, longitude: -2.9916 },
		Anvers: { latitude: 51.2194, longitude: 4.4025 },
		Lugansk: { latitude: 48.5739, longitude: 39.3556 },
		Gothenburg: { latitude: 57.7089, longitude: 11.9746 },
		Danzig: { latitude: 54.352, longitude: 18.6466 },
		Edinburgh: { latitude: 55.9533, longitude: -3.1883 },
		Bratislava: { latitude: 48.1486, longitude: 17.1077 },
		"S-gravenhage": { latitude: 52.0705, longitude: 4.3007 },
		Manchester: { latitude: 53.4808, longitude: -2.2426 },
		Skoplje: { latitude: 41.9981, longitude: 21.4254 },
		Tallinn: { latitude: 59.437, longitude: 24.7535 },
		Szczecin: { latitude: 53.4285, longitude: 14.5528 },
		Lyon: { latitude: 45.764, longitude: 4.8357 },
		Kaunas: { latitude: 54.8985, longitude: 23.9036 },
		Bristol: { latitude: 51.4545, longitude: -2.5879 },
		Bochum: { latitude: 51.4818, longitude: 7.2162 },
		Kirklees: { latitude: 53.5933, longitude: -1.7993 },
		Makeyevka: { latitude: 48.0471, longitude: 37.9257 },
		Bydgoszcz: { latitude: 53.1235, longitude: 18.0084 },
		Bologna: { latitude: 44.4949, longitude: 11.3426 },
		Brno: { latitude: 49.1951, longitude: 16.6068 },
		Firenze: { latitude: 43.7696, longitude: 11.2558 },
		Wuppertal: { latitude: 51.2562, longitude: 7.1508 },
		Toulouse: { latitude: 43.6047, longitude: 1.4442 },
		Lublin: { latitude: 51.2465, longitude: 22.5684 },
		Mogilev: { latitude: 53.898, longitude: 30.3325 },
		Brussels: { latitude: 50.8503, longitude: 4.3517 },
	};

	return (
		cityCoordinates[cityNameUpper] || { latitude: 51.1657, longitude: 10.4515 }
	); // Default fallback
};

export default CitiesMapBox;
