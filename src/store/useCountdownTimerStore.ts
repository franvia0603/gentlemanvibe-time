import { create } from "zustand";
import { persist } from "zustand/middleware";
import { playCompletionTone } from "@/lib/sound";

export type CountdownOnComplete = "stop" | "repeat" | "countUp";

const DEFAULT_TOTAL_SECONDS = 3 * 60;
const MAX_TOTAL_SECONDS = 23 * 3600 + 59 * 60 + 59;
const MAX_RECENT_PRESETS = 5;

function clampTotalSeconds(seconds: number) {
  return Math.min(MAX_TOTAL_SECONDS, Math.max(1, Math.round(seconds)));
}

interface CountdownTimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  /** true면 설정 시간을 다 써서 0 이후로 계속 증가(초과 경과) 중 */
  isOverrun: boolean;
  overrunSeconds: number;
  /** 카운트다운 0 도달 시각(epoch ms) — overrun 구간에서도 기준점으로 재사용 */
  endAt: number | null;
  onComplete: CountdownOnComplete;
  title: string;
  recentPresetMinutes: number[];
  /** 완료 배너를 트리거하기 위한 카운터 (매 완료마다 증가) */
  completionCount: number;

  setTotalSeconds: (seconds: number) => void;
  setOnComplete: (value: CountdownOnComplete) => void;
  setTitle: (value: string) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: (
    remainingSeconds: number,
    isOverrun: boolean,
    overrunSeconds: number,
  ) => void;
  handleComplete: () => void;
}

export const useCountdownTimerStore = create<CountdownTimerState>()(
  persist(
    (set, get) => ({
      totalSeconds: DEFAULT_TOTAL_SECONDS,
      remainingSeconds: DEFAULT_TOTAL_SECONDS,
      isRunning: false,
      isOverrun: false,
      overrunSeconds: 0,
      endAt: null,
      onComplete: "stop",
      title: "",
      recentPresetMinutes: [],
      completionCount: 0,

      setTotalSeconds: (seconds) => {
        const totalSeconds = clampTotalSeconds(seconds);
        set((state) => {
          if (state.isRunning) return { totalSeconds };
          return {
            totalSeconds,
            remainingSeconds: totalSeconds,
            isOverrun: false,
            overrunSeconds: 0,
          };
        });
      },

      setOnComplete: (value) => set({ onComplete: value }),

      setTitle: (value) => set({ title: value.slice(0, 40) }),

      start: () => {
        const { isOverrun, remainingSeconds, totalSeconds, overrunSeconds } =
          get();
        const baseSeconds = isOverrun
          ? 0
          : remainingSeconds > 0
            ? remainingSeconds
            : totalSeconds;

        const newEndAt = isOverrun
          ? Date.now() - overrunSeconds * 1000
          : Date.now() + baseSeconds * 1000;

        set((state) => {
          const minutes = Math.max(1, Math.round(state.totalSeconds / 60));
          const recentPresetMinutes = [
            minutes,
            ...state.recentPresetMinutes.filter((m) => m !== minutes),
          ].slice(0, MAX_RECENT_PRESETS);

          return {
            isRunning: true,
            endAt: newEndAt,
            remainingSeconds: isOverrun ? 0 : baseSeconds,
            recentPresetMinutes,
          };
        });
      },

      pause: () => {
        const { endAt, isOverrun } = get();
        if (endAt === null) return;
        const now = Date.now();
        if (isOverrun) {
          set({
            isRunning: false,
            overrunSeconds: Math.max(0, Math.floor((now - endAt) / 1000)),
          });
        } else {
          set({
            isRunning: false,
            remainingSeconds: Math.max(0, Math.ceil((endAt - now) / 1000)),
          });
        }
      },

      reset: () => {
        const { totalSeconds } = get();
        set({
          isRunning: false,
          endAt: null,
          remainingSeconds: totalSeconds,
          isOverrun: false,
          overrunSeconds: 0,
        });
      },

      tick: (remainingSeconds, isOverrun, overrunSeconds) => {
        set({ remainingSeconds, isOverrun, overrunSeconds });
      },

      handleComplete: () => {
        const { onComplete, totalSeconds } = get();
        playCompletionTone();

        if (onComplete === "stop") {
          set((state) => ({
            isRunning: false,
            endAt: null,
            remainingSeconds: 0,
            isOverrun: false,
            overrunSeconds: 0,
            completionCount: state.completionCount + 1,
          }));
        } else if (onComplete === "repeat") {
          set((state) => ({
            endAt: Date.now() + totalSeconds * 1000,
            remainingSeconds: totalSeconds,
            isOverrun: false,
            overrunSeconds: 0,
            isRunning: true,
            completionCount: state.completionCount + 1,
          }));
        } else {
          set((state) => ({
            isOverrun: true,
            remainingSeconds: 0,
            overrunSeconds: 0,
            completionCount: state.completionCount + 1,
          }));
        }
      },
    }),
    {
      name: "gv-countdown-timer-settings",
      // 서버 렌더/최초 클라이언트 렌더가 항상 기본값으로 일치하도록,
      // localStorage 복원은 마운트 후 수동으로 트리거한다 (hydration mismatch 방지).
      skipHydration: true,
      partialize: (state) => ({
        totalSeconds: state.totalSeconds,
        onComplete: state.onComplete,
        recentPresetMinutes: state.recentPresetMinutes,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state || state.isRunning) return;
        useCountdownTimerStore.setState({
          remainingSeconds: state.totalSeconds,
          isOverrun: false,
          overrunSeconds: 0,
        });
      },
    },
  ),
);
