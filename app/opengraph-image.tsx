import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TOTONO";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          background: "#e6e5ef",
          color: "#3e3a3a",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* 背景装飾 */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -180,
            width: 420,
            height: 420,
            borderRadius: "9999px",
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
            borderRadius: "9999px",
            background: "#fdd000",
            opacity: 0.2,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            width: "100%",
          }}
        >
          {/* ロゴ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "9999px",
                background: "#3e3a3a",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ffffff",
                fontSize: 42,
                fontWeight: 700,
              }}
            >
              ♨
            </div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              TOTONO
            </div>
          </div>

          {/* キャッチコピー */}
          <div
            style={{
              marginTop: 56,
              display: "flex",
              flexDirection: "column",
              fontSize: 56,
              lineHeight: 1.25,
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            <span>サウナへ行く前から、</span>
            <span>整い始める。</span>
          </div>

          {/* サブコピー */}
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#666666",
            }}
          >
            Sauna Life Platform
          </div>

          {/* ブランドカラー */}
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 56,
            }}
          >
            {[
              "#3e3a3a",
              "#fdd000",
              "#9fd9f6",
              "#00b4b6",
            ].map((color) => (
              <div
                key={color}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "9999px",
                  background: color,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
