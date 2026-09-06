import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

export const runtime = "edge";

// manifest.json이 참조하는 192/512/maskable-512 PNG 아이콘을 next/og로
// 즉시 생성한다 — 별도 이미지 편집 도구나 래스터라이즈 라이브러리 없이
// opengraph-image.tsx와 동일한 방식으로 브랜드 컬러 아이콘을 만든다.
// (--gv-matte-black-rgb: 13 13 13, --gv-amber-rgb: 232 168 87)
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
  // 핵심 콘텐츠를 안전 영역(전체의 약 80%) 안에 담아야 잘리지 않는다.
  const fontSize = maskable ? size * 0.28 : size * 0.42;

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
            fontSize,
            fontWeight: 800,
            letterSpacing: fontSize * 0.08,
            color: "#e8a857",
          }}
        >
          GV
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
