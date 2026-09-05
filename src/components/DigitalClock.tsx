"use client";

import { Bebas_Neue } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400" });

function formatTime(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function DigitalClock() {
  // 서버 렌더 시각과 클라이언트 hydration 시각이 달라 값이 어긋나는 것을 막기 위해
  // 최초 렌더는 플레이스홀더로 통일하고, 마운트 후에만 실제 시간을 채운다.
  const [display, setDisplay] = useState("--:--:--");
  const frameRef = useRef<number | undefined>(undefined);
  const lastRef = useRef("");

  useEffect(() => {
    const tick = () => {
      const now = formatTime(new Date());
      if (now !== lastRef.current) {
        lastRef.current = now;
        setDisplay(now);
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
        // 백그라운드에 있는 동안 드리프트가 쌓이지 않도록 즉시 재동기화
        lastRef.current = "";
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

  return (
    <div
      className={`${bebasNeue.className} select-none whitespace-nowrap text-[clamp(3.5rem,15vw,10rem)] tabular-nums tracking-widest text-gv-amber-glow`}
      style={{
        textShadow: "0 0 40px var(--gv-amber-glow), 0 0 90px var(--gv-amber)",
      }}
    >
      {display}
    </div>
  );
}
