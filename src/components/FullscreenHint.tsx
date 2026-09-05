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

  // spec 5.0.3: fixed로 화면에 고정하면 스크롤이 필요한(뷰포트보다 긴)
  // 페이지에서는 스크롤 위치와 무관하게 일반 콘텐츠와 겹칠 수밖에 없다
  // (고정 요소는 늘 같은 화면 좌표에 있고, 콘텐츠가 스크롤되며 그 자리를
  // 지나가기 때문). 대신 각 페이지 콘텐츠의 마지막 요소로 정상 배치해
  // 겹침 자체가 구조적으로 불가능하게 한다.
  return (
    <button
      type="button"
      onClick={enterFullscreen}
      className="mx-auto block w-full max-w-md px-6 pb-2 pt-4 text-center text-xs font-normal leading-snug text-gv-titanium transition-colors hover:text-gv-beige"
    >
      무료 {featureName} 사용법: 탭이나 폰에서 전체화면 버튼을 누르시면 깔끔한 GV{" "}
      {modeName} 모드로 나만의 데스크테리어를 완성시켜드립니다.
    </button>
  );
}
