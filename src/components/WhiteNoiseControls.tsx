"use client";

import { useEffect } from "react";
import type { ButtonTone } from "@/components/ui/Button";
import Button from "@/components/ui/Button";
import {
  useSoundSettingsStore,
  type WhiteNoiseTrackId,
} from "@/store/useSoundSettingsStore";
import { useWhiteNoisePlayerStore } from "@/store/useWhiteNoisePlayerStore";

const TRACK_OPTIONS: { id: WhiteNoiseTrackId; label: string }[] = [
  { id: "rain", label: "빗소리" },
  { id: "lofi", label: "로파이 비트" },
  { id: "cafe", label: "카페 앰비언스" },
];

type WhiteNoiseControlsProps = {
  tone?: ButtonTone;
};

/**
 * 백색소음 컨트롤 UI(spec 7) — 실제 재생은 RootLayout에 마운트된
 * WhiteNoiseEngine이 담당하고, 이 컴포넌트는 트랙 선택/재생·정지/볼륨
 * 조절만 다룬다. 트랙·볼륨 선택은 useSoundSettingsStore를 통해
 * localStorage에 저장되어 다음 방문에도 유지된다(재생 여부 자체는
 * 브라우저 자동재생 정책 때문에 저장하지 않는다 — 항상 정지 상태로
 * 시작).
 */
export default function WhiteNoiseControls({
  tone = "amber",
}: WhiteNoiseControlsProps) {
  const track = useSoundSettingsStore((s) => s.whiteNoiseTrack);
  const volume = useSoundSettingsStore((s) => s.whiteNoiseVolume);
  const setTrack = useSoundSettingsStore((s) => s.setWhiteNoiseTrack);
  const setVolume = useSoundSettingsStore((s) => s.setWhiteNoiseVolume);
  const isPlaying = useWhiteNoisePlayerStore((s) => s.isPlaying);
  const toggle = useWhiteNoisePlayerStore((s) => s.toggle);

  useEffect(() => {
    useSoundSettingsStore.persist.rehydrate();
  }, []);

  return (
    <section className="flex w-full max-w-sm flex-col items-center gap-3 rounded-lg border border-gv-titanium/25 bg-gv-charcoal/70 px-4 py-4">
      <h2 className="text-xs font-normal uppercase tracking-wide text-gv-titanium">
        백색소음
      </h2>

      <div className="flex w-full items-center gap-2">
        <select
          value={track}
          onChange={(event) =>
            setTrack(event.target.value as WhiteNoiseTrackId)
          }
          aria-label="백색소음 트랙 선택"
          className="min-h-[44px] flex-1 rounded-md border border-gv-titanium/25 bg-gv-matte-black/60 px-3 text-sm text-gv-beige focus:text-gv-amber focus:outline-none"
        >
          {TRACK_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <Button tone={tone} active={isPlaying} onClick={toggle}>
          {isPlaying ? "정지" : "재생"}
        </Button>
      </div>

      <div className="flex w-full items-center gap-3">
        <span className="text-xs font-normal text-gv-titanium">볼륨</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="백색소음 볼륨"
          className="h-[44px] flex-1 accent-gv-amber"
        />
      </div>
    </section>
  );
}
