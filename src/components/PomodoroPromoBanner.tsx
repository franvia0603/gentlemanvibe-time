"use client";

import type { SVGProps } from "react";
import PromoBannerCard from "@/components/PromoBannerCard";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * spec 3.4.4 배너① — 다른 도구 페이지(Clock/Stopwatch/Timer/World)와
 * 시간이야기 글에서, 이 사이트의 핵심 차별화 기능인 Focus(뽀모도로)로
 * 유도한다. Focus 페이지 자체에서는 쓰는 쪽(FocusPage.tsx)에서 아예
 * import하지 않는 방식으로 제외한다 — 이미 그 페이지에 있는데 자기
 * 자신을 홍보할 필요가 없기 때문.
 *
 * ShareButtons/FullscreenHint 등과 동일한 패턴으로 풀스크린 중엔
 * 스스로 숨긴다.
 */
export default function PomodoroPromoBanner() {
  const isFullscreen = useIsFullscreen();

  if (isFullscreen) {
    return null;
  }

  return (
    <PromoBannerCard
      href="/"
      ariaLabel="무료 뽀모도로 시계 바로가기 — GV Focus로 이동"
      icon={<ClockIcon className="h-5 w-5 text-gv-timer-red" />}
      iconBgClassName="bg-[#2c1416]"
      eyebrow="GV FOCUS"
      eyebrowDotClassName="bg-gv-timer-red"
      eyebrowTextClassName="text-gv-timer-red"
      title="무료 뽀모도로 시계 바로가기"
      subtitle="25분 집중, 5분 휴식. 지금 바로 시작해보세요."
      ctaLabel="시작하기 →"
      ctaClassName="bg-gv-timer-red text-[#2c1416]"
    />
  );
}
