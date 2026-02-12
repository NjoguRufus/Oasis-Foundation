import React, { useEffect, useRef } from "react";
import { GoogleMap, Marker, Polyline, Circle } from "@react-google-maps/api";
import { LatLng } from "../utils/geoMath";
import { RouteData } from "../utils/routeEngine";

const GESTURE_HANDLING: "cooperative" | "greedy" | "none" | "auto" = "greedy";

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "100%",
};

export type NavigationMapProps = {
  center: LatLng | null;
  route: RouteData | null;
  userPosition: LatLng | null;
  completedPath?: LatLng[];
  accuracyMeters?: number | null;
};

export const NavigationMap: React.FC<NavigationMapProps> = ({
  center,
  route,
  userPosition,
  completedPath,
  accuracyMeters,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.panTo(center);
    }
  }, [center]);

  return (
    <GoogleMap
      onLoad={(map) => {
        mapRef.current = map;
        if (center) {
          map.panTo(center);
        }
      }}
      mapContainerStyle={MAP_CONTAINER_STYLE}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        scaleControl: true,
        gestureHandling: GESTURE_HANDLING,
        zoom: 18,
      }}
      center={center ?? undefined}
    >
      {route && (
        <>
          {completedPath && completedPath.length > 1 && (
            <Polyline
              path={completedPath}
              options={{
                strokeColor: "#9ca3af", // gray-400
                strokeOpacity: 0.6,
                strokeWeight: 6,
              }}
            />
          )}
          <Polyline
            path={route.polyline}
            options={{
              strokeColor: "#14b8a6", // teal-like
              strokeOpacity: 0.9,
              strokeWeight: 6,
            }}
          />
        </>
      )}

      {userPosition && (
        <>
          {typeof accuracyMeters === "number" && accuracyMeters > 0 && (
            <Circle
              center={userPosition}
              radius={accuracyMeters}
              options={{
                strokeColor: "#38bdf8",
                strokeOpacity: 0.7,
                strokeWeight: 1,
                fillColor: "#38bdf8",
                fillOpacity: 0.15,
                clickable: false,
              }}
            />
          )}
          <Marker
            position={userPosition}
            label={{
              text: "You",
              fontSize: "10px",
              color: "#111827",
            }}
          />
        </>
      )}
    </GoogleMap>
  );
};

export default NavigationMap;

