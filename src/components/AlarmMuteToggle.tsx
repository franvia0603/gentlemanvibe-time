"use client";

import { useEffect } from "react";
import type { SVGProps } from "react";
import type { ButtonTone } from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { useSoundSettingsStore } from "@/store/useSoundSettingsStore";

function SpeakerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M4 9.5h3.2L11 6v12l-3.8-3.5H4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8.2a5 5 0 0 1 0 7.6M17.6 5.8a8.5 8.5 0 0 1 0 12.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerMutedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M4 9.5h3.2L11 6v12l-3.8-3.5H4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.5 9.5 20 14M20 9.5l-4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

type AlarmMuteToggleProps = {
  tone?: ButtonTone;
};

/**
 * 타이머 완료 알림음 전용 무음 토글 — 설정 드롭다운 안에 숨기지 않고,
 * 다이얼/시작·리셋 버튼 바로 옆에 항상 보이는 아이콘 버튼으로 둔다
 * (백색소음 재생과는 별개 상태). 켜짐/꺼짐이 스피커 아이콘 자체로
 * 시각적으로 구분되고, 상태는 useSoundSettingsStore를 통해
 * localStorage에 저장되어 다음 방문에도 유지된다. IconButton의 기본
 * 크기(size="md" = 44px, size="sm" = 40px)는 이미 spec 5.0.1의 터치
 * 타깃 최소 40px 기준을 만족한다.
 */
export default function AlarmMuteToggle({
  tone = "amber",
}: AlarmMuteToggleProps) {
  const alarmMuted = useSoundSettingsStore((s) => s.alarmMuted);
  const toggleAlarmMuted = useSoundSettingsStore((s) => s.toggleAlarmMuted);

  useEffect(() => {
    useSoundSettingsStore.persist.rehydrate();
  }, []);

  return (
    <IconButton
      size="sm"
      tone={tone}
      active={alarmMuted}
      onClick={toggleAlarmMuted}
      aria-label={alarmMuted ? "종료음 음소거 해제" : "종료음 음소거"}
      aria-pressed={alarmMuted}
    >
      {alarmMuted ? (
        <SpeakerMutedIcon className="h-5 w-5" />
      ) : (
        <SpeakerIcon className="h-5 w-5" />
      )}
    </IconButton>
  );
}
