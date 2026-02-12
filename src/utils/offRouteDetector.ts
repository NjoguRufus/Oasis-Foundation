import { LatLng, distancePointToPolylineMeters } from "./geoMath";

export type OffRouteConfig = {
  offRouteThresholdMeters: number;
  consecutiveLimit: number;
  minRerouteIntervalMs: number;
};

export type OffRouteState = {
  isOffRoute: boolean;
  shouldReroute: boolean;
};

export const defaultOffRouteConfig: OffRouteConfig = {
  offRouteThresholdMeters: 30,
  consecutiveLimit: 3,
  minRerouteIntervalMs: 5000,
};

export function createOffRouteDetector(config?: Partial<OffRouteConfig>) {
  const merged: OffRouteConfig = {
    ...defaultOffRouteConfig,
    ...(config ?? {}),
  };

  let consecutiveOffRoute = 0;
  let lastRerouteTimestamp = 0;

  function reset(): void {
    consecutiveOffRoute = 0;
  }

  function update(
    position: LatLng,
    polyline: LatLng[],
    timestamp: number
  ): OffRouteState {
    if (polyline.length < 2) {
      return { isOffRoute: false, shouldReroute: false };
    }

    const distanceMeters = distancePointToPolylineMeters(position, polyline);
    const isOff = distanceMeters > merged.offRouteThresholdMeters;

    if (isOff) {
      consecutiveOffRoute += 1;
    } else {
      consecutiveOffRoute = 0;
    }

    const enoughConsecutive =
      consecutiveOffRoute >= merged.consecutiveLimit;
    const enoughTimeSinceLast =
      timestamp - lastRerouteTimestamp >= merged.minRerouteIntervalMs;

    const shouldReroute = isOff && enoughConsecutive && enoughTimeSinceLast;

    if (shouldReroute) {
      lastRerouteTimestamp = timestamp;
      consecutiveOffRoute = 0;
    }

    return { isOffRoute: isOff, shouldReroute };
  }

  return {
    update,
    reset,
  };
}

