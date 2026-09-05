"use client";

import { useEffect, useState } from "react";

export interface WeatherSnapshot {
  temperature: number;
  weatherCode: number;
}

/** WMO 날씨 코드를 짧은 한글 라벨로 매핑 (Open-Meteo current_weather 기준) */
export function weatherLabel(code: number): string {
  if (code === 0) return "맑음";
  if (code >= 1 && code <= 3) return "구름 조금";
  if (code === 45 || code === 48) return "안개";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "비";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "눈";
  if ([95, 96, 99].includes(code)) return "뇌우";
  return "";
}

/**
 * 위치 권한이 거부되거나 API 호출이 실패하면 에러를 노출하지 않고
 * 조용히 null을 유지한다 (날씨는 부가 정보이므로).
 */
export function useWeather(enabled: boolean): WeatherSnapshot | null {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    if (!enabled) {
      setWeather(null);
      return;
    }
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        fetch(url)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (cancelled || !data?.current_weather) return;
            setWeather({
              temperature: Math.round(data.current_weather.temperature),
              weatherCode: data.current_weather.weathercode,
            });
          })
          .catch(() => {
            // 조용히 무시
          });
      },
      () => {
        // 권한 거부 등 — 조용히 숨김
      },
      { timeout: 8000 },
    );

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return weather;
}
