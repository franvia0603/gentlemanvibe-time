"use client";

import { useEffect, useState } from "react";
import { getMoodTone, type MoodTone } from "@/lib/moodTone";

/**
 * 현재 시각 기준 무드톤 단계(아침/오후/밤)를 추적한다. 날짜 표시와
 * 마찬가지로 정각 경계에서만 바뀌는 값이라 매 프레임 갱신할 필요가
 * 없어 가벼운 setInterval로 충분하다(ClockView의 날짜 갱신과 동일한
 * 패턴). 서버 렌더와 클라이언트 첫 렌더가 항상 "afternoon"으로
 * 일치하도록 초기값을 고정해 hydration mismatch를 피하고, 마운트 후
 * 실제 시각으로 갱신한다.
 */
export function useMoodTone(): MoodTone {
  const [tone, setTone] = useState<MoodTone>("afternoon");

  useEffect(() => {
    const update = () => setTone(getMoodTone(new Date()));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return tone;
}
