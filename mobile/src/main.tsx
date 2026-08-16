import {
  StrictMode,
} from "react";
import {
  createRoot,
} from "react-dom/client";

import {
  App,
} from "./App";
import {
  AppErrorBoundary,
} from "./components/AppErrorBoundary";
import {
  NetworkStatusBanner,
} from "./components/NetworkStatusBanner";
import {
  configureNativeApp,
} from "./services/native-app";

import "./styles.css";

const rootElement =
  document.getElementById(
    "root"
  );

if (!rootElement) {
  throw new Error(
    "アプリの表示先が見つかりません。"
  );
}

createRoot(
  rootElement
).render(
  <StrictMode>
    <AppErrorBoundary>
      <NetworkStatusBanner />

      <App />
    </AppErrorBoundary>
  </StrictMode>
);

window.requestAnimationFrame(
  () => {
    void configureNativeApp();
  }
);
