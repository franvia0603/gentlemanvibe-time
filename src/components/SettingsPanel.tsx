"use client";

import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import { useClockSettingsStore } from "@/store/useClockSettingsStore";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";
import IconButton from "@/components/ui/IconButton";

function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path
        strokeLinecap="round"
        d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3"
      />
    </svg>
  );
}

type ToggleRowProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 py-2 text-left text-sm font-normal text-gv-beige"
    >
      <span>{label}</span>
      <span
        className={`relative h-4 w-8 shrink-0 rounded-full transition-colors ${
          checked ? "bg-gv-amber" : "bg-gv-titanium/30"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-gv-matte-black transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export default function SettingsPanel() {
  const isFullscreen = useIsFullscreen();
  const [open, setOpen] = useState(false);

  const amPm = useClockSettingsStore((s) => s.amPm);
  const hideSeconds = useClockSettingsStore((s) => s.hideSeconds);
  const showDate = useClockSettingsStore((s) => s.showDate);
  const showWeather = useClockSettingsStore((s) => s.showWeather);
  const setAmPm = useClockSettingsStore((s) => s.setAmPm);
  const setHideSeconds = useClockSettingsStore((s) => s.setHideSeconds);
  const setShowDate = useClockSettingsStore((s) => s.setShowDate);
  const setShowWeather = useClockSettingsStore((s) => s.setShowWeather);

  useEffect(() => {
    useClockSettingsStore.persist.rehydrate();
  }, []);

  if (isFullscreen) {
    return null;
  }

  return (
    // 모바일(spec 3.4.3): 헤더가 좌-햄버거/중앙-로고/우-풀스크린토글
    // 3분할 그리드로 바뀌면서 토글이 화면 우측 끝 구석으로 이동했다.
    // 이 톱니바퀴는 헤더 밖에서 fixed로 독립 배치되는 오버레이라
    // 고정 좌표(top-4)가 새 토글 위치(위에서 약 47px)와 어긋나
    // 겹쳐 보였다 — 모바일에서만 토글과 같은 줄에 정렬되도록 보정한다.
    // 데스크톱/태블릿은 기존 좌표를 그대로 유지한다.
    <div className="fixed right-16 top-[45px] z-50 md:right-14 md:top-4">
      <IconButton
        onClick={() => setOpen((value) => !value)}
        aria-label="클락 표시 설정"
        aria-expanded={open}
        active={open}
      >
        <GearIcon className="h-5 w-5" />
      </IconButton>

      {open && (
        <div className="absolute right-0 top-11 w-56 rounded-lg border border-gv-titanium/20 bg-gv-charcoal/95 p-3 shadow-lg">
          <ToggleRow label="오전/오후 표시" checked={amPm} onChange={setAmPm} />
          <ToggleRow
            label="시간만 표시"
            checked={hideSeconds}
            onChange={setHideSeconds}
          />
          <ToggleRow
            label="날짜·요일 표시"
            checked={showDate}
            onChange={setShowDate}
          />
          <ToggleRow
            label="날씨 표시"
            checked={showWeather}
            onChange={setShowWeather}
          />
        </div>
      )}
    </div>
  );
}
