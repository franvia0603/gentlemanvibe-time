import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AlarmPresetId = "soft-bell" | "warm-analog" | "marimba";
export type WhiteNoiseTrackId = "rain" | "lofi" | "cafe";

interface SoundSettingsState {
  /** 카운트다운 타이머/뽀모도로 종료음으로 쓸 프리셋 — 두 페이지가 공유한다. */
  alarmPreset: AlarmPresetId;
  setAlarmPreset: (preset: AlarmPresetId) => void;

  /** 타이머 완료 알림음 전용 무음 토글(백색소음과는 무관). 켜져 있으면
   * 실제 완료 시점의 알림음뿐 아니라 "테스트" 미리듣기도 재생되지
   * 않는다 — 뮤트가 "이 소리 카테고리를 완전히 끈다"는 의미이므로
   * 둘 다 같은 진입점(playAlarmPreset)에서 한 번에 막는다. */
  alarmMuted: boolean;
  setAlarmMuted: (muted: boolean) => void;
  toggleAlarmMuted: () => void;

  /** 백색소음 선택 트랙과 볼륨. 실제 재생 여부(isPlaying)는 브라우저의
   * 자동재생 정책 때문에 사용자 제스처 없이 복원할 수 없어 저장하지
   * 않는다 — 트랙/볼륨만 기억해두고, 재생은 항상 사용자가 다시 눌러야
   * 시작된다. */
  whiteNoiseTrack: WhiteNoiseTrackId;
  whiteNoiseVolume: number;
  setWhiteNoiseTrack: (track: WhiteNoiseTrackId) => void;
  setWhiteNoiseVolume: (volume: number) => void;
}

export const useSoundSettingsStore = create<SoundSettingsState>()(
  persist(
    (set) => ({
      alarmPreset: "soft-bell",
      setAlarmPreset: (alarmPreset) => set({ alarmPreset }),

      alarmMuted: false,
      setAlarmMuted: (alarmMuted) => set({ alarmMuted }),
      toggleAlarmMuted: () => set((s) => ({ alarmMuted: !s.alarmMuted })),

      whiteNoiseTrack: "rain",
      whiteNoiseVolume: 0.5,
      setWhiteNoiseTrack: (whiteNoiseTrack) => set({ whiteNoiseTrack }),
      setWhiteNoiseVolume: (volume) =>
        set({ whiteNoiseVolume: Math.min(1, Math.max(0, volume)) }),
    }),
    {
      name: "gv-sound-settings",
      // 다른 zustand persist 스토어들과 동일하게, SSR과의 hydration
      // mismatch를 피하기 위해 마운트 후 수동으로 복원한다.
      skipHydration: true,
    },
  ),
);
