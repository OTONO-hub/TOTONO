import {
  Browser,
} from "@capacitor/browser";
import {
  Capacitor,
} from "@capacitor/core";

const DEFAULT_PUBLIC_WEB_URL =
  "https://www.totono-sauna.com";

function normalizeUrl(
  value:
    | string
    | undefined
): string | null {
  const normalizedValue =
    value?.trim();

  if (!normalizedValue) {
    return null;
  }

  try {
    const url =
      new URL(
        normalizedValue
      );

    if (
      url.protocol !==
        "https:" &&
      url.protocol !==
        "http:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function createPublicPageUrl(
  configuredUrl:
    | string
    | undefined,
  pathname: string
): string {
  const explicitUrl =
    normalizeUrl(
      configuredUrl
    );

  if (explicitUrl) {
    return explicitUrl;
  }

  const configuredBaseUrl =
    normalizeUrl(
      import.meta.env
        .VITE_PUBLIC_WEB_URL
    );

  const baseUrl =
    configuredBaseUrl ??
    DEFAULT_PUBLIC_WEB_URL;

  return new URL(
    pathname,
    baseUrl
  ).toString();
}

export const privacyPolicyUrl =
  createPublicPageUrl(
    import.meta.env
      .VITE_PRIVACY_POLICY_URL,
    "/privacy"
  );

export const termsOfServiceUrl =
  createPublicPageUrl(
    import.meta.env
      .VITE_TERMS_OF_SERVICE_URL,
    "/terms"
  );

export async function openExternalPage(
  url: string
): Promise<void> {
  const normalizedUrl =
    normalizeUrl(
      url
    );

  if (!normalizedUrl) {
    throw new Error(
      "ページのURLが正しくありません。"
    );
  }

  if (
    Capacitor.isNativePlatform()
  ) {
    await Browser.open({
      url:
        normalizedUrl,
    });

    return;
  }

  const openedWindow =
    window.open(
      normalizedUrl,
      "_blank",
      "noopener,noreferrer"
    );

  if (!openedWindow) {
    window.location.assign(
      normalizedUrl
    );
  }
}

export async function openPrivacyPolicy(): Promise<void> {
  await openExternalPage(
    privacyPolicyUrl
  );
}

export async function openTermsOfService(): Promise<void> {
  await openExternalPage(
    termsOfServiceUrl
  );
}
