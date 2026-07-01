"use client";

import { useState, useCallback } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { MAPBOX_TOKEN, DEFAULT_MAP_CENTER } from "@/lib/mapbox";
import { MapPin } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationPickerMapProps {
  latitude?: number | null;
  longitude?: number | null;
  country: "germany" | "denmark";
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
}

export function LocationPickerMap({
  latitude,
  longitude,
  country,
  onLocationChange,
  height = "300px",
}: LocationPickerMapProps) {
  const center = DEFAULT_MAP_CENTER[country];
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );

  const handleClick = useCallback(
    (e: any) => {
      const { lat, lng } = e.lngLat;
      setMarker({ lat, lng });
      onLocationChange(lat, lng);
    },
    [onLocationChange]
  );

  const handleDragEnd = useCallback(
    (e: any) => {
      const { lat, lng } = e.lngLat;
      setMarker({ lat, lng });
      onLocationChange(lat, lng);
    },
    [onLocationChange]
  );

  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-xl border border-gray-200">
      <Map
        initialViewState={{
          latitude: marker?.lat || center.latitude,
          longitude: marker?.lng || center.longitude,
          zoom: marker ? 13 : center.zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={handleClick}
        cursor="crosshair"
      >
        <NavigationControl position="top-right" />

        {marker && (
          <Marker
            latitude={marker.lat}
            longitude={marker.lng}
            anchor="bottom"
            draggable
            onDragEnd={handleDragEnd}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
              <MapPin className="h-4 w-4" />
            </div>
          </Marker>
        )}
      </Map>
      <p className="bg-gray-50 px-3 py-1.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        Click on the map to set location. Drag the pin to adjust.
      </p>
    </div>
  );
}
