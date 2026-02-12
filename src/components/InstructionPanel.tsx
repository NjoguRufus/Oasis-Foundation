import React from "react";
import { LiveNavigationReturn } from "../hooks/useLiveNavigation";

export type InstructionPanelProps = {
  nav: LiveNavigationReturn;
};

function formatDistance(meters: number | null): string {
  if (meters == null) return "--";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatEta(seconds: number | null): string {
  if (seconds == null) return "--";
  const mins = Math.round(seconds / 60);
  if (mins < 1) return "<1 min";
  return `${mins} min`;
}

export const InstructionPanel: React.FC<InstructionPanelProps> = ({
  nav,
}) => {
  const instructionHtml =
    nav.currentStep?.instruction ?? "Head toward your route.";
  const nextInstructionHtml =
    nav.nextStep?.instruction ?? "Continue straight until the next instruction.";

  return (
    <div className="w-full bg-white/95 text-gray-900 p-4 flex flex-col gap-3 rounded-2xl shadow-xl border border-teal-100">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-gray-500">
          Status
        </span>
        <span className="text-xs rounded-full bg-teal-50 text-teal-600 px-3 py-1">
          {nav.status === "navigating" && "On route"}
          {nav.status === "off-route" && "Off route – recalculating soon"}
          {nav.status === "routing" && "Calculating route…"}
          {nav.status === "locating" && "Locating…"}
          {nav.status === "rerouting" && "Rerouting…"}
          {nav.status === "error" && "Error"}
          {nav.status === "idle" && "Idle"}
        </span>
      </div>

      <div className="border border-teal-100 rounded-xl p-3 bg-teal-50/70">
        <p
          className="text-sm font-semibold"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: instructionHtml }}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
          <span>Distance to turn</span>
          <span className="font-semibold">
            {formatDistance(nav.distanceToNextTurnMeters)}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <span className="uppercase tracking-wide">Next</span>
        <p
          className="mt-1 text-gray-700"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: nextInstructionHtml }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex flex-col">
          <span className="uppercase tracking-wide">Remaining</span>
          <span className="font-semibold">
            {formatDistance(nav.remainingDistanceMeters)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="uppercase tracking-wide">ETA</span>
          <span className="font-semibold">
            {formatEta(nav.etaSeconds)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => nav.toggleVoice(!nav.voiceEnabled)}
          className="px-3 py-1 text-xs rounded-full border border-teal-200 bg-white hover:bg-teal-50 transition-colors"
        >
          {nav.voiceEnabled ? "Voice: On" : "Voice: Off"}
        </button>
      </div>

      {nav.error && (
        <div className="text-xs text-red-600 border border-red-200 bg-red-50 rounded-lg p-2">
          {nav.error.message}
        </div>
      )}
    </div>
  );
};

export default InstructionPanel;

