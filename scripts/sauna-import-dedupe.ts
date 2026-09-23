export type NearbySaunaCandidate = {
  normalized_name: string;
  prefecture: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  address: string | null;
  postal_code: string | null;
  phone_number: string | null;
  website_url: string | null;
  opening_hours: string | null;
  source_id: string;
};

const EARTH_RADIUS_METERS = 6_371_000;

export const NEARBY_DUPLICATE_DISTANCE_METERS = 50;

export function getDistanceMeters(
  first: NearbySaunaCandidate,
  second: NearbySaunaCandidate
): number | null {
  if (
    first.latitude === null ||
    first.longitude === null ||
    second.latitude === null ||
    second.longitude === null
  ) {
    return null;
  }

  const latitudeDelta = toRadians(
    second.latitude - first.latitude
  );
  const longitudeDelta = toRadians(
    second.longitude - first.longitude
  );
  const firstLatitude = toRadians(first.latitude);
  const secondLatitude = toRadians(second.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    EARTH_RADIUS_METERS *
    2 *
    Math.asin(Math.sqrt(haversine))
  );
}

export function isNearbyDuplicate(
  first: NearbySaunaCandidate,
  second: NearbySaunaCandidate,
  maximumDistanceMeters = NEARBY_DUPLICATE_DISTANCE_METERS
): boolean {
  if (
    first.prefecture !== second.prefecture ||
    first.normalized_name !== second.normalized_name
  ) {
    return false;
  }

  const distance = getDistanceMeters(first, second);

  return distance !== null && distance <= maximumDistanceMeters;
}

export function selectPreferredNearbySauna<T extends NearbySaunaCandidate>(
  first: T,
  second: T
): T {
  const firstScore = getCandidateQualityScore(first);
  const secondScore = getCandidateQualityScore(second);

  if (secondScore > firstScore) {
    return second;
  }

  if (
    secondScore === firstScore &&
    second.source_id.localeCompare(first.source_id) < 0
  ) {
    return second;
  }

  return first;
}

function getCandidateQualityScore(
  candidate: NearbySaunaCandidate
): number {
  const informationScore = [
    candidate.city,
    candidate.address,
    candidate.postal_code,
    candidate.phone_number,
    candidate.website_url,
    candidate.opening_hours,
  ].filter(Boolean).length * 10;

  const sourceType = candidate.source_id.split("/", 1)[0];
  const sourceTypeScore = sourceType === "relation"
    ? 3
    : sourceType === "way"
      ? 2
      : 1;

  return informationScore + sourceTypeScore;
}

function toRadians(value: number): number {
  return value * (Math.PI / 180);
}
