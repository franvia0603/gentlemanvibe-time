import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClockSettingsState {
  /** true면 12시간제 + 오전/오후 표시, false면 24시간제 */
  amPm: boolean;
  /** true면 초를 숨기고 시:분만 크게 표시 */
  hideSeconds: boolean;
  /** 날짜·요일 표시 여부 */
  showDate: boolean;
  /** 위치 기반 날씨 표시 여부 */
  showWeather: boolean;

  setAmPm: (value: boolean) => void;
  setHideSeconds: (value: boolean) => void;
  setShowDate: (value: boolean) => void;
  setShowWeather: (value: boolean) => void;
}

export const useClockSettingsStore = create<ClockSettingsState>()(
  persist(
    (set) => ({
      amPm: false,
      hideSeconds: false,
      showDate: false,
      showWeather: false,

      setAmPm: (value) => set({ amPm: value }),
      setHideSeconds: (value) => set({ hideSeconds: value }),
      setShowDate: (value) => set({ showDate: value }),
      setShowWeather: (value) => set({ showWeather: value }),
    }),
    {
      name: "gv-clock-display-settings",
      // 서버 렌더/최초 클라이언트 렌더가 항상 기본값으로 일치하도록,
      // localStorage 복원은 마운트 후 수동으로 트리거한다 (hydration mismatch 방지).
      skipHydration: true,
      partialize: (state) => ({
        amPm: state.amPm,
        hideSeconds: state.hideSeconds,
        showDate: state.showDate,
        showWeather: state.showWeather,
      }),
    },
  ),
);
