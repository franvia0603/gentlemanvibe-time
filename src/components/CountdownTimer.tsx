"use client";

import { useEffect, useRef, useState } from "react";
import SegmentDial from "@/components/SegmentDial";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { useCountdownTicker } from "@/hooks/useCountdownTicker";
import {
  type CountdownOnComplete,
  useCountdownTimerStore,
} from "@/store/useCountdownTimerStore";
import { playCompletionTone } from "@/lib/sound";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

type RamenPreset = {
  name: string;
  brand: string;
  seconds: number;
  timeLabel: string;
  note: string;
};

// 스펙 5.2 라면 프리셋 10종 (조리시간·비고는 봉지 뒷면 기준)
const RAMEN_PRESETS: RamenPreset[] = [
  { name: "신라면", brand: "농심", seconds: 270, timeLabel: "4분 30초", note: "물 550ml" },
  {
    name: "너구리",
    brand: "농심",
    seconds: 300,
    timeLabel: "5분",
    note: "물 550ml, 면과 스프를 같이 넣고 끓임",
  },
  { name: "안성탕면", brand: "농심", seconds: 270, timeLabel: "4분 30초", note: "물 550ml" },
  {
    name: "짜파게티",
    brand: "농심",
    seconds: 300,
    timeLabel: "5분",
    note: "물 600ml로 삶은 뒤 물 8스푼 남기고 비비기",
  },
  { name: "진라면", brand: "오뚜기", seconds: 240, timeLabel: "4분", note: "물 550ml" },
  {
    name: "참깨라면",
    brand: "오뚜기",
    seconds: 240,
    timeLabel: "4분",
    note: "물 500ml, 계란블록·유성스프는 조리 후 마지막에",
  },
  { name: "진짬뽕", brand: "오뚜기", seconds: 300, timeLabel: "5분", note: "물 500ml" },
  {
    name: "불닭볶음면",
    brand: "삼양식품",
    seconds: 300,
    timeLabel: "5분",
    note: "물 600ml로 삶은 뒤 물 8스푼 남기고 볶기",
  },
  { name: "삼양라면", brand: "삼양식품", seconds: 240, timeLabel: "4분", note: "물 550ml" },
  {
    name: "팔도비빔면",
    brand: "팔도",
    seconds: 180,
    timeLabel: "3분",
    note: "끓인 후 찬물에 헹궈 비비기",
  },
];

const ON_COMPLETE_OPTIONS: { value: CountdownOnComplete; label: string }[] = [
  { value: "stop", label: "정지" },
  { value: "repeat", label: "재시작" },
  { value: "countUp", label: "계속" },
];

function formatClock(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(clamped / 60)).padStart(2, "0");
  const ss = String(clamped % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

type UnitSpinnerProps = {
  label: string;
  value: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
};

function UnitSpinner({ label, value, max, disabled, onChange }: UnitSpinnerProps) {
  const clamp = (v: number) => Math.min(max, Math.max(0, v));

  return (
    <div className="flex flex-col items-center gap-1.5">
      <IconButton
        size="sm"
        disabled={disabled}
        onClick={() => onChange(clamp(value + 1))}
        aria-label={`${label} 늘리기`}
      >
        <span className="text-xs leading-none">▲</span>
      </IconButton>
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (!Number.isNaN(parsed)) onChange(clamp(parsed));
        }}
        aria-label={`${label} 직접 입력`}
        className="w-14 rounded-md border border-gv-titanium/25 bg-gv-charcoal/70 py-1 text-center text-lg tabular-nums text-gv-beige [appearance:textfield] focus:text-gv-amber focus:outline-none disabled:opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <IconButton
        size="sm"
        disabled={disabled}
        onClick={() => onChange(clamp(value - 1))}
        aria-label={`${label} 줄이기`}
      >
        <span className="text-xs leading-none">▼</span>
      </IconButton>
      <span className="text-xs font-normal text-gv-titanium">{label}</span>
    </div>
  );
}

type RamenPresetButtonProps = {
  preset: RamenPreset;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
};

