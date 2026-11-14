import { describe, expect, it } from "vitest";

import { OPEN_LICENSE_FACILITY_PHOTO_PILOT } from "./open-license-facility-photo-pilot";

describe("OPEN_LICENSE_FACILITY_PHOTO_PILOT", () => {
  it("初回検証枠を10施設に限定する", () => {
    expect(OPEN_LICENSE_FACILITY_PHOTO_PILOT).toHaveLength(10);
  });

  it("出典と施設キーが重複していない", () => {
    const keys = OPEN_LICENSE_FACILITY_PHOTO_PILOT.map(
      (photo) => photo.key
    );
    const sourceUrls = OPEN_LICENSE_FACILITY_PHOTO_PILOT.map(
      (photo) => photo.sourceUrl
    );

    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(sourceUrls).size).toBe(sourceUrls.length);
  });

  it("許可済みライセンスと必須クレジット情報だけを持つ", () => {
    const allowedLicenseUrls = new Set([
      "https://creativecommons.org/licenses/by/3.0/",
      "https://creativecommons.org/licenses/by-sa/4.0/",
      "https://creativecommons.org/publicdomain/zero/1.0/",
    ]);

    for (const photo of OPEN_LICENSE_FACILITY_PHOTO_PILOT) {
      expect(photo.facility.nameAliases.length).toBeGreaterThan(0);
      expect(photo.facility.prefecture).not.toBe("");
      expect(photo.workTitle).not.toBe("");
      expect(photo.photographerName).not.toBe("");
      expect(photo.sourceUrl).toMatch(
        /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/u
      );
      expect(photo.downloadUrl).toContain("?width=1920");
      expect(allowedLicenseUrls.has(photo.licenseUrl)).toBe(true);
    }
  });
});
