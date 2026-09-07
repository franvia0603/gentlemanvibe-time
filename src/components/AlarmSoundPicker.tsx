"use client";

import { useEffect } from "react";
import type { ButtonTone } from "@/components/ui/Button";
import Button from "@/components/ui/Button";
import { getAlarmPresetOptions, playAlarmPreset } from "@/lib/sound";
import { useSoundSettingsStore } from "@/store/useSoundSettingsStore";

type AlarmSoundPickerProps = {
  /** 페이지 강조 색(Timer=amber, Focus/Pomodoro=timer-red)에 맞춘다 */
  tone?: ButtonTone;
};

const PRESET_OPTIONS = getAlarmPresetOptions();

/**
 * 종료음 프리셋 선택 + 미리듣기(spec 7). CountdownTimer(/timer)와
 * PomodoroTimer(/pomodoro, /) 양쪽에서 공유한다 — 선택값은
 * useSoundSettingsStore를 통해 localStorage에 저장되어 두 페이지가
 * 같은 프리셋을 기억한다.
 */
export default function AlarmSoundPicker({
  tone = "amber",
}: AlarmSoundPickerProps) {
  const alarmPreset = useSoundSettingsStore((s) => s.alarmPreset);
  const setAlarmPreset = useSoundSettingsStore((s) => s.setAlarmPreset);

  useEffect(() => {
    useSoundSettingsStore.persist.rehydrate();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-normal text-gv-titanium">종료음</span>
      <div className="flex items-center gap-2">
        <select
          value={alarmPreset}
          onChange={(event) =>
            setAlarmPreset(
              event.target.value as (typeof PRESET_OPTIONS)[number]["id"],
            )
          }
          aria-label="종료음 프리셋 선택"
          className="min-h-[44px] rounded-md border border-gv-titanium/25 bg-gv-charcoal/70 px-3 text-sm text-gv-beige focus:text-gv-amber focus:outline-none"
        >
          {PRESET_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <Button
          tone={tone}
          onClick={() => playAlarmPreset(alarmPreset)}
        >
          테스트
        </Button>
      </div>
    </div>
  );
}
