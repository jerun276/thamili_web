"use client";

import { useRef, useCallback } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import { MAPBOX_TOKEN, DEFAULT_MAP_CENTER } from "@/lib/mapbox";
import { MapPin } from "lucide-react";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapPoint {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  delivery_fee?: number;
}

interface PickupPointMapProps {
  points: MapPoint[];
  country: "germany" | "denmark";
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  height?: string;
  interactive?: boolean;
}

export function PickupPointMap({
  points,
  country,
  selectedId,
  onSelect,
  height = "400px",
  interactive = true,
}: PickupPointMapProps) {
  const [popupPoint, setPopupPoint] = useState<MapPoint | null>(null);
  const center = DEFAULT_MAP_CENTER[country];

  const validPoints = points.filter((p) => p.latitude != null && p.longitude != null);

  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-xl border border-gray-200">
      <Map
        initialViewState={{
          latitude: center.latitude,
          longitude: center.longitude,
          zoom: center.zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactive={interactive}
      >
        <NavigationControl position="top-right" />

        {validPoints.map((point) => (
          <Marker
            key={point.id}
            latitude={point.latitude!}
            longitude={point.longitude!}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupPoint(point);
              if (onSelect) onSelect(point.id);
            }}
          >
            <div
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110 ${
                selectedId === point.id
                  ? "bg-green-600 text-white scale-110"
                  : "bg-white text-green-700 border-2 border-green-600"
              }`}
            >
              <MapPin className="h-4 w-4" />
            </div>
          </Marker>
        ))}

        {popupPoint && popupPoint.latitude && popupPoint.longitude && (
          <Popup
            latitude={popupPoint.latitude}
            longitude={popupPoint.longitude}
            anchor="top"
            onClose={() => setPopupPoint(null)}
            closeOnClick={false}
          >
            <div className="p-1">
              <p className="text-sm font-semibold">{popupPoint.name}</p>
              <p className="text-xs text-gray-500">{popupPoint.address}</p>
              {popupPoint.delivery_fee != null && (
                <p className="mt-1 text-xs font-medium text-green-700">
                  Delivery fee: €{popupPoint.delivery_fee.toFixed(2)}
                </p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
