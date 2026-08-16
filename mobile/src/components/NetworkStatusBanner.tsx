import {
  useSyncExternalStore,
} from "react";
import {
  CloudOff,
} from "lucide-react";

function subscribeToNetworkStatus(
  onStoreChange:
    () => void
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

function getNetworkSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

export function NetworkStatusBanner() {
  const isOnline =
    useSyncExternalStore(
      subscribeToNetworkStatus,
      getNetworkSnapshot,
      getServerSnapshot
    );

  if (isOnline) {
    return null;
  }

  return (
    <div
      className="network-status-banner"
      role="status"
      aria-live="polite"
    >
      <CloudOff
        aria-hidden="true"
      />

      <span>
        オフラインです。
        通信状態を確認してください。
      </span>
    </div>
  );
}
