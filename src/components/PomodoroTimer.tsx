"use client";

import { useEffect } from "react";
import PomodoroDial from "@/components/PomodoroDial";
import { usePomodoroTicker } from "@/hooks/usePomodoroTicker";
import { usePomodoroStore } from "@/store/usePomodoroStore";

function formatRemaining(totalSeconds: number) {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

type MinuteStepperProps = {
  label: string;
  minutes: number;
  disabled: boolean;
  onChange: (minutes: number) => void;
};

function MinuteStepper({
  label,
  minutes,
  disabled,
  onChange,
}: MinuteStepperProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-xs font-light tracking-wide text-gv-titanium">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(minutes - 1)}
        className="h-7 w-7 rounded-full border border-gv-titanium/30 text-gv-titanium transition-colors hover:border-gv-amber hover:text-gv-amber disabled:cursor-not-allowed disabled:opacity-30"
        aria-label={`${label} 시간 줄이기`}
      >
        −
      </button>
      <span className="w-10 text-center text-sm tabular-nums text-gv-beige">
        {minutes}분
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(minutes + 1)}
        className="h-7 w-7 rounded-full border border-gv-titanium/30 text-gv-titanium transition-colors hover:border-gv-amber hover:text-gv-amber disabled:cursor-not-allowed disabled:opacity-30"
        aria-label={`${label} 시간 늘리기`}
      >
        +
      </button>
    </div>
  );
}

export default function PomodoroTimer() {
  usePomodoroTicker();

  const mode = usePomodoroStore((s) => s.mode);
  const remainingSeconds = usePomodoroStore((s) => s.remainingSeconds);
  const isRunning = usePomodoroStore((s) => s.isRunning);
  const focusMinutes = usePomodoroStore((s) => s.focusMinutes);
  const breakMinutes = usePomodoroStore((s) => s.breakMinutes);
  const setFocusMinutes = usePomodoroStore((s) => s.setFocusMinutes);
  const setBreakMinutes = usePomodoroStore((s) => s.setBreakMinutes);
  const start = usePomodoroStore((s) => s.start);
  const pause = usePomodoroStore((s) => s.pause);
  const reset = usePomodoroStore((s) => s.reset);

  useEffect(() => {
    // 마운트 후에만 저장된 커스텀 설정을 복원해 SSR과의 hydration mismatch를 피한다.
    usePomodoroStore.persist.rehydrate();
  }, []);

  const totalDuration = (mode === "focus" ? focusMinutes : breakMinutes) * 60;
  const progress =
    totalDuration > 0 ? 1 - remainingSeconds / totalDuration : 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <span className="text-xs font-light uppercase tracking-[0.35em] text-gv-titanium">
        {mode === "focus" ? "Focus" : "Break"}
      </span>

      <div className="aspect-square w-full max-w-[380px]">
        <PomodoroDial
          progress={progress}
          remainingLabel={formatRemaining(remainingSeconds)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={isRunning ? pause : start}
          className="rounded-full border border-gv-amber/60 px-8 py-2 text-sm font-light tracking-widest text-gv-amber transition-colors hover:bg-gv-amber/10"
        >
          {isRunning ? "일시정지" : "시작"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-gv-titanium/30 px-8 py-2 text-sm font-light tracking-widest text-gv-titanium transition-colors hover:border-gv-titanium hover:text-gv-beige"
        >
          리셋
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <MinuteStepper
          label="집중"
          minutes={focusMinutes}
          disabled={isRunning}
          onChange={setFocusMinutes}
        />
        <MinuteStepper
          label="휴식"
          minutes={breakMinutes}
          disabled={isRunning}
          onChange={setBreakMinutes}
        />
      </div>
    </div>
  );
}
