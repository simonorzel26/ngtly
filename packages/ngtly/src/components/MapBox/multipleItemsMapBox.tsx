"use client";
import type React from "react";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { EventTypeOutput, EventsTypeOutput } from "~/app/[citySlug]/page";

interface MapboxProps {
	events: EventsTypeOutput;
	zoom?: number;
}

const MuktipleItemsMapbox: React.FC<MapboxProps> = ({ events, zoom = 10 }) => {
	const validEvents = events.filter(
		(event) =>
			event.club?.location?.latitude !== undefined &&
			event.club?.location?.longitude !== undefined,
	);

	const averageLatitude =
		validEvents.reduce(
			(sum, event) => sum + (event.club?.location?.latitude || 0),
			0,
		) / validEvents.length;
	const averageLongitude =
		validEvents.reduce(
			(sum, event) => sum + (event.club?.location?.longitude || 0),
			0,
		) / validEvents.length;

	return (
		<Map
			initialViewState={{
				longitude: averageLongitude,
				latitude: averageLatitude,
				zoom,
			}}
			style={{ width: "100%", height: "100%", borderRadius: "6px" }}
			mapStyle="mapbox://styles/simonorzel/cm0dzho4e002j01pkf3t47w59"
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			attributionControl={false}
			preserveDrawingBuffer={true}
		>
			{validEvents.map((event) => {
				const latitude = event.club?.location?.latitude;
				const longitude = event.club?.location?.longitude;

				if (!latitude || !longitude) {
					return null;
				}

				return (
					<Marker key={event.id} latitude={latitude} longitude={longitude}>
						<img
							src="/marker.svg"
							alt="Event Marker"
							style={{ width: "30px", height: "30px", cursor: "pointer" }}
						/>
					</Marker>
				);
			})}
		</Map>
	);
};

export default MuktipleItemsMapbox;
