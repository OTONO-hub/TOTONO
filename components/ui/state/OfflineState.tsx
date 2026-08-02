"use client";

import {
  WifiOff,
} from "lucide-react";
import { useSyncExternalStore } from "react";

import { RetryButton } from "@/components/ui/state/RetryButton";

type OfflineStateProps = {
  title?: string;
  description?: string;
};

export function OfflineState({
  title = "インターネットに接続されていません",
  description =
    "接続が戻ると、TOTONOの情報をもう一度読み込めます。Wi-Fiやモバイル通信をご確認ください。",
}: OfflineStateProps) {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-linear-to-br
        from-card/95
        via-background
        to-secondary/10
        px-6
        py-14
        text-center
        shadow-sm
        sm:rounded-[2.5rem]
        sm:px-10
        sm:py-18
      "
    >
      <div
        className="
          mx-auto
          flex
          size-16
          items-center
          justify-center
          rounded-full
          border
          border-border/55
          bg-card/85
          text-muted-foreground
          shadow-sm
        "
      >
        <WifiOff
          className="size-6"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      <p
        className="
          mt-6
          text-xs
          font-semibold
          uppercase
          tracking-[0.24em]
          text-muted-foreground
        "
      >
        Offline
      </p>

      <h2
        className="
          mt-4
          text-2xl
          font-semibold
          tracking-[-0.035em]
          text-foreground
          sm:text-3xl
        "
      >
        {title}
      </h2>

      <p
        className="
          mx-auto
          mt-4
          max-w-xl
          text-sm
          leading-7
          text-muted-foreground
          sm:text-base
          sm:leading-8
        "
      >
        {description}
      </p>

      <RetryButton
        className="mt-8"
        label="接続を確認する"
      />
    </section>
  );
}

function subscribe(
  onStoreChange: () => void
): () => void {
  window.addEventListener(
    "online",
    onStoreChange
  );

  window.addEventListener(
    "offline",
    onStoreChange
  );

  return () => {
    window.removeEventListener(
      "online",
      onStoreChange
    );

    window.removeEventListener(
      "offline",
      onStoreChange
    );
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}
