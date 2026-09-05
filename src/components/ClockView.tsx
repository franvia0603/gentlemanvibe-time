"use client";

import { useEffect } from "react";
import DigitalClock from "@/components/DigitalClock";
import AnalogClock from "@/components/AnalogClock";
import Button from "@/components/ui/Button";
import { useClockSettingsStore } from "@/store/useClockSettingsStore";

export default function ClockView() {
  const clockMode = useClockSettingsStore((s) => s.clockMode);
  const setClockMode = useClockSettingsStore((s) => s.setClockMode);

  useEffect(() => {
    // 마운트 후에만 저장된 설정을 복원해 SSR과의 hydration mismatch를 피한다.
    useClockSettingsStore.persist.rehydrate();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "min(70vh, 70vw, calc(100vh - 15rem))",
          height: "min(70vh, 70vw, calc(100vh - 15rem))",
        }}
      >
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
          <AnalogClock />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={() =>
            setClockMode(clockMode === "digital" ? "analog" : "digital")
          }
        >
          {clockMode === "digital" ? "Analog로 전환" : "Digital로 전환"}
        </Button>
      </div>
    </div>
  );
}
