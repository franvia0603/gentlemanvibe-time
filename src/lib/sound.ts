/**
 * 임시 종료음 (Phase 1 플레이스홀더).
 * 실제 브랜드 시그니처 사운드는 Phase 2에서 별도 진행 (spec 5.2/6장 참고).
 * Web Audio API로 짧은 2음 비프를 생성한다 — 오디오 파일 없이 동작.
 */

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctor =
      window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

function playBeep(ctx: AudioContext, startOffset: number, freq: number) {
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = freq;

  gain.gain.setValueAtTime(0, now + startOffset);
  gain.gain.linearRampToValueAtTime(0.25, now + startOffset + 0.02);
  gain.gain.linearRampToValueAtTime(0, now + startOffset + 0.22);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now + startOffset);
  oscillator.stop(now + startOffset + 0.25);
}

/** 타이머 종료 시 재생하는 완료음 (두 번의 짧은 비프) */
export function playCompletionTone() {
  const ctx = getAudioContext();
  if (!ctx) return;
  playBeep(ctx, 0, 880);
  playBeep(ctx, 0.28, 880);
}
