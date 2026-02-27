import React, { useMemo } from "react";
import { X } from "lucide-react";
import { LatLng } from "../utils/geoMath";
import {
  useLiveNavigation,
  LiveNavigationReturn,
} from "../hooks/useLiveNavigation";
import NavigationMap from "./NavigationMap";
import InstructionPanel from "./InstructionPanel";

export type NavigationModalProps = {
  destination: LatLng;
  isOpen: boolean;
  onClose: () => void;
  apiKey?: string;
  isLoaded: boolean;
  loadError: Error | undefined | null;
};

export const NavigationModal: React.FC<NavigationModalProps> = ({
  destination,
  isOpen,
  onClose,
  apiKey,
  isLoaded,
  loadError,
}) => {
  const nav: LiveNavigationReturn = useLiveNavigation(
    destination,
    isOpen && isLoaded && !!apiKey,
    {
      voiceEnabled: true,
    }
  );

  const userPosition = nav.filteredPosition?.position ?? null;
  const accuracyMeters =
    nav.rawPosition && typeof nav.rawPosition.coords.accuracy === "number"
      ? nav.rawPosition.coords.accuracy
      : null;

  const center = useMemo<LatLng | null>(() => {
    if (userPosition) return userPosition;
    return destination;
  }, [destination, userPosition]);

  if (!isOpen) return null;

  const showMap = Boolean(apiKey) && !loadError && isLoaded;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/40 backdrop-blur-sm">
      {/* Top bar matching site theme */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-b-3xl shadow-md">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-teal-500">
            Live walking navigation
          </span>
          <span className="text-sm font-semibold text-gray-800">
            Oasis Recovery Home
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-coral-500 hover:bg-coral-600 text-white shadow-md"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* API key missing */}
      {!apiKey && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-sm text-center text-sm text-gray-700 bg-white rounded-2xl shadow-lg p-4">
            <p className="mb-2 font-semibold text-coral-500">
              Google Maps API key missing
            </p>
            <p className="text-xs">
              Add{" "}
              <code className="bg-gray-100 px-1 rounded text-[0.7rem]">
                VITE_GOOGLE_MAPS_API_KEY
              </code>{" "}
              to your{" "}
              <code className="bg-gray-100 px-1 rounded text-[0.7rem]">
                .env
              </code>{" "}
              file and restart the dev server.
            </p>
          </div>
        </div>
      )}

      {/* Load error */}
      {apiKey && loadError && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-sm text-center text-sm text-red-600 bg-white rounded-2xl shadow-lg p-4">
            Failed to load Google Maps. Check your API key and referrer settings.
          </div>
        </div>
      )}

      {/* Loading */}
      {apiKey && !loadError && !isLoaded && (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-700">
          <div className="bg-white rounded-2xl shadow-lg px-4 py-3 text-center">
            Loading map…
          </div>
        </div>
      )}

      {/* Map with floating containers */}
      {showMap && (
        <div className="flex-1 relative">
          <NavigationMap
            center={center}
            route={nav.route}
            userPosition={userPosition}
            accuracyMeters={accuracyMeters}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center gap-2 px-3">
            <div className="pointer-events-auto max-w-md w-full">
              <InstructionPanel nav={nav} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationModal;

