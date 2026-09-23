import { describe, expect, it } from "vitest";

import {
  isNearbyDuplicate,
  selectPreferredNearbySauna,
  type NearbySaunaCandidate,
} from "./sauna-import-dedupe";

function createCandidate(
  overrides: Partial<NearbySaunaCandidate> = {}
): NearbySaunaCandidate {
  return {
    normalized_name: "境南浴場",
    prefecture: "東京都",
    latitude: 35.7001819,
    longitude: 139.5412396,
    city: null,
    address: null,
    postal_code: null,
    phone_number: null,
    website_url: null,
    opening_hours: null,
    source_id: "node/1",
    ...overrides,
  };
}

describe("OSM sauna nearby deduplication", () => {
  it("treats the same normalized name within 50 meters as a duplicate", () => {
    const first = createCandidate();
    const second = createCandidate({
      latitude: 35.7001867,
      longitude: 139.5412433,
      source_id: "node/2",
    });

    expect(isNearbyDuplicate(first, second)).toBe(true);
  });

  it("keeps same-name facilities that are far apart", () => {
    const first = createCandidate();
    const second = createCandidate({
      latitude: 35.71,
      longitude: 139.55,
      source_id: "node/2",
    });

    expect(isNearbyDuplicate(first, second)).toBe(false);
  });

  it("prefers the candidate with richer location data", () => {
    const first = createCandidate();
    const second = createCandidate({
      city: "武蔵野市",
      address: "東京都武蔵野市境南町",
      source_id: "node/2",
    });

    expect(selectPreferredNearbySauna(first, second)).toBe(second);
  });

  it("prefers a way over a node when information is otherwise equal", () => {
    const node = createCandidate({ source_id: "node/1" });
    const way = createCandidate({ source_id: "way/2" });

    expect(selectPreferredNearbySauna(node, way)).toBe(way);
  });

  it("uses the source id as a deterministic tie breaker", () => {
    const laterSource = createCandidate({ source_id: "node/20" });
    const earlierSource = createCandidate({ source_id: "node/10" });

    expect(
      selectPreferredNearbySauna(laterSource, earlierSource)
    ).toBe(earlierSource);
  });
});