function RamenPresetButton({
  preset,
  active,
  disabled,
  onClick,
}: RamenPresetButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-[44px] flex-col items-start justify-center gap-0.5 rounded-lg border border-gv-titanium/25 bg-gv-charcoal/70 px-3 py-2.5 text-left transition-colors hover:text-gv-amber disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "text-gv-amber" : "text-gv-beige"
      }`}
    >
      <span className="text-sm font-normal">
        {preset.name} {preset.timeLabel}
      </span>
      <span className="text-xs font-normal text-gv-titanium">
        {preset.brand}
      </span>
    </button>
  );
}

export default function CountdownTimer() {
  useCountdownTicker();
  const isFullscreen = useIsFullscreen();

  const totalSeconds = useCountdownTimerStore((s) => s.totalSeconds);
  const remainingSeconds = useCountdownTimerStore((s) => s.remainingSeconds);
  const isRunning = useCountdownTimerStore((s) => s.isRunning);
  const isOverrun = useCountdownTimerStore((s) => s.isOverrun);
  const overrunSeconds = useCountdownTimerStore((s) => s.overrunSeconds);
  const onComplete = useCountdownTimerStore((s) => s.onComplete);
  const recentPresetMinutes = useCountdownTimerStore(
    (s) => s.recentPresetMinutes,
  );
  const completionCount = useCountdownTimerStore((s) => s.completionCount);

  const setTotalSeconds = useCountdownTimerStore((s) => s.setTotalSeconds);
  const setOnComplete = useCountdownTimerStore((s) => s.setOnComplete);
  const start = useCountdownTimerStore((s) => s.start);
  const pause = useCountdownTimerStore((s) => s.pause);
  const reset = useCountdownTimerStore((s) => s.reset);

  const [showBanner, setShowBanner] = useState(false);
  const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  // "처음 마운트인지" bool 플래그 대신 마지막으로 본 completionCount 값을
  // 저장해 비교한다 — React 18 StrictMode가 개발 모드에서 이 effect를
  // 두 번 호출해도(마운트→클린업→재마운트) 값 자체는 그대로이므로 안전하다.
  const lastSeenCompletionCountRef = useRef(completionCount);

  useEffect(() => {
    // 마운트 후에만 저장된 설정을 복원해 SSR과의 hydration mismatch를 피한다.
    useCountdownTimerStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (completionCount === lastSeenCompletionCountRef.current) return;
    lastSeenCompletionCountRef.current = completionCount;

    setShowBanner(true);
    if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
    bannerTimeoutRef.current = setTimeout(() => setShowBanner(false), 4000);
    return () => {
      if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
    };
  }, [completionCount]);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  function applyHms(nextHours: number, nextMinutes: number, nextSeconds: number) {
    setTotalSeconds(nextHours * 3600 + nextMinutes * 60 + nextSeconds);
  }

  const centerLabel = isOverrun ? `+${formatClock(overrunSeconds)}` : undefined;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6 md:max-w-xl lg:max-w-3xl">
      {/* spec 3.3.1: 완료 배너도 옵션성 알림이므로 풀스크린 중엔 숨긴다 —
          중앙 다이얼의 +MM:SS 표시만으로 종료 여부를 알 수 있다. */}
      {showBanner && !isFullscreen && (
        <div className="w-full max-w-sm rounded-md border border-gv-amber/40 bg-gv-charcoal/80 px-3 py-2 text-center text-sm text-gv-amber">
          ⏰ 타이머 완료!
        </div>
      )}

      {/* 1. 다이얼 + 중앙 남은 시간 — 풀스크린 중에도 유지되는 핵심 표시 요소 */}
      <div className="aspect-square w-full max-w-[380px]">
        <SegmentDial
          totalMinutes={totalSeconds / 60}
          remainingSeconds={remainingSeconds}
          disabled={isRunning}
          onSelectMinutes={(m) => setTotalSeconds(m * 60)}
          tone="amber"
          label="카운트다운 타이머"
          centerLabel={centerLabel}
        />
      </div>

      {/* spec 3.3.1: 풀스크린 중엔 다이얼(+남은 시간)만 남기고, 시간
          설정/시작·리셋/프리셋/종료 동작 같은 옵션성 컨트롤은 전부 숨긴다. */}
      {!isFullscreen && (
        <>
          {/* 2. 시/분/초 스피너 */}
          <div className="flex flex-wrap items-start justify-center gap-4">
            <UnitSpinner
              label="시"
              value={hours}
              max={23}
              disabled={isRunning}
              onChange={(v) => applyHms(v, minutes, seconds)}
            />
            <UnitSpinner
              label="분"
              value={minutes}
              max={59}
              disabled={isRunning}
              onChange={(v) => applyHms(hours, v, seconds)}
            />
            <UnitSpinner
              label="초"
              value={seconds}
              max={59}
              disabled={isRunning}
              onChange={(v) => applyHms(hours, minutes, v)}
            />
          </div>

          {/* 3. 시작/리셋 — 시간 설정 바로 아래로 붙여 조작 동선을 짧게 */}
          <div className="flex items-center gap-4">
            <Button active onClick={isRunning ? pause : start}>
              {isRunning ? "일시정지" : "시작"}
            </Button>
            <Button onClick={reset} disabled={isRunning}>
              리셋
            </Button>
          </div>

          {/* 4. 라면 조리시간 프리셋 그리드 (+ 최근 사용) */}
          <div className="w-full">
            <p className="mb-2 text-center text-xs font-normal text-gv-titanium">
              라면 조리시간 프리셋
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {RAMEN_PRESETS.map((preset) => (
                <RamenPresetButton
                  key={preset.name}
                  preset={preset}
                  active={totalSeconds === preset.seconds}
                  disabled={isRunning}
                  onClick={() => setTotalSeconds(preset.seconds)}
                />
              ))}
            </div>

            {recentPresetMinutes.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-normal text-gv-titanium">
                  최근
                </span>
                {recentPresetMinutes.map((m) => (
                  <Button
                    key={m}
                    disabled={isRunning}
                    onClick={() => setTotalSeconds(m * 60)}
                  >
                    {m}분
                  </Button>
                ))}
              </div>
            )}

            {/* 5. 조리 팁 안내문 */}
            <p className="mt-3 text-center text-xs font-normal leading-relaxed text-gv-titanium">
              조리 팁: 봉지 뒷면에 적힌 정량의 물과 조리시간을 지키는 것이
              가장 맛있게 끓이는 비결입니다.
            </p>
          </div>

          {/* 6. 종료 시 동작 + 종료음 테스트 (부가 설정) */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-normal text-gv-titanium">
              종료 시 동작
            </span>
            <div className="flex items-center gap-2">
              {ON_COMPLETE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  active={onComplete === option.value}
                  onClick={() => setOnComplete(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={playCompletionTone}>종료음 테스트</Button>
        </>
      )}
    </div>
  );
}
