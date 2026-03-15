import React from "react";
import { MapPin } from "lucide-react";

const LOGO_URL = "https://i.imgur.com/xgNrrHt.png";

export type LocationPermissionPromptProps = {
  onAllow: () => void;
  onDismiss: () => void;
};

/**
 * In-app location request UI so the first permission ask uses our design
 * instead of only the browser’s. User clicks Allow → parent calls
 * navigator.geolocation.getCurrentPosition (browser prompt still appears after).
 */
const LocationPermissionPrompt: React.FC<LocationPermissionPromptProps> = ({
  onAllow,
  onDismiss,
}) => {
  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-24 pb-8 bg-black/35 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Location permission"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <img
            src={LOGO_URL}
            alt="Oasis Recovery Home"
            className="w-12 h-12 object-contain"
          />
          <div className="flex flex-col">
            <div className="text-xs font-semibold uppercase tracking-wide text-teal-500">
              Oasis Recovery Home
            </div>
            <div className="text-base md:text-lg font-semibold text-gray-800">
              Allow location access
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-5">
          <span className="mt-0.5 flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600">
            <MapPin className="w-5 h-5" aria-hidden />
          </span>
          <p className="text-gray-600 text-sm md:text-base">
            We use your location only to show your route to Oasis Recovery Home.
            Your data stays on your device.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onAllow}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow-md transition-colors"
          >
            <MapPin className="w-4 h-4" aria-hidden />
            Allow
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionPrompt;
