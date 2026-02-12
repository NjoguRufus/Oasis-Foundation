import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LatLng,
  bearingBetween,
  bearingDifference,
  haversineDistanceMeters,
  projectPosition,
} from "../utils/geoMath";
import {
  RouteData,
  RouteStep,
  computeRemainingDistanceAndEta,
  extractRouteData,
  distanceAlongStepMeters,
} from "../utils/routeEngine";
import {
  createKalmanFilter,
  FilteredPosition,
} from "./useKalmanFilter";
import { createOffRouteDetector } from "../utils/offRouteDetector";
import { createSpeechEngine } from "../utils/speechEngine";

export type NavigationStatus =
  | "idle"
  | "locating"
  | "routing"
  | "navigating"
  | "off-route"
  | "rerouting"
  | "error";

export type NavigationErrorCode =
  | "permission_denied"
  | "position_unavailable"
  | "timeout"
  | "no_route"
  | "api_error"
  | "unknown";

export type NavigationError = {
  code: NavigationErrorCode;
  message: string;
};

export type NavigationState = {
  status: NavigationStatus;
  error: NavigationError | null;
  rawPosition: GeolocationPosition | null;
  filteredPosition: FilteredPosition | null;
  headingDegrees: number | null;
  route: RouteData | null;
  currentStep: RouteStep | null;
  nextStep: RouteStep | null;
  distanceToStepEndMeters: number | null;
  distanceToNextTurnMeters: number | null;
  remainingDistanceMeters: number | null;
  etaSeconds: number | null;
  lastUpdateTimestamp: number | null;
  voiceEnabled: boolean;
};

export type LiveNavigationReturn = NavigationState & {
  toggleVoice: (enabled: boolean) => void;
};

export type UseLiveNavigationOptions = {
  voiceEnabled?: boolean;
  stepAdvanceHeadingThresholdDeg?: number;
  teleportDistanceThresholdMeters?: number;
  lowAccuracyThresholdMeters?: number;
};

type DirectionsRequestOptions = {
  origin: LatLng;
  destination: LatLng;
};

