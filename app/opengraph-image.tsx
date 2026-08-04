import { ImageResponse } from "next/og";

export const alt =
  "TOTONO｜サウナへ行く前から、整い始める。";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const BRAND_COLORS = [
  "#3e3a3a",
  "#fdd000",
  "#9fd9f6",
  "#00b4b6",
] as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#e6e5ef",
          color: "#3e3a3a",
          fontFamily:
            "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -180,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "#9fd9f6",
            opacity: 0.25,
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: -120,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "#fdd000",
            opacity: 0.2,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 54,
            right: 66,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.08em",
            opacity: 0.65,
          }}
        >
          SAUNA LIFE PLATFORM
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            padding: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 96,
                height: 96,
                borderRadius: 9999,
                background: "#3e3a3a",
                color: "#ffffff",
                fontSize: 42,
                fontWeight: 700,
              }}
            >
              ♨
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              TOTONO
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 56,
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.04em",
            }}
          >
            <div style={{ display: "flex" }}>
              サウナへ行く前から、
            </div>

            <div style={{ display: "flex" }}>
              整い始める。
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "#686363",
              fontSize: 26,
              lineHeight: 1.5,
            }}
          >
            発見・記録・つながりを、ひとつの場所に。
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 52,
            }}
          >
            {BRAND_COLORS.map((color) => (
              <div
                key={color}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 9999,
                  background: color,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      emoji: "noto",
    }
  );
}
