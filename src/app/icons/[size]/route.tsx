import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

export const runtime = "edge";

// manifest.json이 참조하는 192/512/maskable-512 PNG 아이콘을 next/og로
// 즉시 생성한다 — 별도 이미지 편집 도구나 래스터라이즈 라이브러리 없이
// opengraph-image.tsx와 동일한 방식으로 브랜드 컬러 아이콘을 만든다.
//
// app/favicon.ico가 새로 교체된 커스텀 파비콘(흰 배경 + 로즈/모브 톤
// 원형 배지 + 흰색 "GV" 컷아웃, #a67a84)과 시각적으로 통일되도록 이
// PWA 아이콘들도 같은 배지 디자인으로 맞춘다(원본 favicon.ico는 최대
// 48x48이라 512까지 그대로 확대하면 흐려지므로 next/og로 다시 그린다).
const ICON_CONFIGS: Record<string, { size: number; maskable: boolean }> = {
  "icon-192": { size: 192, maskable: false },
  "icon-512": { size: 512, maskable: false },
  "maskable-icon-512": { size: 512, maskable: true },
};

export function GET(
  _request: Request,
  { params }: { params: { size: string } },
) {
  const config = ICON_CONFIGS[params.size];
  if (!config) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { size, maskable } = config;
  // maskable 아이콘은 OS가 원형/둥근사각형 등으로 마스킹할 수 있으므로,
  // 핵심 콘텐츠(배지 원)를 안전 영역(전체의 약 80%) 안에 담아야 잘리지
  // 않는다. non-maskable은 배지가 캔버스 대부분을 채워도 된다.
  const badgeRatio = maskable ? 0.62 : 0.84;
  const fontSize = size * badgeRatio * 0.34;

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
            width: `${badgeRatio * 100}%`,
            height: `${badgeRatio * 100}%`,
            borderRadius: "50%",
            backgroundColor: "#a67a84",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize,
              fontWeight: 800,
              letterSpacing: fontSize * 0.03,
              color: "#ffffff",
            }}
          >
            GV
          </div>
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
