import { describe, expect, it } from "vitest";

import {
  validateFacilityPhotoFile,
  validateRightsMetadata,
} from "./facility-photos";

describe("validateRightsMetadata", () => {
  const valid = {
    sourceType: "self_shot",
    photographerName: "TOTONO編集部",
    rightsHolderName: "TOTONO",
    permissionScope: "TOTONO Web・iOSでの掲載",
    permissionEvidenceNote: "自社撮影台帳 #1",
    sourceUrl: "",
    licenseName: "",
    licenseUrl: "",
  };

  it("accepts a fully documented self-shot photo", () => {
    expect(validateRightsMetadata(valid)).toBeNull();
  });

  it("requires license and source details for open-license photos", () => {
    expect(
      validateRightsMetadata({
        ...valid,
        sourceType: "open_license",
      })
    ).toContain("出典URL");
  });

  it("rejects unapproved source types", () => {
    expect(
      validateRightsMetadata({
        ...valid,
        sourceType: "official_site_copy",
      })
    ).toContain("許可された登録元");
  });
});

describe("validateFacilityPhotoFile", () => {
  it("rejects unsupported image formats", () => {
    const file = new File(["photo"], "photo.gif", {
      type: "image/gif",
    });
    expect(validateFacilityPhotoFile(file)).toContain("JPEG");
  });
});
