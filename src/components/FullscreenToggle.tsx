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
 * SiteHeader의 ModeNav 좌측에 단일하게 배치되는 전용 풀스크린 토글
 * (spec 3.4 — 위치/스타일 통일). 사이트에서 가장 자주 쓰이는 핵심
 * 액션이므로 5.0.1의 "텍스트로만 강조" 원칙의 예외로 배경을 채운
 * 버튼으로 표시한다. ModeNav와 달리 풀스크린 상태에서도 계속
 * 노출되어야 한다 — 이 버튼이 유일하게 풀스크린을 "끌" 수 있는 UI다.
 */
export default function FullscreenToggle() {
  const isFullscreen = useIsFullscreen();

  return (
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
  );
}
