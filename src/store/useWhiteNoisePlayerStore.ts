import { create } from "zustand";

/**
 * 백색소음의 "지금 재생 중인가" 여부는 일부러 useSoundSettingsStore(선택
 * 트랙/볼륨, localStorage에 저장)와 분리했다 — 브라우저 자동재생 정책상
 * 사용자 제스처 없이는 오디오를 자동으로 다시 시작할 수 없어서, 이
 * 값을 저장해뒀다가 새로고침 시 그대로 복원하려는 시도 자체가 의미가
 * 없다. 매 방문마다 정지 상태로 시작하고, 재생은 항상 사용자가 다시
 * 눌러야 한다.
 */
interface WhiteNoisePlayerState {
  isPlaying: boolean;
  play: () => void;
  stop: () => void;
  toggle: () => void;
}

export const useWhiteNoisePlayerStore = create<WhiteNoisePlayerState>(
  (set) => ({
    isPlaying: false,
    play: () => set({ isPlaying: true }),
    stop: () => set({ isPlaying: false }),
    toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  }),
);
