import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS 홈 화면 아이콘(apple-touch-icon) — Next.js가 이 파일을 감지해
// 자동으로 <link rel="apple-touch-icon"> 태그를 생성한다.
//
// app/favicon.ico가 새로 교체된 커스텀 파비콘(흰 배경 + 로즈/모브 톤
// 원형 배지 + 흰색 "GV" 컷아웃, #a67a84)과 시각적으로 통일되도록 이
// 아이콘도 같은 배지 디자인으로 맞춘다. 원본 favicon.ico는 최대 48x48
// 래스터라 180x180으로 그대로 확대하면 흐려지므로, 같은 색상·구성을
// next/og로 이 해상도에 맞게 다시 그린다.
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
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            width: "84%",
            height: "84%",
            borderRadius: "50%",
            backgroundColor: "#a67a84",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#ffffff",
            }}
          >
            GV
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
