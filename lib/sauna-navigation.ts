type SaunaNavigationInput = {
  name: string;
  latitude?: number | null;
  longitude?: number | null;
};

function hasValidCoordinate(
  value: number | null | undefined,
  minimum: number,
  maximum: number
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function hasValidCoordinates(
  latitude: number | null | undefined,
  longitude: number | null | undefined
): latitude is number {
  return (
    hasValidCoordinate(
      latitude,
      -90,
      90
    ) &&
    hasValidCoordinate(
      longitude,
      -180,
      180
    )
  );
}

export function createGoogleMapsDirectionUrl({
  name,
  latitude,
  longitude,
}: SaunaNavigationInput): string {
  const destination =
    hasValidCoordinates(
      latitude,
      longitude
    )
      ? `${latitude},${longitude}`
      : name;

  const parameters =
    new URLSearchParams({
      api: "1",
      destination,
      travelmode: "driving",
    });

  return `https://www.google.com/maps/dir/?${parameters.toString()}`;
}

export function createGoogleMapsPlaceUrl({
  name,
  latitude,
  longitude,
}: SaunaNavigationInput): string {
  const query =
    hasValidCoordinates(
      latitude,
      longitude
    )
      ? `${latitude},${longitude}`
      : name;

  const parameters =
    new URLSearchParams({
      api: "1",
      query,
    });

  return `https://www.google.com/maps/search/?${parameters.toString()}`;
}
