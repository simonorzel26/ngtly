"use client";
import type React from "react";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxProps {
	latitude: number;
	longitude: number;
	zoom?: number;
}

const Mapbox: React.FC<MapboxProps> = ({ latitude, longitude, zoom = 12 }) => {
	return (
		<Map
			initialViewState={{
				longitude,
				latitude,
				zoom,
			}}
			style={{ width: "100%", height: "100%", borderRadius: "10px" }}
			mapStyle="mapbox://styles/simonorzel/cm0dzho4e002j01pkf3t47w59"
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			attributionControl={false}
			preserveDrawingBuffer={true}
		>
			<Marker longitude={longitude} latitude={latitude}>
				<img
					src="/marker.svg"
					alt="Custom Marker"
					style={{ width: "30px", height: "30px" }}
				/>
			</Marker>
		</Map>
	);
};

export default Mapbox;
