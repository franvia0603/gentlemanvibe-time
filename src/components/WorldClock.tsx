"use client";

import { useEffect, useState } from "react";
import { Bebas_Neue } from "next/font/google";
import { useNow } from "@/hooks/useNow";
import { useWorldClockStore } from "@/store/useWorldClockStore";
import { CITY_CATALOG, SEOUL_TIMEZONE, getCityInfo } from "@/lib/worldCities";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400" });

function formatCityTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

/** 주어진 시각 기준, 해당 타임존의 UTC 오프셋(분) — DST를 실제로 반영한다 */
function getUtcOffsetMinutes(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asUtc - date.getTime()) / 60000);
}

function formatOffsetLabel(diffMinutes: number) {
  if (diffMinutes === 0) return "서울과 동일";
  const sign = diffMinutes > 0 ? "+" : "-";
  const abs = Math.abs(diffMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0
    ? `오늘, ${sign}${h}시간`
    : `오늘, ${sign}${h}시간 ${m}분`;
}

type CityCardProps = {
  id: string;
  label: string;
  now: Date | null;
  removable: boolean;
  onRemove: () => void;
};

function CityCard({ id, label, now, removable, onRemove }: CityCardProps) {
  const offsetLabel = now
    ? id === SEOUL_TIMEZONE
      ? "현재 위치"
      : formatOffsetLabel(
          getUtcOffsetMinutes(now, id) - getUtcOffsetMinutes(now, SEOUL_TIMEZONE),
        )
    : "";

  return (
    <div className="relative flex flex-col gap-1 rounded-lg border border-gv-titanium/25 bg-gv-charcoal/70 p-4">
      {removable && (
        <IconButton
          onClick={onRemove}
          aria-label={`${label} 카드 삭제`}
          className="absolute right-2 top-2 h-9 w-9"
        >
          <span className="text-sm leading-none">✕</span>
        </IconButton>
      )}
      <span className="text-sm font-normal text-gv-beige">{label}</span>
      <span
        className={`${bebasNeue.className} text-3xl tabular-nums tracking-wide text-gv-amber-glow`}
      >
        {now ? formatCityTime(now, id) : "--:--:--"}
      </span>
      <span className="text-xs font-normal text-gv-titanium">
        {offsetLabel}
      </span>
    </div>
  );
}

export default function WorldClock() {
  const now = useNow();
  const isFullscreen = useIsFullscreen();
  const cityIds = useWorldClockStore((s) => s.cityIds);
  const addCity = useWorldClockStore((s) => s.addCity);
  const removeCity = useWorldClockStore((s) => s.removeCity);

  const [selectedToAdd, setSelectedToAdd] = useState("");

  useEffect(() => {
    // 마운트 후에만 저장된 도시 목록을 복원해 SSR과의 hydration mismatch를 피한다.
    useWorldClockStore.persist.rehydrate();
  }, []);

  const availableToAdd = CITY_CATALOG.filter(
    (city) => !cityIds.includes(city.id),
  );

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 md:max-w-3xl lg:max-w-5xl">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {cityIds.map((id) => {
          const info = getCityInfo(id);
          if (!info) return null;
          return (
            <CityCard
              key={id}
              id={id}
              label={info.label}
              now={now}
              removable={!isFullscreen && id !== SEOUL_TIMEZONE}
              onRemove={() => removeCity(id)}
            />
          );
        })}
      </div>

      {/* spec 3.3.1: 풀스크린 중엔 선택해둔 도시 카드만 남기고, 도시
          추가/검색 같은 편집 UI는 숨긴다. */}
      {!isFullscreen && (
        <div className="flex w-full max-w-sm flex-wrap items-center justify-center gap-2">
          {availableToAdd.length > 0 && (
            <>
              <select
                value={selectedToAdd}
                onChange={(event) => setSelectedToAdd(event.target.value)}
                aria-label="추가할 도시 선택"
                className="min-h-[44px] flex-1 rounded-md border border-gv-titanium/25 bg-gv-charcoal/70 px-3 text-sm text-gv-beige focus:text-gv-amber focus:outline-none"
              >
                <option value="">도시 추가...</option>
                {availableToAdd.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.label}
                  </option>
                ))}
              </select>
              <Button
                disabled={!selectedToAdd}
                onClick={() => {
                  if (!selectedToAdd) return;
                  addCity(selectedToAdd);
                  setSelectedToAdd("");
                }}
              >
                추가
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
