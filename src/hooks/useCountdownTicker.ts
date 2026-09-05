"use client";

import { useEffect, useRef } from "react";
import { useCountdownTimerStore } from "@/store/useCountdownTimerStore";

/**
 * endAt(카운트다운 0 도달 시각)을 기준으로 매 프레임 남은/초과 시간을
 * 역산한다 (디지털 클락/뽀모도로와 동일한 드리프트 없는 접근).
 * Page Visibility API로 백그라운드 시 정지, 복귀 시 즉시 재동기화.
 */
export function useCountdownTicker() {
  const frameRef = useRef<number | undefined>(undefined);
  const lastRemainingRef = useRef<number | null>(null);
  const lastOverrunRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      const { isRunning, endAt, isOverrun, tick, handleComplete } =
        useCountdownTimerStore.getState();

      if (isRunning && endAt !== null) {
        const now = Date.now();

        if (!isOverrun) {
          const remainingMs = endAt - now;
          const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

          if (remainingSeconds !== lastRemainingRef.current) {
            lastRemainingRef.current = remainingSeconds;
            tick(remainingSeconds, false, 0);
          }

          if (remainingMs <= 0) {
            lastRemainingRef.current = null;
            lastOverrunRef.current = null;
            handleComplete();
          }
        } else {
          const overrunSeconds = Math.max(0, Math.floor((now - endAt) / 1000));
          if (overrunSeconds !== lastOverrunRef.current) {
            lastOverrunRef.current = overrunSeconds;
            tick(0, true, overrunSeconds);
          }
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
        lastRemainingRef.current = null;
        lastOverrunRef.current = null;
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
