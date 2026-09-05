"use client";

import { useEffect, useRef, useState } from "react";
import SegmentDial from "@/components/SegmentDial";
import FullscreenToggle from "@/components/FullscreenToggle";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { useCountdownTicker } from "@/hooks/useCountdownTicker";
import {
  type CountdownOnComplete,
  useCountdownTimerStore,
} from "@/store/useCountdownTimerStore";
import { playCompletionTone } from "@/lib/sound";

const PRESET_MINUTES = [1, 3, 5, 10, 15, 30];

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

export default function CountdownTimer() {
  useCountdownTicker();

  const totalSeconds = useCountdownTimerStore((s) => s.totalSeconds);
  const remainingSeconds = useCountdownTimerStore((s) => s.remainingSeconds);
  const isRunning = useCountdownTimerStore((s) => s.isRunning);
  const isOverrun = useCountdownTimerStore((s) => s.isOverrun);
  const overrunSeconds = useCountdownTimerStore((s) => s.overrunSeconds);
  const onComplete = useCountdownTimerStore((s) => s.onComplete);
  const title = useCountdownTimerStore((s) => s.title);
  const recentPresetMinutes = useCountdownTimerStore(
    (s) => s.recentPresetMinutes,
  );
  const completionCount = useCountdownTimerStore((s) => s.completionCount);

  const setTotalSeconds = useCountdownTimerStore((s) => s.setTotalSeconds);
  const setOnComplete = useCountdownTimerStore((s) => s.setOnComplete);
  const setTitle = useCountdownTimerStore((s) => s.setTitle);
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
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="제목 (선택, 예: 라면)"
        maxLength={40}
        className="w-full rounded-md border border-gv-titanium/25 bg-gv-charcoal/70 px-3 py-2 text-center text-sm text-gv-beige placeholder:text-gv-titanium focus:text-gv-amber focus:outline-none"
      />

      {showBanner && (
        <div className="w-full rounded-md border border-gv-amber/40 bg-gv-charcoal/80 px-3 py-2 text-center text-sm text-gv-amber">
          ⏰ {title || "타이머"} 완료!
        </div>
      )}

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

      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESET_MINUTES.map((m) => (
          <Button
            key={m}
            disabled={isRunning}
            onClick={() => setTotalSeconds(m * 60)}
          >
            {m}분
          </Button>
        ))}
      </div>

      {recentPresetMinutes.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-normal text-gv-titanium">최근</span>
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

      <div className="flex items-center gap-4">
        <Button active onClick={isRunning ? pause : start}>
          {isRunning ? "일시정지" : "시작"}
        </Button>
        <Button onClick={reset} disabled={isRunning}>
          리셋
        </Button>
        <FullscreenToggle tone="amber" />
      </div>
    </div>
  );
}
