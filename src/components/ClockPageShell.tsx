"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import PageShell from "@/components/PageShell";
import { useMoodTone } from "@/hooks/useMoodTone";
import { useClockSettingsStore } from "@/store/useClockSettingsStore";
import { MOOD_TONE_BACKGROUND, NIGHT_AMBER_VARS } from "@/lib/moodTone";

type ClockPageShellProps = {
  children: ReactNode;
};

/**
 * spec 5.0.4 — Clock 페이지 전용 PageShell 래퍼. ClockPage(app/clock/
 * page.tsx)는 metadata를 export하는 서버 컴포넌트라 그 안에서 직접
 * useMoodTone()/zustand 훅을 쓸 수 없어서(AdBanner에서 겪은 것과 같은
 * 제약), 이 얇은 클라이언트 컴포넌트가 대신 무드톤을 계산해 PageShell에
 * 배경 스타일만 얹어 내려준다.
 *
 * 무드톤은 Clock 배경에만 적용되고 다른 도구 화면에는 영향이 없어야
 * 하므로, night 톤의 앰버 채도 상승도 전역 :root 변수를 바꾸지 않고
 * 이 <main> 엘리먼트 자신에 로컬로 재정의한다 — CSS 커스텀 프로퍼티는
 * 기본적으로 상속되므로, 이 안에 렌더링되는 ClockView/DigitalClock의
 * text-gv-amber-glow 등이 자동으로 이 로컬 값을 먼저 찾아 쓴다.
 */
export default function ClockPageShell({ children }: ClockPageShellProps) {
  const tone = useMoodTone();
  const moodToneEnabled = useClockSettingsStore((s) => s.moodToneEnabled);

  useEffect(() => {
    useClockSettingsStore.persist.rehydrate();
  }, []);

  const style: CSSProperties | undefined = moodToneEnabled
    ? ({
        backgroundColor: MOOD_TONE_BACKGROUND[tone],
        transition: "background-color 3s ease",
        ...(tone === "night" ? NIGHT_AMBER_VARS : {}),
      } as CSSProperties)
    : undefined;

  return <PageShell style={style}>{children}</PageShell>;
}
