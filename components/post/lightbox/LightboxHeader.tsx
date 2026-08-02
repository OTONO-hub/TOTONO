import type {
  ReactNode,
  RefObject,
} from "react";
import {
  Images,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";

type LightboxHeaderProps = {
  activeIndex: number;
  imageCount: number;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  canZoomOut: boolean;
  canZoomIn: boolean;
  canReset: boolean;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onReset: () => void;
  onClose: () => void;
};

export function LightboxHeader({
  activeIndex,
  imageCount,
  closeButtonRef,
  canZoomOut,
  canZoomIn,
  canReset,
  onZoomOut,
  onZoomIn,
  onReset,
  onClose,
}: LightboxHeaderProps) {
  return (
    <header
      className="
        absolute
        inset-x-0
        top-0
        z-30
        flex
        items-center
        justify-between
        gap-3
        bg-linear-to-b
        from-black/75
        to-transparent
        px-4
        pb-8
        pt-[max(1rem,env(safe-area-inset-top))]
        sm:px-6
      "
    >
      <div
        aria-hidden="true"
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-black/45
          px-3
          py-2
          text-sm
          font-semibold
          tabular-nums
          backdrop-blur-md
        "
      >
        <Images
          className="size-4"
          aria-hidden="true"
        />

        {activeIndex + 1} / {imageCount}
      </div>

      <div
        role="group"
        aria-label="画像表示の操作"
        className="
          flex
          items-center
          gap-2
        "
      >
        <LightboxControlButton
          label="画像を縮小する"
          onClick={onZoomOut}
          disabled={!canZoomOut}
        >
          <Minus
            className="size-5"
            aria-hidden="true"
          />
        </LightboxControlButton>

        <LightboxControlButton
          label="画像を拡大する"
          onClick={onZoomIn}
          disabled={!canZoomIn}
        >
          <Plus
            className="size-5"
            aria-hidden="true"
          />
        </LightboxControlButton>

        <LightboxControlButton
          label="画像の拡大と位置をリセットする"
          onClick={onReset}
          disabled={!canReset}
        >
          <RotateCcw
            className="size-[1.125rem]"
            aria-hidden="true"
          />
        </LightboxControlButton>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="画像の全画面表示を閉じる"
          className="
            inline-flex
            size-11
            shrink-0
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
          "
        >
          <X
            className="size-5"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}

type LightboxControlButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
};

function LightboxControlButton({
  label,
  onClick,
  disabled = false,
  children,
}: LightboxControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="
        inline-flex
        size-11
        shrink-0
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
        disabled:cursor-not-allowed
        disabled:opacity-35
        disabled:hover:bg-black/45
        motion-reduce:transition-none
      "
    >
      {children}
    </button>
  );
}
