"use client";

import { useEffect, useState } from "react";
import DigitalClock from "@/components/DigitalClock";
import AnalogClock from "@/components/AnalogClock";
import Button from "@/components/ui/Button";
import { useClockSettingsStore } from "@/store/useClockSettingsStore";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// "September 7 (Mon)" 형태 — 영문 월 이름 + 일 + 괄호 안 영문 요일 축약형.
function formatDateEn(date: Date) {
  return `${MONTHS_EN[date.getMonth()]} ${date.getDate()} (${WEEKDAYS_EN[date.getDay()]})`;
}

export default function ClockView() {
  const clockMode = useClockSettingsStore((s) => s.clockMode);
  const setClockMode = useClockSettingsStore((s) => s.setClockMode);
  const showDate = useClockSettingsStore((s) => s.showDate);
  const isFullscreen = useIsFullscreen();

  // 날짜는 디지털/아날로그 모드 둘 다에서 시계 위쪽에 동일하게 표시된다
  // (이전엔 DigitalClock 내부, 시계 숫자 아래에만 있었다) — 그래서 특정
  // 모드 컴포넌트가 아니라 여기 ClockView에서 직접 관리한다. 날짜는
  // 초 단위로 갱신할 필요가 없으므로(자정에만 바뀜), 시계처럼 매 프레임
  // 갱신하는 대신 가벼운 setInterval로 충분하다.
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    // 마운트 후에만 저장된 설정을 복원해 SSR과의 hydration mismatch를 피한다.
    useClockSettingsStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const update = () => setDateLabel(formatDateEn(new Date()));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full max-w-[480px] flex-col items-center gap-3">
      {!isFullscreen && showDate && dateLabel && (
        <div className="text-sm font-normal tracking-widest text-gv-titanium">
          {dateLabel}
        </div>
      )}

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

      {/* spec 3.3.1: 풀스크린 중엔 시계 자체만 남기고, 모드 전환 버튼 같은
          옵션성 컨트롤은 숨긴다. 우측 정렬 + 기존보다 큼직한 패딩/글자
          크기로 더 잘 보이게 한다(터치 타깃은 여전히 40px 이상). */}
      {!isFullscreen && (
        <div className="flex w-full justify-end">
          <Button
            size="lg"
            onClick={() =>
              setClockMode(clockMode === "digital" ? "analog" : "digital")
            }
          >
            {clockMode === "digital" ? "Analog로 전환" : "Digital로 전환"}
          </Button>
        </div>
      )}
    </div>
  );
}
