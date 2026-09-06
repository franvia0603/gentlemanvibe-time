import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og(엣지 런타임)는 Tailwind 클래스나 CSS 변수를 읽을 수 없으므로
// globals.css의 --gv-matte-black-rgb(13 13 13), --gv-amber-rgb(232 168 87)를
// 그대로 hex로 옮겨 적었다.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0d",
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontWeight: 800,
            letterSpacing: 12,
            color: "#e8a857",
          }}
        >
          GV
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 42,
            fontWeight: 400,
            letterSpacing: 6,
            color: "#f5f1e8",
          }}
        >
          GentlemanVibe Time
        </div>
      </div>
    ),
    { ...size },
  );
}
