import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.totonosauna.app",
  appName: "TOTONO",
  webDir: "mobile/dist",
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#e6e5efff",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#e6e5ef",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "native",
      style: "light",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
