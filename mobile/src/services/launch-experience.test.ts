import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getLaunchMinimumDuration,
  getLaunchMode,
  markLaunchExperienceSeen,
} from "./launch-experience";

function createStorage() {
  const values =
    new Map<
      string,
      string
    >();

  return {
    getItem(
      key: string
    ) {
      return values.get(
        key
      ) ?? null;
    },

    setItem(
      key: string,
      value: string
    ) {
      values.set(
        key,
        value
      );
    },
  };
}

describe("launch experience", () => {
  it("uses the full brand experience only on first launch", () => {
    const storage =
      createStorage();

    expect(
      getLaunchMode(
        storage
      )
    ).toBe(
      "first"
    );

    markLaunchExperienceSeen(
      storage
    );

    expect(
      getLaunchMode(
        storage
      )
    ).toBe(
      "returning"
    );
  });

  it("keeps returning launches shorter", () => {
    expect(
      getLaunchMinimumDuration(
        "returning"
      )
    ).toBeLessThan(
      getLaunchMinimumDuration(
        "first"
      )
    );
  });
});
