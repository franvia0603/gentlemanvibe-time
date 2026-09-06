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
 * 헤더 높이는 여전히 ResizeObserver로 측정해 `--gv-header-height` CSS
 * 변수에 반영한다(spec 6) — 모바일 햄버거 메뉴가 펼쳐지면 그만큼 헤더가
 * 높아지는 경우에도 PageShell/StaticPageShell이 항상 정확한 안전 여백을
 * 확보하도록 하기 위함이다.
 *
 * spec 3.4.1: ModeNav가 6개 탭이 되며 한 줄에 다 안 들어가는 문제가
 * 있었다 — 데스크톱/태블릿(md 이상)에서는 압축된 한 줄 탭으로, 그보다
 * 좁은 화면에서는 햄버거 메뉴로 전환해 해결했다(ModeNav 내부에서 처리).
 * 이 컨테이너는 md 이상에서 폭 제한을 풀어(md:w-auto) ModeNav가 필요한
 * 만큼 넓어질 수 있게 하고, 모바일에서는 기존 max-w-md를 유지한다.
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
        <div className="flex w-[95vw] max-w-md items-center gap-2 md:w-auto md:max-w-none">
          <FullscreenToggle />
          <ModeNav />
        </div>
      )}
    </div>
  );
}
