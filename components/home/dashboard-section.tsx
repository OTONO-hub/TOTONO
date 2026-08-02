import type { ReactNode } from "react";

type DashboardSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: "default" | "soft" | "plain";
};

function getVariantClassName(
  variant: DashboardSectionProps["variant"]
): string {
  switch (variant) {
    case "soft":
      return `
        border border-border/45
        bg-card/65
        shadow-[0_30px_90px_-65px_rgba(62,58,58,0.38)]
        backdrop-blur-xl
      `;

    case "plain":
      return `
        border border-transparent
        bg-transparent
        shadow-none
      `;

    case "default":
    default:
      return `
        border border-border/55
        bg-card
        shadow-[0_30px_90px_-65px_rgba(62,58,58,0.42)]
      `;
  }
}

export function DashboardSection({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
  className = "",
  contentClassName = "",
  variant = "default",
}: DashboardSectionProps) {
  const hasHeader = Boolean(
    eyebrow ||
      title ||
      description ||
      action
  );

  return (
    <section
      id={id}
      className={`
        scroll-mt-36
        overflow-hidden
        rounded-[1.5rem]
        sm:rounded-[1.75rem]
        lg:rounded-[2rem]
        ${getVariantClassName(variant)}
        ${className}
      `}
    >
      {hasHeader && (
        <header
          className="
            flex
            flex-col
            gap-5
            border-b border-border/40
            px-5
            py-6
            sm:px-7
            sm:py-7
            lg:flex-row
            lg:items-end
            lg:justify-between
            lg:gap-10
            lg:px-9
            lg:py-8
          "
        >
          <div className="min-w-0">
            {eyebrow && (
              <p
                className="
                  text-[0.68rem]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-muted-foreground
                "
              >
                {eyebrow}
              </p>
            )}

            {title && (
              <h2
                className={`
                  text-xl
                  font-semibold
                  tracking-[-0.035em]
                  text-foreground
                  sm:text-2xl
                  lg:text-[1.75rem]
                  ${eyebrow ? "mt-2" : ""}
                `}
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-7
                  text-muted-foreground
                  sm:text-[0.95rem]
                  sm:leading-7
                "
              >
                {description}
              </p>
            )}
          </div>

          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </header>
      )}

      <div
        className={`
          px-4
          py-5
          sm:px-6
          sm:py-7
          lg:px-8
          lg:py-9
          ${contentClassName}
        `}
      >
        {children}
      </div>
    </section>
  );
}