export function useLiveNavigation(
  destination: LatLng | null,
  isActive: boolean,
  options?: UseLiveNavigationOptions
): LiveNavigationReturn {
  const [state, setState] = useState<NavigationState>({
    status: "idle",
    error: null,
    rawPosition: null,
    filteredPosition: null,
    headingDegrees: null,
    route: null,
    currentStep: null,
    nextStep: null,
    distanceToStepEndMeters: null,
    distanceToNextTurnMeters: null,
    remainingDistanceMeters: null,
    etaSeconds: null,
    lastUpdateTimestamp: null,
    voiceEnabled: options?.voiceEnabled ?? true,
  });

  const watcherIdRef = useRef<number | null>(null);
  const lastGpsUpdateRef = useRef<number>(0);
  const kalmanRef = useRef(createKalmanFilter());
  const offRouteDetectorRef = useRef(createOffRouteDetector());
  const speechEngineRef = useRef(createSpeechEngine({ voiceEnabled: options?.voiceEnabled }));
  const lastSpokenStepIndexRef = useRef<number | null>(null);
  const directionsAbortRef = useRef<AbortController | null>(null);
  const lastGoodPositionRef = useRef<FilteredPosition | null>(null);

  const stepAdvanceHeadingThreshold = options?.stepAdvanceHeadingThresholdDeg ?? 45;
  const teleportThreshold = options?.teleportDistanceThresholdMeters ?? 80;
  const lowAccuracyThreshold = options?.lowAccuracyThresholdMeters ?? 50;

  const updateState = useCallback((partial: Partial<NavigationState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleError = useCallback(
    (error: NavigationError) => {
      updateState({ status: "error", error });
    },
    [updateState]
  );

  const requestRoute = useCallback(
    async (opts: DirectionsRequestOptions): Promise<RouteData> => {
      if (typeof google === "undefined" || !google.maps) {
        throw {
          code: "api_error",
          message: "Google Maps JS API is not available.",
        } as NavigationError;
      }

      const controller = new AbortController();
      if (directionsAbortRef.current) {
        directionsAbortRef.current.abort();
      }
      directionsAbortRef.current = controller;

      const directionsService = new google.maps.DirectionsService();

      return new Promise<RouteData>((resolve, reject) => {
        directionsService.route(
          {
            origin: new google.maps.LatLng(opts.origin.lat, opts.origin.lng),
            destination: new google.maps.LatLng(
              opts.destination.lat,
              opts.destination.lng
            ),
            travelMode: google.maps.TravelMode.WALKING,
          },
          (result, status) => {
            if (controller.signal.aborted) {
              return;
            }

            if (status === google.maps.DirectionsStatus.OK && result) {
              try {
                const routeData = extractRouteData(result);
                resolve(routeData);
              } catch (err) {
                reject({
                  code: "no_route",
                  message: "Could not parse route.",
                } as NavigationError);
              }
            } else {
              reject({
                code: "no_route",
                message: "No route found for walking directions.",
              } as NavigationError);
            }
          }
        );
      });
    },
    []
  );

  const computeHeadingFromSamples = useCallback(
    (prev: FilteredPosition, current: FilteredPosition): number | null => {
      const distance = haversineDistanceMeters(
        prev.position,
        current.position
      );
      if (distance < 0.5) {
        return null;
      }
      return bearingBetween(prev.position, current.position);
    },
    []
  );

  const updateNavigationForPosition = useCallback(
    (filtered: FilteredPosition, raw: GeolocationPosition) => {
      const now = Date.now();
      const currentRoute = state.route;
      if (!currentRoute) {
        return;
      }

      let heading = state.headingDegrees;

      if (typeof raw.coords.heading === "number" && !Number.isNaN(raw.coords.heading)) {
        heading = raw.coords.heading;
      } else if (lastGoodPositionRef.current) {
        const autoHeading = computeHeadingFromSamples(
          lastGoodPositionRef.current,
          filtered
        );
        if (autoHeading != null) {
          heading = autoHeading;
        }
      }

      const currentStep = state.currentStep ?? currentRoute.steps[0] ?? null;
      const currentStepIndex =
        currentStep?.index ?? (currentRoute.steps[0]?.index ?? 0);

      const distanceToStepEndMeters = currentStep
        ? haversineDistanceMeters(filtered.position, currentStep.end)
        : null;

      const shouldAdvanceStep =
        currentStep &&
        distanceToStepEndMeters != null &&
        distanceToStepEndMeters < 10 &&
        heading != null &&
        bearingDifference(heading, currentStep.headingDegrees) <
          stepAdvanceHeadingThreshold;

      let newStepIndex = currentStepIndex;
      if (shouldAdvanceStep && currentStepIndex < currentRoute.steps.length - 1) {
        newStepIndex = currentStepIndex + 1;
      }

      const newCurrentStep = currentRoute.steps[newStepIndex] ?? null;
      const nextStepIndex =
        newStepIndex < currentRoute.steps.length - 1
          ? newStepIndex + 1
          : newStepIndex;
      const nextStep = currentRoute.steps[nextStepIndex] ?? null;

      const distanceToNextTurnMeters =
        nextStep && filtered
          ? haversineDistanceMeters(filtered.position, nextStep.start)
          : null;

      const distanceAlongCurrentStepMeters =
        newCurrentStep && filtered
          ? distanceAlongStepMeters(newCurrentStep, filtered.position)
          : 0;

      const averageSpeed =
        filtered.velocityMetersPerSecond > 0.2
          ? filtered.velocityMetersPerSecond
          : 1.4;

      const { remainingDistanceMeters, etaSeconds } =
        computeRemainingDistanceAndEta(
          currentRoute,
          newStepIndex,
          distanceAlongCurrentStepMeters,
          averageSpeed
        );

      // Off-route detection
      const offRouteDetector = offRouteDetectorRef.current;
      const offRouteState = offRouteDetector.update(
        filtered.position,
        currentRoute.polyline,
        now
      );

      // Handle speech: only when step changes
      const speechEngine = speechEngineRef.current;
      if (
        speechEngine.isVoiceEnabled() &&
        newCurrentStep &&
        lastSpokenStepIndexRef.current !== newCurrentStep.index
      ) {
        const text = newCurrentStep.instruction.replace(/<[^>]+>/g, "");
        speechEngine.speak(text);
        lastSpokenStepIndexRef.current = newCurrentStep.index;
      }

      // Pre-speak next instruction near turn + optional vibration alert
      if (
        speechEngine.isVoiceEnabled() &&
        nextStep &&
        distanceToNextTurnMeters != null &&
        distanceToNextTurnMeters < 20
      ) {
        const text = nextStep.instruction.replace(/<[^>]+>/g, "");
        if (speechEngine.getLastSpoken() !== text) {
          speechEngine.speak(text);
          if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            // Short vibration pattern for turn alert (bonus)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigator as any).vibrate?.([150, 80, 150]);
          }
        }
      }

      updateState({
        status: offRouteState.isOffRoute ? "off-route" : "navigating",
        rawPosition: raw,
        filteredPosition: filtered,
        headingDegrees: heading ?? null,
        currentStep: newCurrentStep,
        nextStep,
        distanceToStepEndMeters,
        distanceToNextTurnMeters,
        remainingDistanceMeters,
        etaSeconds,
        lastUpdateTimestamp: now,
      });

      if (offRouteState.shouldReroute && destination) {
        void (async () => {
          updateState({ status: "rerouting" });
          speechEngine.cancel();
          try {
            const newRoute = await requestRoute({
              origin: filtered.position,
              destination,
            });
            offRouteDetector.reset();
            lastSpokenStepIndexRef.current = null;
            updateState({
              status: "navigating",
              route: newRoute,
              currentStep: newRoute.steps[0] ?? null,
              nextStep: newRoute.steps[1] ?? null,
            });
          } catch (err) {
            const navError =
              (err as NavigationError) ?? ({
                code: "api_error",
                message: "Failed to reroute.",
              } as NavigationError);
            handleError(navError);
          }
        })();
      }
    },
    [
      destination,
      handleError,
      requestRoute,
      state.currentStep,
      state.headingDegrees,
      state.route,
      stepAdvanceHeadingThreshold,
      updateState,
    ]
  );

  const startGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      handleError({
        code: "position_unavailable",
        message: "Geolocation is not supported by this browser.",
      });
      return;
    }

    updateState({ status: "locating", error: null });

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();

        // Throttle updates to at most once every 2 seconds
        if (now - lastGpsUpdateRef.current < 2000) {
          return;
        }
        lastGpsUpdateRef.current = now;

        // Skip very low accuracy readings, but always accept the first fix
        if (
          lastGoodPositionRef.current &&
          typeof pos.coords.accuracy === "number" &&
          pos.coords.accuracy > lowAccuracyThreshold
        ) {
          return;
        }

        const rawLatLng: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        // GPS noise rejection for teleport jumps
        if (lastGoodPositionRef.current) {
          const distance = haversineDistanceMeters(
            lastGoodPositionRef.current.position,
            rawLatLng
          );
          const dtSeconds =
            (now - lastGoodPositionRef.current.timestamp) / 1000;
          if (dtSeconds > 0) {
            const speed = distance / dtSeconds;
            if (distance > teleportThreshold && speed > 4) {
              // Ignore unrealistic jump
              return;
            }
          }
        }

        const filtered = kalmanRef.current.update(rawLatLng, now);
        lastGoodPositionRef.current = filtered;

        // Always update raw/filtered position immediately so UI can center on user
        updateState({
          rawPosition: pos,
          filteredPosition: filtered,
          lastUpdateTimestamp: now,
        });

        // If we do not have a route yet, request it once we have an initial filtered position
        if (!state.route && destination) {
          void (async () => {
            updateState({ status: "routing" });
            try {
              const route = await requestRoute({
                origin: filtered.position,
                destination,
              });
              updateState({
                status: "navigating",
                route,
                currentStep: route.steps[0] ?? null,
                nextStep: route.steps[1] ?? null,
              });
            } catch (err) {
              const navError =
                (err as NavigationError) ?? ({
                  code: "api_error",
                  message: "Failed to calculate route.",
                } as NavigationError);
              handleError(navError);
            }
          })();
        }

        updateNavigationForPosition(filtered, pos);
      },
      (err) => {
        let code: NavigationErrorCode = "unknown";
        if (err.code === err.PERMISSION_DENIED) code = "permission_denied";
        else if (err.code === err.POSITION_UNAVAILABLE)
          code = "position_unavailable";
        else if (err.code === err.TIMEOUT) code = "timeout";

        handleError({
          code,
          message: err.message,
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    watcherIdRef.current = watchId;
  }, [
    destination,
    handleError,
    lowAccuracyThreshold,
    requestRoute,
    teleportThreshold,
    updateNavigationForPosition,
    updateState,
    state.route,
  ]);

  const stopGeolocation = useCallback(() => {
    if (watcherIdRef.current != null) {
      navigator.geolocation.clearWatch(watcherIdRef.current);
      watcherIdRef.current = null;
    }
    if (directionsAbortRef.current) {
      directionsAbortRef.current.abort();
      directionsAbortRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive && destination) {
      startGeolocation();
    } else {
      stopGeolocation();
      speechEngineRef.current.cancel();
      lastSpokenStepIndexRef.current = null;
      lastGoodPositionRef.current = null;
      kalmanRef.current = createKalmanFilter();
      offRouteDetectorRef.current = createOffRouteDetector();
      updateState({
        status: "idle",
        route: null,
        currentStep: null,
        nextStep: null,
        rawPosition: null,
        filteredPosition: null,
      });
    }

    return () => {
      stopGeolocation();
    };
  }, [destination, isActive, startGeolocation, stopGeolocation, updateState]);

  const toggleVoice = useCallback(
    (enabled: boolean) => {
      speechEngineRef.current.setVoiceEnabled(enabled);
      updateState({ voiceEnabled: enabled });
    },
    [updateState]
  );

  // Heading prediction: expose predicted marker position via memoized object
  const predictedPosition = useMemo<LatLng | null>(() => {
    if (!state.filteredPosition || state.headingDegrees == null) {
      return state.filteredPosition?.position ?? null;
    }

    const now = Date.now();
    const dtSeconds =
      state.lastUpdateTimestamp != null
        ? (now - state.lastUpdateTimestamp) / 1000
        : 0;

    const clampedDt = Math.max(0, Math.min(2, dtSeconds));
    const speedMps =
      state.filteredPosition.velocityMetersPerSecond > 0.2
        ? state.filteredPosition.velocityMetersPerSecond
        : 1.4;

    const distance = speedMps * clampedDt;

    return projectPosition(
      state.filteredPosition.position,
      state.headingDegrees,
      distance
    );
  }, [state.filteredPosition, state.headingDegrees, state.lastUpdateTimestamp]);

  return {
    ...state,
    // Overwrite filteredPosition.position with predicted one for smoother marker animation usage
    filteredPosition: state.filteredPosition
      ? {
          ...state.filteredPosition,
          position: predictedPosition ?? state.filteredPosition.position,
        }
      : null,
    toggleVoice,
  };
}

