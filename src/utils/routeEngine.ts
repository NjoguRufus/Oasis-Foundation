import { LatLng, haversineDistanceMeters, bearingBetween } from "./geoMath";

export type RouteStep = {
  index: number;
  start: LatLng;
  end: LatLng;
  path: LatLng[];
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  headingDegrees: number;
};

export type RouteData = {
  polyline: LatLng[];
  steps: RouteStep[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
};

export function decodePath(
  path: google.maps.LatLng[] | undefined
): LatLng[] {
  if (!path) return [];
  return path.map((p) => ({ lat: p.lat(), lng: p.lng() }));
}

export function flattenRoutePolyline(
  directions: google.maps.DirectionsResult
): LatLng[] {
  const result: LatLng[] = [];
  const route = directions.routes[0];
  if (!route) return result;

  route.legs.forEach((leg) => {
    leg.steps.forEach((step) => {
      const pts = decodePath(step.path);
      if (pts.length === 0) return;
      if (result.length > 0) {
        // Avoid duplicate join point
        const last = result[result.length - 1];
        if (last.lat === pts[0]!.lat && last.lng === pts[0]!.lng) {
          result.push(...pts.slice(1));
        } else {
          result.push(...pts);
        }
      } else {
        result.push(...pts);
      }
    });
  });

  return result;
}

export function extractRouteData(
  directions: google.maps.DirectionsResult
): RouteData {
  const route = directions.routes[0];
  if (!route) {
    throw new Error("No routes in DirectionsResult");
  }

  const polyline = flattenRoutePolyline(directions);
  const steps: RouteStep[] = [];
  let totalDistanceMeters = 0;
  let totalDurationSeconds = 0;

  route.legs.forEach((leg) => {
    leg.steps.forEach((step, idx) => {
      const path = decodePath(step.path);
      if (path.length < 2) return;

      const start: LatLng = {
        lat: step.start_location.lat(),
        lng: step.start_location.lng(),
      };
      const end: LatLng = {
        lat: step.end_location.lat(),
        lng: step.end_location.lng(),
      };

      const distanceMeters =
        step.distance?.value != null ? step.distance.value : 0;
      const durationSeconds =
        step.duration?.value != null ? step.duration.value : 0;

      const headingDegrees = bearingBetween(start, end);

      totalDistanceMeters += distanceMeters;
      totalDurationSeconds += durationSeconds;

      steps.push({
        index: steps.length,
        start,
        end,
        path,
        instruction: step.instructions ?? "",
        distanceMeters,
        durationSeconds,
        headingDegrees,
      });
    });
  });

  return {
    polyline,
    steps,
    totalDistanceMeters,
    totalDurationSeconds,
  };
}

export function computeRemainingDistanceAndEta(
  route: RouteData,
  currentStepIndex: number,
  positionOnStepMeters: number,
  averageSpeedMps: number
): { remainingDistanceMeters: number; etaSeconds: number } {
  let remainingDistanceMeters = 0;

  const currentStep = route.steps[currentStepIndex];
  if (currentStep) {
    remainingDistanceMeters +=
      currentStep.distanceMeters - positionOnStepMeters;
  }

  for (let i = currentStepIndex + 1; i < route.steps.length; i += 1) {
    remainingDistanceMeters += route.steps[i]!.distanceMeters;
  }

  const etaSeconds =
    averageSpeedMps > 0
      ? remainingDistanceMeters / averageSpeedMps
      : route.totalDurationSeconds;

  return { remainingDistanceMeters, etaSeconds };
}

export function distanceAlongStepMeters(
  step: RouteStep,
  position: LatLng
): number {
  if (step.path.length < 2) return 0;

  let distance = 0;
  let closestProjectionIndex = 0;
  let minDistToSegment = Infinity;

  for (let i = 0; i < step.path.length - 1; i += 1) {
    const a = step.path[i]!;
    const b = step.path[i + 1]!;
    const segLen = haversineDistanceMeters(a, b);

    // Approximate distance to segment by distance to midpoint for speed
    const mid: LatLng = {
      lat: (a.lat + b.lat) / 2,
      lng: (a.lng + b.lng) / 2,
    };
    const distToMid = haversineDistanceMeters(position, mid);

    if (distToMid < minDistToSegment) {
      minDistToSegment = distToMid;
      closestProjectionIndex = i;
    }

    if (i < closestProjectionIndex) {
      distance += segLen;
    } else if (i === closestProjectionIndex) {
      // Add partial distance along the closest segment
      const distToA = haversineDistanceMeters(position, a);
      const distToB = haversineDistanceMeters(position, b);
      // Clamp between [0, segLen]
      const partial = Math.max(
        0,
        Math.min(segLen, (segLen + distToA - distToB) / 2)
      );
      distance += partial;
    }
  }

  return distance;
}

