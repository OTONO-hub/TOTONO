import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipNavigation } from "@/components/layout/SkipNavigation";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { Toaster } from "@/components/ui/sonner";
import { siteMetadata } from "@/lib/site-metadata";

import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

export const metadata: Metadata = siteMetadata;

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
    >
      <body
        className="
          flex
          min-h-screen
          flex-col
          bg-background
          text-foreground
          antialiased
        "
      >
        <SiteJsonLd />

        <SkipNavigation />

        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-screen flex-1"
        >
          {children}
        </main>

        <SiteFooter />

        <Toaster />

        <AnalyticsProvider />
      </body>
    </html>
  );
}
