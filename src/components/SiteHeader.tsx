"use client";

import { useEffect, useRef } from "react";
import BrandHeader from "@/components/BrandHeader";
import ModeNav from "@/components/ModeNav";
import FullscreenToggle from "@/components/FullscreenToggle";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

/**
 * BrandHeader/ModeNav를 감싸는 단일 fixed 상단 바.
 * 이전에는 두 컴포넌트가 각자 fixed로 투명하게 떠 있어서, 스크롤이
 * 필요한 긴 페이지(Privacy Policy 등)에서 스크롤 중인 본문 텍스트와
 * 시각적으로 겹쳐 읽기 어려운 문제가 있었다. 배경이 있는 하나의 헤더
 * 바로 통합해 스크롤되는 콘텐츠가 그 뒤로 자연스럽게 지나가도록 한다
 * (표준적인 고정 헤더 동작).
 *
 * 풀스크린 토글은 ModeNav 좌측에 단일하게 배치한다(spec 3.4). ModeNav는
 * 풀스크린 중 스스로 숨지만 토글은 계속 보여야 하므로, ModeNav가 사라진
 * 자리에서 토글만 남았을 때는 가운데로 재정렬한다.
 *
 * 헤더는 뷰포트 폭에 따라 ModeNav 탭이 한 줄/두 줄로 바뀌며 실제 높이가
 * 달라진다. 본문이 고정 pt-* 값 하나로 이 가변 높이를 가정하면, 두 줄로
 * 줄바꿈되는 구간에서 본문 최상단 요소가 헤더에 가려 잘리는 문제가
 * 생긴다(spec 6). ResizeObserver로 헤더의 실제 렌더링 높이를 측정해
 * `--gv-header-height` CSS 변수로 반영하면, PageShell/StaticPageShell이
 * 이 값을 읽어 항상 정확한 안전 여백을 확보할 수 있다.
 *
 * spec 3.3.2: 펀치홀 카메라 기기에서 풀스크린 진입 시 GV 로고가 카메라
 * 컷아웃과 겹치는 문제가 있어, 상단 padding에 env(safe-area-inset-top)를
 * 더한다. 노치가 없는 기기/일반 브라우저 탭에서는 그 값이 0이라 기존
 * 여백(1rem)과 동일하게 렌더링된다 — 풀스크린 여부로 분기할 필요 없이
 * 항상 켜둬도 안전하다.
 */
export default function SiteHeader() {
  const isFullscreen = useIsFullscreen();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--gv-header-height",
        `${el.getBoundingClientRect().height}px`,
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-1 border-b border-gv-titanium/10 bg-gv-matte-black pb-3"
      style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
    >
      <BrandHeader />
      {isFullscreen ? (
        <FullscreenToggle />
      ) : (
        <div className="flex w-[95vw] max-w-md items-start gap-2">
          <FullscreenToggle />
          <ModeNav />
        </div>
      )}
    </div>
  );
}
