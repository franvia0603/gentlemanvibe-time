"use client";

import { useEffect } from "react";
import SegmentDial from "@/components/SegmentDial";
import FullscreenToggle from "@/components/FullscreenToggle";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { usePomodoroTicker } from "@/hooks/usePomodoroTicker";
import { usePomodoroStore } from "@/store/usePomodoroStore";

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
      <span className="w-12 text-sm font-normal tracking-wide text-gv-beige">
        {label}
      </span>
      <IconButton
        tone="timer-red"
        disabled={disabled}
        onClick={() => onChange(minutes - 1)}
        aria-label={`${label} 시간 줄이기`}
      >
        <span className="text-lg leading-none">−</span>
      </IconButton>
      <input
        type="number"
        min={1}
        max={90}
        value={minutes}
        disabled={disabled}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (!Number.isNaN(parsed)) onChange(parsed);
        }}
        aria-label={`${label} 시간(분) 직접 입력`}
        className="w-14 rounded-md border border-gv-titanium/25 bg-gv-charcoal/70 py-1 text-center text-base tabular-nums text-gv-beige [appearance:textfield] focus:text-gv-timer-red focus:outline-none disabled:opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span className="text-sm font-normal text-gv-beige">분</span>
      <IconButton
        tone="timer-red"
        disabled={disabled}
        onClick={() => onChange(minutes + 1)}
        aria-label={`${label} 시간 늘리기`}
      >
        <span className="text-lg leading-none">+</span>
      </IconButton>
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

  const totalMinutes = mode === "focus" ? focusMinutes : breakMinutes;
  const setActiveMinutes = mode === "focus" ? setFocusMinutes : setBreakMinutes;

  return (
    <div className="flex flex-col items-center gap-8">
      <span className="text-sm font-normal uppercase tracking-[0.35em] text-gv-titanium">
        {mode === "focus" ? "Focus" : "Break"}
      </span>

      <div className="aspect-square w-full max-w-[380px]">
        <SegmentDial
          totalMinutes={totalMinutes}
          remainingSeconds={remainingSeconds}
          disabled={isRunning}
          onSelectMinutes={setActiveMinutes}
          tone="timer-red"
          label="뽀모도로 타이머"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button tone="timer-red" active onClick={isRunning ? pause : start}>
          {isRunning ? "일시정지" : "시작"}
        </Button>
        <Button tone="timer-red" onClick={reset}>
          리셋
        </Button>
        <FullscreenToggle tone="timer-red" />
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
