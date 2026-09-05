"use client";

import { useEffect } from "react";
import DigitalClock from "@/components/DigitalClock";
import AnalogClock from "@/components/AnalogClock";
import { useClockSettingsStore } from "@/store/useClockSettingsStore";

export default function ClockView() {
  const clockMode = useClockSettingsStore((s) => s.clockMode);
  const setClockMode = useClockSettingsStore((s) => s.setClockMode);

  useEffect(() => {
    // 마운트 후에만 저장된 설정을 복원해 SSR과의 hydration mismatch를 피한다.
    useClockSettingsStore.persist.rehydrate();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex min-h-[280px] w-full items-center justify-center">
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
            clockMode === "digital"
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <DigitalClock />
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
            clockMode === "analog"
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="aspect-square h-full max-h-[280px] w-full max-w-[280px]">
            <AnalogClock />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setClockMode(clockMode === "digital" ? "analog" : "digital")
        }
        className="rounded-full border border-gv-titanium/30 px-6 py-1.5 text-xs font-light tracking-widest text-gv-titanium transition-colors hover:border-gv-amber hover:text-gv-amber"
      >
        {clockMode === "digital" ? "Analog로 전환" : "Digital로 전환"}
      </button>
    </div>
  );
}
