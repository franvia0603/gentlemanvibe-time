import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PomodoroMode = "focus" | "break";

const DEFAULT_FOCUS_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const MIN_MINUTES = 1;
const MAX_MINUTES = 90;

function clampMinutes(minutes: number) {
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(minutes)));
}

function durationSeconds(
  mode: PomodoroMode,
  focusMinutes: number,
  breakMinutes: number,
) {
  return (mode === "focus" ? focusMinutes : breakMinutes) * 60;
}

interface PomodoroState {
  focusMinutes: number;
  breakMinutes: number;
  mode: PomodoroMode;
  remainingSeconds: number;
  isRunning: boolean;
  /** 실행 중일 때만 유효한, 세션 종료 시각(epoch ms) — rAF 루프가 여기서 남은 시간을 역산한다 */
  endAt: number | null;

  setFocusMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: (remainingSeconds: number) => void;
  completeSession: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      focusMinutes: DEFAULT_FOCUS_MINUTES,
      breakMinutes: DEFAULT_BREAK_MINUTES,
      mode: "focus",
      remainingSeconds: DEFAULT_FOCUS_MINUTES * 60,
      isRunning: false,
      endAt: null,

      setFocusMinutes: (minutes) => {
        const focusMinutes = clampMinutes(minutes);
        set((state) => {
          if (state.isRunning || state.mode !== "focus") {
            return { focusMinutes };
          }
          return { focusMinutes, remainingSeconds: focusMinutes * 60 };
        });
      },

      setBreakMinutes: (minutes) => {
        const breakMinutes = clampMinutes(minutes);
        set((state) => {
          if (state.isRunning || state.mode !== "break") {
            return { breakMinutes };
          }
          return { breakMinutes, remainingSeconds: breakMinutes * 60 };
        });
      },

      start: () => {
        const { remainingSeconds } = get();
        if (remainingSeconds <= 0) return;
        set({ isRunning: true, endAt: Date.now() + remainingSeconds * 1000 });
      },

      pause: () => {
        set({ isRunning: false, endAt: null });
      },

      reset: () => {
        const { mode, focusMinutes, breakMinutes } = get();
        set({
          isRunning: false,
          endAt: null,
          remainingSeconds: durationSeconds(mode, focusMinutes, breakMinutes),
        });
      },

      tick: (remainingSeconds) => {
        set({ remainingSeconds: Math.max(0, remainingSeconds) });
      },

      completeSession: () => {
        const { mode, focusMinutes, breakMinutes } = get();
        const nextMode: PomodoroMode = mode === "focus" ? "break" : "focus";
        const nextDuration = durationSeconds(
          nextMode,
          focusMinutes,
          breakMinutes,
        );
        set({
          mode: nextMode,
          remainingSeconds: nextDuration,
          endAt: Date.now() + nextDuration * 1000,
          isRunning: true,
        });
      },
    }),
    {
      name: "gv-pomodoro-settings",
      // 서버 렌더/최초 클라이언트 렌더가 항상 기본값으로 일치하도록,
      // localStorage 복원은 마운트 후 수동으로 트리거한다 (hydration mismatch 방지).
      skipHydration: true,
      partialize: (state) => ({
        focusMinutes: state.focusMinutes,
        breakMinutes: state.breakMinutes,
      }),
      // 복원된 focusMinutes/breakMinutes와 remainingSeconds가 어긋나지 않도록,
      // 하이드레이션 직후(실행 중이 아닐 때만) 남은 시간을 다시 계산한다.
      onRehydrateStorage: () => (state) => {
        if (!state || state.isRunning) return;
        usePomodoroStore.setState({
          remainingSeconds: durationSeconds(
            state.mode,
            state.focusMinutes,
            state.breakMinutes,
          ),
        });
      },
    },
  ),
);
