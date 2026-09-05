"use client";

import { useEffect, useRef } from "react";
import { usePomodoroStore } from "@/store/usePomodoroStore";

/**
 * setInterval 드리프트를 피하기 위해 절대 종료 시각(endAt)을 기준으로
 * 매 프레임 남은 시간을 역산한다 (디지털 클락과 동일한 접근).
 * 표시상의 "초"가 바뀔 때만 스토어를 갱신해 불필요한 리렌더를 막는다.
 */
export function usePomodoroTicker() {
  const frameRef = useRef<number | undefined>(undefined);
  const lastSecondRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      const { isRunning, endAt, tick, completeSession } =
        usePomodoroStore.getState();

      if (isRunning && endAt !== null) {
        const remainingMs = endAt - Date.now();
        const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

        if (remainingSeconds !== lastSecondRef.current) {
          lastSecondRef.current = remainingSeconds;
          tick(remainingSeconds);
        }

        if (remainingMs <= 0) {
          lastSecondRef.current = null;
          completeSession();
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frameRef.current === undefined) {
        frameRef.current = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // endAt은 절대 시각이라 드리프트가 없지만, 화면 복귀 시 즉시 재계산되도록 트리거
        lastSecondRef.current = null;
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
