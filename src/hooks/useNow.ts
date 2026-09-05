"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 현재 시각을 1초 단위로 갱신해 반환한다. rAF 기반이라 setInterval
 * 드리프트가 없고, Page Visibility API로 백그라운드 시 정지·복귀 시
 * 즉시 재동기화된다 (디지털 클락과 동일한 패턴).
 * 서버 렌더와 최초 클라이언트 렌더가 항상 일치하도록 마운트 전에는 null.
 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const lastSecondRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const current = new Date();
      const second = Math.floor(current.getTime() / 1000);
      if (second !== lastSecondRef.current) {
        lastSecondRef.current = second;
        setNow(current);
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameRef.current === undefined) {
        frameRef.current = requestAnimationFrame(tick);
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

  return now;
}
