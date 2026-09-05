import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

/**
 * 모든 도구 화면이 공유하는 표준 레이아웃.
 * 상단은 고정된 SiteHeader(BrandHeader+ModeNav, 실측 약 124px)를 위한
 * 안전 여백을 확보한다 — 실측치보다 낮게 잡으면 짧은 페이지에서도
 * 콘텐츠 상단이 헤더와 겹칠 수 있어 pt-32(128px)로 여유를 둔다.
 * 하단은 FullscreenHint를 더 이상 fixed로 띄우지 않고 일반 콘텐츠 흐름의
 * 마지막 요소로 배치하므로(spec 5.0.3), 고정 요소와 스크롤 콘텐츠가
 * 겹치는 문제 자체가 구조적으로 발생하지 않는다 — 하단 여백은 시각적
 * 여유분 정도만 둔다.
 */
export default function PageShell({ children }: PageShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gv-matte-black px-8 pb-8 pt-32">
      {children}
    </main>
  );
}
