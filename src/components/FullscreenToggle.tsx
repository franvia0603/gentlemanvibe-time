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
 * 화면 상단(설정 톱니바퀴 아이콘 옆)에 항상 노출되는 전용 풀스크린 토글.
 * FullscreenHint 하단 문구와 달리, 풀스크린 상태에서도 숨기지 않는다 —
 * 이 버튼이 유일하게 풀스크린을 "끌" 수 있는 화면 UI이기 때문이다.
 */
export default function FullscreenToggle() {
  const isFullscreen = useIsFullscreen();

  return (
    <button
      type="button"
      onClick={() => (isFullscreen ? exitFullscreen() : enterFullscreen())}
      aria-label={isFullscreen ? "전체화면 종료" : "전체화면 시작"}
      aria-pressed={isFullscreen}
      className="fixed right-4 top-4 z-50 flex h-7 w-7 items-center justify-center rounded-full text-gv-titanium/60 transition-colors hover:text-gv-titanium"
    >
      {isFullscreen ? (
        <CompressIcon className="h-4 w-4" />
      ) : (
        <ExpandIcon className="h-4 w-4" />
      )}
    </button>
  );
}
