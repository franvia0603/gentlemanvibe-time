import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

/**
 * 모든 도구 화면이 공유하는 표준 레이아웃.
 * 상단 여백은 고정된 SiteHeader(BrandHeader+ModeNav)를 위한 안전
 * 공간이다. 헤더는 ModeNav 탭이 한 줄/두 줄로 줄바꿈되는 뷰포트 폭에
 * 따라 실제 높이가 달라지므로, 고정 pt 값 하나로는 두 줄 구간에서
 * 본문 상단이 헤더에 가려 잘리는 문제가 생긴다(spec 6). SiteHeader가
 * ResizeObserver로 실측해 반영하는 `--gv-header-height` CSS 변수를
 * 그대로 padding-top에 쓰고, 변수가 아직 없는 첫 페인트(SSR)에는
 * 단일 줄 헤더 실측치(약 124px) 기준 fallback을 쓴다. 8px 여유분은
 * 측정과 렌더 사이의 미세한 오차에 대비한 안전 여백이다.
 * 하단은 FullscreenHint를 더 이상 fixed로 띄우지 않고 일반 콘텐츠 흐름의
 * 마지막 요소로 배치하므로(spec 5.0.3), 고정 요소와 스크롤 콘텐츠가
 * 겹치는 문제 자체가 구조적으로 발생하지 않는다 — 하단 여백은 시각적
 * 여유분 정도만 둔다.
 */
export default function PageShell({ children }: PageShellProps) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-gv-matte-black px-8 pb-8"
      style={{ paddingTop: "calc(var(--gv-header-height, 124px) + 8px)" }}
    >
      {children}
    </main>
  );
}
