"use client";

import { useEffect, useRef, useState } from "react";

export interface LapRecord {
  id: number;
  /** 시작부터 이 랩까지의 누적 시간(ms) */
  totalMs: number;
  /** 직전 랩과의 구간 시간(ms) */
  lapMs: number;
}

export function formatStopwatch(ms: number) {
  const totalMs = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const millis = totalMs % 1000;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(
    millis,
  ).padStart(3, "0")}`;
}

/**
 * 절대 시작 시각(Date.now()) 기준으로 매 프레임 경과 시간을 역산해
 * setInterval 드리프트를 피한다 (디지털 클락/뽀모도로와 동일한 접근).
 * Page Visibility API로 백그라운드에서는 rAF를 멈추고, 복귀 시 즉시
 * 재계산되므로 실제 경과 시간과 항상 정확히 일치한다.
 */
export function useStopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  const accumulatedRef = useRef(0);
  const startTimestampRef = useRef<number | null>(null);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const tick = () => {
      if (startTimestampRef.current !== null) {
        setElapsedMs(
          accumulatedRef.current + (Date.now() - startTimestampRef.current),
        );
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (frameRef.current === undefined) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (startTimestampRef.current !== null) {
          setElapsedMs(
            accumulatedRef.current + (Date.now() - startTimestampRef.current),
          );
        }
        startLoop();
      } else {
        stopLoop();
      }
    };

    startLoop();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopLoop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  function start() {
    if (startTimestampRef.current !== null) return;
    startTimestampRef.current = Date.now();
    setIsRunning(true);
  }

  function pause() {
    if (startTimestampRef.current === null) return;
    accumulatedRef.current += Date.now() - startTimestampRef.current;
    startTimestampRef.current = null;
    setElapsedMs(accumulatedRef.current);
    setIsRunning(false);
  }

  function reset() {
    accumulatedRef.current = 0;
    startTimestampRef.current = null;
    setElapsedMs(0);
    setIsRunning(false);
    setLaps([]);
  }

  function lap() {
    const current =
      startTimestampRef.current !== null
        ? accumulatedRef.current + (Date.now() - startTimestampRef.current)
        : accumulatedRef.current;

    setLaps((prev) => {
      // 업데이터는 순수해야 한다 (React StrictMode가 개발 모드에서 두 번
      // 호출하는데, ref를 여기서 직접 mutate하면 두 번 증가해버린다) —
      // id는 이전 상태만으로 결정한다.
      const previousTotal = prev.length > 0 ? prev[prev.length - 1].totalMs : 0;
      return [
        ...prev,
        {
          id: prev.length + 1,
          totalMs: current,
          lapMs: current - previousTotal,
        },
      ];
    });
  }

  return { elapsedMs, isRunning, laps, start, pause, reset, lap };
}
