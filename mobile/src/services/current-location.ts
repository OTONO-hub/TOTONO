import {
  Geolocation,
} from "@capacitor/geolocation";

export type CurrentSearchLocation = {
  latitude: number;
  longitude: number;
};

export class CurrentLocationError extends Error {
  constructor(
    public readonly reason: "denied" | "unavailable"
  ) {
    super(
      reason === "denied"
        ? "位置情報の利用が許可されていません。"
        : "現在地を取得できませんでした。"
    );
  }
}

export async function getCurrentSearchLocation(): Promise<CurrentSearchLocation> {
  const permission =
    await Geolocation.checkPermissions();

  let locationPermission =
    permission.location;

  if (
    locationPermission === "prompt" ||
    locationPermission === "prompt-with-rationale"
  ) {
    const requested =
      await Geolocation.requestPermissions({
        permissions: ["location"],
      });

    locationPermission =
      requested.location;
  }

  if (locationPermission !== "granted") {
    throw new CurrentLocationError(
      "denied"
    );
  }

  try {
    const position =
      await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 300_000,
      });

    return {
      latitude:
        position.coords.latitude,
      longitude:
        position.coords.longitude,
    };
  } catch {
    throw new CurrentLocationError(
      "unavailable"
    );
  }
}
