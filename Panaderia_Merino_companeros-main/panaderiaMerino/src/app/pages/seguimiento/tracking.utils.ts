export interface Coordinates {
  lat: number;
  lng: number;
}

function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2) ** 2;
  const sinLng = Math.sin(dLng / 2) ** 2;
  const cosine = Math.cos(lat1) * Math.cos(lat2);
  const distance = 2 * earthRadiusKm * Math.asin(Math.sqrt(sinLat + cosine * sinLng));

  return distance;
}

export function calculateTrackingProgress(current: Coordinates, start: Coordinates, destination: Coordinates): number {
  const totalDistance = haversineDistanceKm(start, destination);

  if (!Number.isFinite(totalDistance) || totalDistance <= 0) {
    return 100;
  }

  const remainingDistance = haversineDistanceKm(current, destination);
  const traveledDistance = Math.max(0, totalDistance - remainingDistance);
  const progress = (traveledDistance / totalDistance) * 100;

  return Math.max(0, Math.min(100, Math.round(progress)));
}
