import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";

type TodayEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export function TodayEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: TodayEmptyStateProps) {
  return (
    <AppCard
      variant="soft"
      radius="xl"
      padding="lg"
      className="
        border-dashed
        bg-card/55
      "
    >
      <div
        className="
          flex
          size-12
          items-center
          justify-center
          rounded-full
          bg-secondary/20
          text-foreground/65
        "
      >
        <Icon
          aria-hidden="true"
          className="size-5"
          strokeWidth={1.8}
        />
      </div>

      <h3
        className="
          mt-5
          text-xl
          font-semibold
          tracking-[-0.03em]
          text-foreground
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          max-w-lg
          text-sm
          leading-7
          text-muted-foreground
          sm:text-base
        "
      >
        {description}
      </p>

      <AppButton
        href={actionHref}
        trailingIcon={
          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
          />
        }
        className="mt-6"
      >
        {actionLabel}
      </AppButton>
    </AppCard>
  );
}

