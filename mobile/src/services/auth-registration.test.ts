import type {
  SupabaseClient,
} from "@supabase/supabase-js";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  isUsernameAvailable,
  validateRegistrationUsername,
  wasCreatedDuringRegistration,
} from "./auth-registration";

describe("validateRegistrationUsername", () => {
  it("accepts a trimmed 2 to 30 character username", () => {
    expect(
      validateRegistrationUsername(
        "  サウナ好き  "
      )
    ).toBeNull();
  });

  it("rejects a username that is too short", () => {
    expect(
      validateRegistrationUsername(
        "湯"
      )
    ).toContain(
      "2文字以上"
    );
  });
});

describe("isUsernameAvailable", () => {
  it("checks the normalized username without a user exclusion", async () => {
    const rpc = vi
      .fn()
      .mockResolvedValue({
        data: true,
        error: null,
      });

    const client = {
      rpc,
    } as unknown as SupabaseClient;

    await expect(
      isUsernameAvailable(
        client,
        "  totono_user  "
      )
    ).resolves.toBe(
      true
    );

    expect(
      rpc
    ).toHaveBeenCalledWith(
      "is_username_available",
      {
        candidate_username:
          "totono_user",
        excluded_user_id:
          null,
      }
    );
  });
});

describe("wasCreatedDuringRegistration", () => {
  it("identifies an account created by the current registration", () => {
    const startedAt =
      Date.parse(
        "2026-09-23T10:00:00.000Z"
      );

    expect(
      wasCreatedDuringRegistration(
        "2026-09-23T10:00:01.000Z",
        startedAt
      )
    ).toBe(
      true
    );
  });

  it("does not classify an existing account as a sign-up", () => {
    const startedAt =
      Date.parse(
        "2026-09-23T10:00:00.000Z"
      );

    expect(
      wasCreatedDuringRegistration(
        "2026-08-01T10:00:00.000Z",
        startedAt
      )
    ).toBe(
      false
    );
  });
});
