import {
  Capacitor,
} from "@capacitor/core";
import {
  SplashScreen,
} from "@capacitor/splash-screen";
import {
  StatusBar,
  Style,
} from "@capacitor/status-bar";

export async function configureNativeApp():
  Promise<void> {
  if (
    !Capacitor
      .isNativePlatform()
  ) {
    return;
  }

  const results =
    await Promise.allSettled([
      StatusBar.setStyle({
        style:
          Style.Dark,
      }),

      SplashScreen.hide({
        fadeOutDuration:
          250,
      }),
    ]);

  if (
    import.meta.env.DEV
  ) {
    results.forEach(
      (
        result,
        index
      ) => {
        if (
          result.status ===
          "rejected"
        ) {
          const operation =
            index === 0
              ? "StatusBar"
              : "SplashScreen";

          console.warn(
            `${operation}の設定に失敗しました。`,
            result.reason
          );
        }
      }
    );
  }
}
