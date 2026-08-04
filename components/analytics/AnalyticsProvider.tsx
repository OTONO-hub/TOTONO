import { GoogleAnalytics } from "@next/third-parties/google";

import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";

const googleAnalyticsId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const clarityProjectId =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function AnalyticsProvider() {
  return (
    <>
      {googleAnalyticsId ? (
        <GoogleAnalytics
          gaId={googleAnalyticsId}
        />
      ) : null}

      {clarityProjectId ? (
        <MicrosoftClarity
          projectId={clarityProjectId}
        />
      ) : null}
    </>
  );
}
