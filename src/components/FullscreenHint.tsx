"use client";

import { useIsFullscreen } from "@/hooks/useIsFullscreen";

type FullscreenHintProps = {
  /** 화면에 노출할 기능명 (예: "디지털 클락") */
  featureName: string;
  /** 문구에 "GV " 뒤에 붙는 영문 모드명 (예: "Clock" → "GV Clock") */
  modeName: string;
};

interface FullscreenCapableElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

function enterFullscreen() {
  const el = document.documentElement as FullscreenCapableElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
}

export default function FullscreenHint({
  featureName,
  modeName,
}: FullscreenHintProps) {
  const isFullscreen = useIsFullscreen();

  if (isFullscreen) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={enterFullscreen}
      className="fixed inset-x-0 bottom-4 z-40 mx-auto block max-w-md px-6 text-center text-[11px] font-light leading-snug text-gv-titanium/60 transition-colors hover:text-gv-titanium"
    >
      무료 {featureName} 사용법: 탭이나 폰에서 전체화면 버튼을 누르시면 깔끔한 GV{" "}
      {modeName} 모드로 나만의 데스크테리어를 완성시켜드립니다.
    </button>
  );
}
