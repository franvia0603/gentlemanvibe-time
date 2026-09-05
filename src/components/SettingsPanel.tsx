"use client";

import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import { useClockSettingsStore } from "@/store/useClockSettingsStore";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

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
      className="flex w-full items-center justify-between gap-4 py-1.5 text-left text-xs font-light text-gv-beige"
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
    <div className="fixed right-14 top-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="클락 표시 설정"
        aria-expanded={open}
        className="flex h-7 w-7 items-center justify-center rounded-full text-gv-titanium/60 transition-colors hover:text-gv-titanium"
      >
        <GearIcon className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-48 rounded-lg border border-gv-titanium/20 bg-gv-charcoal/95 p-3 shadow-lg">
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
