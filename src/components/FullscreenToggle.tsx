"use client";

import type { SVGProps } from "react";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

interface FullscreenCapableElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface FullscreenCapableDocument extends Document {
  webkitExitFullscreen?: () => Promise<void> | void;
}

function enterFullscreen() {
  const el = document.documentElement as FullscreenCapableElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  const doc = document as FullscreenCapableDocument;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  }
}

function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M16 21h3a2 2 0 0 0 2-2v-3M8 21H5a2 2 0 0 1-2-2v-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompressIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M9 3v3a2 2 0 0 1-2 2H4M15 3v3a2 2 0 0 0 2 2h3M9 21v-3a2 2 0 0 0-2-2H4M15 21v-3a2 2 0 0 1 2-2h3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 전용 풀스크린 토글(spec 3.4, 위치는 3.4.3 재수정). 사이트에서 가장
 * 자주 쓰이는 핵심 액션이므로 5.0.1의 "텍스트로만 강조" 원칙의
 * 예외로 배경을 채운 버튼으로 표시한다. 풀스크린 상태에서도 계속
 * 노출되어야 한다 — 이 버튼이 유일하게 풀스크린을 "끌" 수 있는 UI다.
 *
 * spec 3.4.3 재수정: 데스크톱/태블릿에서는 nav 탭 줄 맨 왼쪽에 끼어
 * 있어서, 모바일(우측 상단 구석)과 위치가 달랐다 — 같은 버튼인데
 * 화면 크기에 따라 위치 감각이 달라지는 비일관성이 문제였다. 그래서
 * SiteHeader의 그리드/flex 흐름에 얹히는 대신, 이 컴포넌트 자체가
 * `fixed`로 화면 우측 상단 구석에 독립적으로 자리 잡는다 — 뷰포트
 * 크기와 무관하게 항상 같은 코너 오버레이가 되어 nav 탭이나 햄버거
 * 메뉴와 절대 같은 줄에 놓이지 않는다. top 오프셋은 헤더의
 * padding-top과 동일한 공식(고정 44px + env(safe-area-inset-top),
 * spec 3.3.2)을 써서, 헤더 안의 로고/햄버거 행과 같은 높이에
 * 자연스럽게 정렬된다. z-index는 헤더 바(z-50)보다 높여 헤더 배경에
 * 가려지지 않도록 한다.
 */
export default function FullscreenToggle() {
  const isFullscreen = useIsFullscreen();

  return (
    <div
      className="fixed right-3 z-[60]"
      style={{ top: "calc(44px + env(safe-area-inset-top))" }}
    >
      <button
        type="button"
        onClick={() => (isFullscreen ? exitFullscreen() : enterFullscreen())}
        aria-label={isFullscreen ? "전체화면 종료" : "전체화면 시작"}
        aria-pressed={isFullscreen}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gv-amber text-gv-matte-black transition-colors hover:bg-gv-amber/85"
      >
        {isFullscreen ? (
          <CompressIcon className="h-5 w-5" />
        ) : (
          <ExpandIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
