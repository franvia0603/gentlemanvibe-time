"use client";

import { useEffect, useRef } from "react";
import BrandHeader from "@/components/BrandHeader";
import ModeNav, { MobileNavMenu } from "@/components/ModeNav";
import FullscreenToggle from "@/components/FullscreenToggle";

/**
 * BrandHeader/ModeNav를 감싸는 단일 fixed 상단 바.
 * 이전에는 두 컴포넌트가 각자 fixed로 투명하게 떠 있어서, 스크롤이
 * 필요한 긴 페이지(Privacy Policy 등)에서 스크롤 중인 본문 텍스트와
 * 시각적으로 겹쳐 읽기 어려운 문제가 있었다. 배경이 있는 하나의 헤더
 * 바로 통합해 스크롤되는 콘텐츠가 그 뒤로 자연스럽게 지나가도록 한다
 * (표준적인 고정 헤더 동작).
 *
 * 풀스크린 토글의 위치는 spec 3.4.3(재수정)에서 별도로 정의한다 — 이
 * 헤더 컴포넌트가 렌더링하지만, 토글 자신이 독립적으로 화면 우측 상단에
 * fixed 배치되므로 이 헤더의 폭/높이 흐름과는 무관하다.
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
 * 여백과 동일하게 렌더링된다 — 풀스크린 여부로 분기할 필요 없이 항상
 * 켜둬도 안전하다. 실기기 검증 결과 일부 삼성 펀치홀 카메라는 브라우저가
 * 표준 세이프 에어리어로 인식하지 못해 env()가 0으로 계산되는 경우가
 * 있었다 — 그래서 env() 값과 별개로 최소 44px(버튼 하나 높이 정도)의
 * 고정 여백을 항상 더해, 세이프 에어리어 인식 여부와 무관하게 로고가
 * 화면 최상단에서 충분히 떨어지도록 보장한다. 이 여백은 헤더 컨테이너
 * 전체의 padding-top이라 풀스크린/일반 모드 양쪽에 동일하게 적용된다.
 *
 * spec 3.4.3 (재수정): 풀스크린 토글은 이제 뷰포트 크기와 무관하게
 * 항상 화면 우측 상단 구석에 있어야 한다. FullscreenToggle 컴포넌트
 * 자체가 `fixed`로 독립적인 코너 오버레이가 되었으므로, 이 헤더의
 * 그리드/flex 흐름에는 더 이상 포함시키지 않는다 — 모바일 3분할
 * 그리드의 우측 칸은 로고를 가운데 정렬시키기 위한 빈 자리로만
 * 남겨두고(실제 토글은 그 위에 겹쳐서 독립적으로 그려진다), 데스크톱/
 * 태블릿의 nav 탭 줄에서도 토글을 완전히 뺐다.
 */
export default function SiteHeader() {
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
    <>
      {/* 풀스크린 토글: 헤더 흐름 밖에서 독립적으로 우측 상단에 고정
          렌더링된다(spec 3.4.3 재수정) — 모바일/태블릿/데스크톱 모두
          이 하나의 인스턴스가 담당한다. */}
      <FullscreenToggle />

      <div
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-1 border-b border-gv-titanium/10 bg-gv-matte-black pb-3"
        style={{ paddingTop: "calc(44px + env(safe-area-inset-top))" }}
      >
        {/* 모바일 전용 3분할 헤더(spec 3.4.3): 좌-햄버거 / 중앙-로고 / 우측은
            빈 칸으로 남겨 로고를 가운데 정렬시킨다(토글은 위의 독립
            오버레이가 같은 자리에 겹쳐서 그린다). */}
        <div className="grid w-full grid-cols-3 items-center px-3 md:hidden">
          <div className="flex justify-start">
            <MobileNavMenu />
          </div>
          <div className="flex justify-center">
            <BrandHeader />
          </div>
          <div aria-hidden="true" />
        </div>

        {/* 데스크톱/태블릿: 로고 위, nav 탭 줄 아래 — 토글은 더 이상 이
            줄에 포함되지 않는다. */}
        <div className="hidden flex-col items-center gap-1 md:flex">
          <BrandHeader />
          <ModeNav />
        </div>
      </div>
    </>
  );
}
