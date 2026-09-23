import {
  Geolocation,
} from "@capacitor/geolocation";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  CurrentLocationError,
  getCurrentSearchLocation,
} from "./current-location";

vi.mock("@capacitor/geolocation", () => ({
  Geolocation: {
    checkPermissions: vi.fn(),
    requestPermissions: vi.fn(),
    getCurrentPosition: vi.fn(),
  },
}));

describe("getCurrentSearchLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns coordinates after location permission is granted", async () => {
    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "granted",
      coarseLocation: "granted",
    });
    vi.mocked(Geolocation.getCurrentPosition).mockResolvedValue({
      timestamp: 0,
      coords: {
        latitude: 35.6812,
        longitude: 139.7671,
        accuracy: 10,
        altitudeAccuracy: null,
        altitude: null,
        speed: null,
        heading: null,
        magneticHeading: null,
        trueHeading: null,
        headingAccuracy: null,
        course: null,
      },
    });

    await expect(getCurrentSearchLocation()).resolves.toEqual({
      latitude: 35.6812,
      longitude: 139.7671,
    });
  });

  it("reports denied permission without requesting coordinates", async () => {
    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "denied",
      coarseLocation: "denied",
    });

    await expect(getCurrentSearchLocation()).rejects.toMatchObject({
      reason: "denied",
    } satisfies Partial<CurrentLocationError>);
    expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled();
  });

  it("requests permission when the system requires a rationale", async () => {
    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "prompt-with-rationale",
      coarseLocation: "prompt-with-rationale",
    });
    vi.mocked(Geolocation.requestPermissions).mockResolvedValue({
      location: "denied",
      coarseLocation: "denied",
    });

    await expect(getCurrentSearchLocation()).rejects.toMatchObject({
      reason: "denied",
    } satisfies Partial<CurrentLocationError>);
    expect(Geolocation.requestPermissions).toHaveBeenCalledWith({
      permissions: ["location"],
    });
  });
});
