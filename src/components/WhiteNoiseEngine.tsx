"use client";

import { useEffect, useRef } from "react";
import {
  useSoundSettingsStore,
  type WhiteNoiseTrackId,
} from "@/store/useSoundSettingsStore";
import { useWhiteNoisePlayerStore } from "@/store/useWhiteNoisePlayerStore";

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

/**
 * 출처(spec 7 — 백색소음은 Freesound.org의 CC0 필드 레코딩에서 선별):
 * - rain.mp3: "Rain Slowly Passing TREATED LOOP_Edgewater_06192020.wav"
 *   by speakwithanimals — https://freesound.org/people/speakwithanimals/sounds/525046/
 * - lofi.mp3: "Compressed Lofi Loop" by Seth_Makes_Sounds —
 *   https://freesound.org/people/Seth_Makes_Sounds/sounds/666722/
 * - cafe.mp3: "People talking at cafe ambience" by priesjensen —
 *   https://freesound.org/people/priesjensen/sounds/482990/
 * 셋 다 Creative Commons 0 라이선스(저작자 표시 불필요, 상업적 사용
 * 포함 자유 이용 가능) — 파일 자체는 각 사운드 페이지의 -hq 프리뷰
 * mp3에서 받았다(원본 WAV는 로그인 없이 받을 수 없어서). 자세한 내용은
 * public/sounds/SOURCES.md 참고.
 */
const TRACK_SRC: Record<WhiteNoiseTrackId, string> = {
  rain: "/sounds/rain.mp3",
  lofi: "/sounds/lofi.mp3",
  cafe: "/sounds/cafe.mp3",
};

const FADE_SECONDS = 1.5;

/**
 * 백색소음 재생을 담당하는 headless 엔진. RootLayout에 한 번만
 * 마운트되어 페이지를 이동해도(예: Clock ↔ Focus) 재생이 끊기지 않고
 * 유지된다 — 오디오 엘리먼트와 AudioContext 그래프를 컴포넌트가
 * 리마운트되어도 살아있도록 ref(모듈 스코프가 아닌 컴포넌트 스코프지만,
 * RootLayout은 SPA 세션 동안 언마운트되지 않으므로 사실상 전역과
 * 동일하게 동작한다)에 보관한다.
 *
 * <audio> 엘리먼트를 MediaElementAudioSourceNode로 Web Audio 그래프에
 * 연결해 GainNode로 페이드인/아웃을 건다(spec 7: "Web Audio API로
 * 페이드인/아웃 적용"). 오디오 자체는 <audio> 엘리먼트가 스트리밍
 * 재생하므로, rain.mp3(약 19MB) 전체를 decodeAudioData로 메모리에
 * 올리지 않아도 된다.
 */
export default function WhiteNoiseEngine() {
  const track = useSoundSettingsStore((s) => s.whiteNoiseTrack);
  const volume = useSoundSettingsStore((s) => s.whiteNoiseVolume);
  const isPlaying = useWhiteNoisePlayerStore((s) => s.isPlaying);

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    useSoundSettingsStore.persist.rehydrate();
  }, []);

  function ensureGraph() {
    if (!audioElRef.current) {
      const el = new Audio();
      el.loop = true;
      el.preload = "auto";
      audioElRef.current = el;
    }
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext || (window as WebkitWindow).webkitAudioContext;
      if (!Ctor) return;
      ctxRef.current = new Ctor();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    if (!sourceRef.current) {
      sourceRef.current = ctx.createMediaElementSource(audioElRef.current);
      const gain = ctx.createGain();
      gain.gain.value = 0;
      sourceRef.current.connect(gain);
      gain.connect(ctx.destination);
      gainRef.current = gain;
    }
  }

  // 트랙 변경: 재생 중이었다면 새 트랙으로 즉시 갈아끼운다(볼륨 유지,
  // 페이드 없이 — 트랙을 고르는 행위 자체가 이미 명시적인 사용자
  // 조작이라 다시 페이드인할 필요는 없다).
  useEffect(() => {
    const el = audioElRef.current;
    if (!el) return;
    const wasPlaying = !el.paused;
    el.src = TRACK_SRC[track];
    if (wasPlaying) {
      el.currentTime = 0;
      void el.play();
    }
  }, [track]);

  // 볼륨 슬라이더: 재생 중일 때만 목표 gain을 부드럽게 갱신한다.
  useEffect(() => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!isPlaying || !ctx || !gain) return;
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.15);
  }, [volume, isPlaying]);

  // 재생/정지 토글: Web Audio GainNode로 페이드인/아웃(spec 7).
  useEffect(() => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = undefined;
    }

    if (isPlaying) {
      ensureGraph();
      const el = audioElRef.current;
      const ctx = ctxRef.current;
      const gain = gainRef.current;
      if (!el || !ctx || !gain) return;
      if (!el.src) el.src = TRACK_SRC[track];

      void el.play();
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(volume, now + FADE_SECONDS);
    } else {
      const el = audioElRef.current;
      const ctx = ctxRef.current;
      const gain = gainRef.current;
      if (!el || !ctx || !gain) return;

      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
      stopTimeoutRef.current = setTimeout(() => {
        el.pause();
      }, FADE_SECONDS * 1000 + 100);
    }

    return () => {
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return null;
}
