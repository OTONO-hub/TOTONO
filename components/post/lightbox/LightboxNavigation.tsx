import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type LightboxNavigationProps = {
  showPrevious: boolean;
  showNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function LightboxNavigation({
  showPrevious,
  showNext,
  onPrevious,
  onNext,
}: LightboxNavigationProps) {
  if (
    !showPrevious &&
    !showNext
  ) {
    return null;
  }

  return (
    <nav
      aria-label="投稿画像の切り替え"
    >
      {showPrevious ? (
        <LightboxArrowButton
          direction="previous"
          onClick={onPrevious}
        />
      ) : null}

      {showNext ? (
        <LightboxArrowButton
          direction="next"
          onClick={onNext}
        />
      ) : null}
    </nav>
  );
}

type LightboxArrowButtonProps = {
  direction:
    | "previous"
    | "next";
  onClick: () => void;
};

function LightboxArrowButton({
  direction,
  onClick,
}: LightboxArrowButtonProps) {
  const isPrevious =
    direction === "previous";

  const Icon = isPrevious
    ? ChevronLeft
    : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        isPrevious
          ? "前の投稿画像を表示"
          : "次の投稿画像を表示"
      }
      className={`
        group
        absolute
        top-1/2
        z-30
        hidden
        size-12
        shrink-0
        -translate-y-1/2
        items-center
        justify-center
        rounded-full
        bg-black/45
        text-white
        backdrop-blur-md
        transition
        duration-200
        hover:bg-white/15
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-white
        focus-visible:ring-offset-2
        focus-visible:ring-offset-black
        motion-reduce:transition-none
        sm:inline-flex
        ${
          isPrevious
            ? "left-5"
            : "right-5"
        }
      `}
    >
      <Icon
        className={`
          size-6
          transition-transform
          duration-200
          motion-reduce:transition-none
          ${
            isPrevious
              ? "group-hover:-translate-x-0.5"
              : "group-hover:translate-x-0.5"
          }
          motion-reduce:group-hover:translate-x-0
        `}
        aria-hidden="true"
      />
    </button>
  );
}
