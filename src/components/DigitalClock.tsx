"use client";

import { Bebas_Neue } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { useClockSettingsStore } from "@/store/useClockSettingsStore";
import { useWeather, weatherLabel } from "@/hooks/useWeather";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400" });

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatTime(date: Date, amPm: boolean, hideSeconds: boolean) {
  let hours = date.getHours();
  let suffix = "";

  if (amPm) {
    suffix = hours >= 12 ? " PM" : " AM";
    hours = hours % 12 || 12;
  }

  const hh = String(hours).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  if (hideSeconds) {
    return `${hh}:${mm}${suffix}`;
  }

  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}${suffix}`;
}

function formatDate(date: Date) {
  const weekday = WEEKDAYS[date.getDay()];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
}

export default function DigitalClock() {
  const amPm = useClockSettingsStore((s) => s.amPm);
  const hideSeconds = useClockSettingsStore((s) => s.hideSeconds);
  const showDate = useClockSettingsStore((s) => s.showDate);
  const showWeather = useClockSettingsStore((s) => s.showWeather);

  const weather = useWeather(showWeather);

  // 서버 렌더 시각과 클라이언트 hydration 시각이 달라 값이 어긋나는 것을 막기 위해
  // 최초 렌더는 플레이스홀더로 통일하고, 마운트 후에만 실제 시간을 채운다.
  const [display, setDisplay] = useState("--:--:--");
  const [dateLabel, setDateLabel] = useState("");
  const frameRef = useRef<number | undefined>(undefined);
  const lastRef = useRef("");

  useEffect(() => {
    // 마운트 후에만 저장된 표시 설정을 복원해 SSR과의 hydration mismatch를 피한다.
    useClockSettingsStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const formatted = formatTime(now, amPm, hideSeconds);
      if (formatted !== lastRef.current) {
        lastRef.current = formatted;
        setDisplay(formatted);
        setDateLabel(formatDate(now));
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

    // amPm/hideSeconds가 바뀌면 다음 프레임에 즉시 새 포맷으로 반영되도록 초기화
    lastRef.current = "";
    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [amPm, hideSeconds]);

  return (
    <div className="flex flex-col items-center gap-3">
      {showWeather && weather && (
        <div className="text-xs font-light tracking-wide text-gv-titanium">
          {weather.temperature}°C
          {weatherLabel(weather.weatherCode) && ` · ${weatherLabel(weather.weatherCode)}`}
        </div>
      )}

      <div
        className={`${bebasNeue.className} select-none whitespace-nowrap tabular-nums tracking-widest text-gv-amber-glow ${
          hideSeconds
            ? "text-[clamp(4rem,18vw,12rem)]"
            : "text-[clamp(3.5rem,15vw,10rem)]"
        }`}
        style={{
          textShadow: "0 0 40px var(--gv-amber-glow), 0 0 90px var(--gv-amber)",
        }}
      >
        {display}
      </div>

      {showDate && dateLabel && (
        <div className="text-sm font-light tracking-widest text-gv-titanium">
          {dateLabel}
        </div>
      )}
    </div>
  );
}
