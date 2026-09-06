import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS 홈 화면 아이콘(apple-touch-icon) — Next.js가 이 파일을 감지해
// 자동으로 <link rel="apple-touch-icon"> 태그를 생성한다.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0d",
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: 6,
            color: "#e8a857",
          }}
        >
          GV
        </div>
      </div>
    ),
    { ...size },
  );
}
