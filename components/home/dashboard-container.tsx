import type { ReactNode } from "react";

import { PageSection } from "@/components/ui/page-section";

type DashboardContainerProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardContainer({
  children,
  className,
}: DashboardContainerProps) {
  return (
    <PageSection
      width="default"
      className={className}
    >
      {children}
    </PageSection>
  );
}
