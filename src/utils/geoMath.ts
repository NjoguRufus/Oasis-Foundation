export type LatLng = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS_METERS = 6371000;

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function haversineDistanceMeters(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_METERS * c;
}

export function bearingBetween(a: LatLng, b: LatLng): number {
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const dLng = toRadians(b.lng - a.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const brng = Math.atan2(y, x);
  const brngDeg = (toDegrees(brng) + 360) % 360;
  return brngDeg;
}

export function normalizeBearing(bearing: number): number {
  let b = bearing % 360;
  if (b < 0) b += 360;
  return b;
}

export function bearingDifference(a: number, b: number): number {
  const diff = Math.abs(normalizeBearing(a) - normalizeBearing(b));
  return diff > 180 ? 360 - diff : diff;
}

export function projectPosition(
  origin: LatLng,
  headingDeg: number,
  distanceMeters: number
): LatLng {
  const angularDistance = distanceMeters / EARTH_RADIUS_METERS;
  const headingRad = toRadians(headingDeg);
  const lat1 = toRadians(origin.lat);
  const lng1 = toRadians(origin.lng);

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const sinAd = Math.sin(angularDistance);
  const cosAd = Math.cos(angularDistance);

  const lat2 = Math.asin(
    sinLat1 * cosAd + cosLat1 * sinAd * Math.cos(headingRad)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(headingRad) * sinAd * cosLat1,
      cosAd - sinLat1 * Math.sin(lat2)
    );

  return {
    lat: toDegrees(lat2),
    lng: toDegrees(lng2),
  };
}

export function interpolatePosition(a: LatLng, b: LatLng, t: number): LatLng {
  const clampedT = Math.max(0, Math.min(1, t));
  return {
    lat: a.lat + (b.lat - a.lat) * clampedT,
    lng: a.lng + (b.lng - a.lng) * clampedT,
  };
}

export function distancePointToSegmentMeters(
  p: LatLng,
  a: LatLng,
  b: LatLng
): number {
  // Use Google Geometry library if available (more accurate & fast)
  if (
    typeof google !== "undefined" &&
    google.maps &&
    google.maps.geometry &&
    google.maps.geometry.spherical &&
    typeof google.maps.geometry.spherical.computeDistanceBetween === "function"
  ) {
    const gm = google.maps;
    const pLatLng = new gm.LatLng(p.lat, p.lng);
    const aLatLng = new gm.LatLng(a.lat, a.lng);
    const bLatLng = new gm.LatLng(b.lat, b.lng);
    // Approximate segment distance by sampling closest of endpoints and midpoint projection
    // (computeDistanceToLine is not in the typings, so we stay within well-typed APIs)
    const distA = gm.geometry.spherical.computeDistanceBetween(pLatLng, aLatLng);
    const distB = gm.geometry.spherical.computeDistanceBetween(pLatLng, bLatLng);
    const mid = interpolatePosition(a, b, 0.5);
    const midLatLng = new gm.LatLng(mid.lat, mid.lng);
    const distMid = gm.geometry.spherical.computeDistanceBetween(pLatLng, midLatLng);
    return Math.min(distA, distB, distMid);
  }

  // Fallback: approximate using planar projection for small distances
  const toMeters = (latDelta: number, lngDelta: number, baseLat: number) => {
    const mPerDegLat = 111132.92; // roughly
    const mPerDegLng = 111412.84 * Math.cos(toRadians(baseLat));
    return {
      x: lngDelta * mPerDegLng,
      y: latDelta * mPerDegLat,
    };
  };

  const { x: px, y: py } = toMeters(p.lat - a.lat, p.lng - a.lng, a.lat);
  const { x: bx, y: by } = toMeters(b.lat - a.lat, b.lng - a.lng, a.lat);

  const segLenSq = bx * bx + by * by;
  if (segLenSq === 0) {
    return Math.sqrt(px * px + py * py);
  }

  let t = (px * bx + py * by) / segLenSq;
  t = Math.max(0, Math.min(1, t));

  const projX = bx * t;
  const projY = by * t;
  const dx = px - projX;
  const dy = py - projY;

  return Math.sqrt(dx * dx + dy * dy);
}

export function distancePointToPolylineMeters(
  point: LatLng,
  polyline: LatLng[]
): number {
  if (polyline.length < 2) return Infinity;

  let minDist = Infinity;
  for (let i = 0; i < polyline.length - 1; i += 1) {
    const d = distancePointToSegmentMeters(point, polyline[i], polyline[i + 1]);
    if (d < minDist) {
      minDist = d;
    }
  }
  return minDist;
}

