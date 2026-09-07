/**
 * 브랜드 시그니처 종료음 3종 (spec 7). 전부 오디오 파일 없이 Web
 * Audio API의 oscillator + envelope(ADSR)로 그 자리에서 합성한다 —
 * 기성 무료 라이브러리의 전형적인 "띵동/삐삐" 비프음을 배제하고,
 * 은은하고 특별한 느낌을 내는 것이 목표다.
 */
import { useSoundSettingsStore, type AlarmPresetId } from "@/store/useSoundSettingsStore";

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let audioContext: AudioContext | null = null;
let reverbImpulse: AudioBuffer | null = null;

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

/**
 * ConvolverNode용 임펄스 응답을 화이트 노이즈를 지수적으로 감쇠시켜
 * 그 자리에서 합성한다 — 실제 공간을 녹음한 IR 파일 없이도 "은은한
 * 리버브 느낌"을 낼 수 있는 흔한 기법이다. 프리셋마다 새로 만들 필요
 * 없이 한 번 만들어 재사용한다.
 */
function getReverbImpulse(ctx: AudioContext): AudioBuffer {
  if (reverbImpulse) return reverbImpulse;
  const duration = 2.2;
  const decay = 3.2;
  const length = Math.floor(ctx.sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  reverbImpulse = impulse;
  return impulse;
}

/** 감쇠(decay)형 엔벨로프 하나를 만들어 gain 노드에 적용한다(ADSR의 A/D/R). */
function applyEnvelope(
  gain: GainNode,
  ctx: AudioContext,
  {
    startTime,
    peak,
    attack,
    decayTo,
    decayTime,
    releaseTime,
  }: {
    startTime: number;
    peak: number;
    attack: number;
    /** decay 단계가 끝난 뒤 유지할 레벨(0에 가까울수록 짧게 끊기는 느낌) */
    decayTo: number;
    decayTime: number;
    releaseTime: number;
  },
) {
  const g = gain.gain;
  g.cancelScheduledValues(startTime);
  g.setValueAtTime(0, startTime);
  g.linearRampToValueAtTime(peak, startTime + attack);
  g.exponentialRampToValueAtTime(
    Math.max(decayTo, 0.0001),
    startTime + attack + decayTime,
  );
  g.exponentialRampToValueAtTime(
    0.0001,
    startTime + attack + decayTime + releaseTime,
  );
}

/**
 * a) 소프트 벨 — 순수 사인파 기반, 종처럼 살짝 어긋난(inharmonic)
 * 배음 2개를 얹고, 프로그래밍으로 합성한 리버브를 은은하게 섞어
 * 긴 잔향으로 감쇠한다.
 */
function playSoftBell(ctx: AudioContext) {
  const now = ctx.currentTime;
  const fundamental = 587; // D5 — 종소리 특유의 밝지만 자극적이지 않은 음역
  const partials = [
    { ratio: 1, gain: 0.5 },
    { ratio: 2.4, gain: 0.18 }, // 종 특유의 비화성 배음
    { ratio: 3.1, gain: 0.09 },
  ];

  const dry = ctx.createGain();
  dry.gain.value = 0.7;
  dry.connect(ctx.destination);

  const convolver = ctx.createConvolver();
  convolver.buffer = getReverbImpulse(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  convolver.connect(wet);
  wet.connect(ctx.destination);

  for (const { ratio, gain: partialGain } of partials) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = fundamental * ratio;
    applyEnvelope(gain, ctx, {
      startTime: now,
      peak: partialGain,
      attack: 0.015,
      decayTo: partialGain * 0.4,
      decayTime: 0.4,
      releaseTime: 2.6,
    });
    osc.connect(gain);
    gain.connect(dry);
    gain.connect(convolver);
    osc.start(now);
    osc.stop(now + 3.2);
  }
}

/**
 * b) 웜 아날로그 — 살짝 디튠된 두 오실레이터 + 한 옥타브 아래 서브
 * 오실레이터를 겹치고, 로우패스 필터로 고음을 깎아 아날로그 신스
 * 특유의 따뜻한 톤을 낸다.
 */
function playWarmAnalog(ctx: AudioContext) {
  const now = ctx.currentTime;
  const fundamental = 440; // A4

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.7;
  filter.connect(ctx.destination);

  const voices = [
    { detuneCents: 0, ratio: 1, gain: 0.28 },
    { detuneCents: 8, ratio: 1, gain: 0.22 },
    { detuneCents: -6, ratio: 0.5, gain: 0.22 }, // 서브 옥타브로 따뜻함 보강
  ];

  for (const { detuneCents, ratio, gain: voiceGain } of voices) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = fundamental * ratio;
    osc.detune.value = detuneCents;
    applyEnvelope(gain, ctx, {
      startTime: now,
      peak: voiceGain,
      attack: 0.03,
      decayTo: voiceGain * 0.55,
      decayTime: 0.35,
      releaseTime: 1.1,
    });
    osc.connect(gain);
    gain.connect(filter);
    osc.start(now);
    osc.stop(now + 1.6);
  }
}

/**
 * c) 마림바 — 빠른 어택과 짧은 감쇠로 타격감을 낸다. 실로폰/마림바
 * 특유의 배음비(약 4배음)를 살짝 얹고, 2음(3도 위) 모티프로 쳐서
 * 한 번의 단순 비프보다 더 또렷한 완료 신호로 들리게 한다.
 */
function playMarimbaNote(ctx: AudioContext, startTime: number, freq: number) {
  const fundamental = ctx.createOscillator();
  const fundamentalGain = ctx.createGain();
  fundamental.type = "sine";
  fundamental.frequency.value = freq;
  applyEnvelope(fundamentalGain, ctx, {
    startTime,
    peak: 0.5,
    attack: 0.002,
    decayTo: 0.08,
    decayTime: 0.18,
    releaseTime: 0.22,
  });
  fundamental.connect(fundamentalGain);
  fundamentalGain.connect(ctx.destination);
  fundamental.start(startTime);
  fundamental.stop(startTime + 0.45);

  const partial = ctx.createOscillator();
  const partialGain = ctx.createGain();
  partial.type = "sine";
  partial.frequency.value = freq * 4.05; // 마림바 특유의 비화성 배음
  applyEnvelope(partialGain, ctx, {
    startTime,
    peak: 0.14,
    attack: 0.001,
    decayTo: 0.02,
    decayTime: 0.06,
    releaseTime: 0.08,
  });
  partial.connect(partialGain);
  partialGain.connect(ctx.destination);
  partial.start(startTime);
  partial.stop(startTime + 0.2);
}

function playMarimba(ctx: AudioContext) {
  const now = ctx.currentTime;
  playMarimbaNote(ctx, now, 523.25); // C5
  playMarimbaNote(ctx, now + 0.14, 659.25); // E5 (장3도 위)
}

const SOUND_PRESETS: {
  id: AlarmPresetId;
  label: string;
  play: (ctx: AudioContext) => void;
}[] = [
  { id: "soft-bell", label: "소프트 벨", play: playSoftBell },
  { id: "warm-analog", label: "웜 아날로그", play: playWarmAnalog },
  { id: "marimba", label: "마림바", play: playMarimba },
];

export function getAlarmPresetOptions() {
  return SOUND_PRESETS.map(({ id, label }) => ({ id, label }));
}

/**
 * 지정한 프리셋을 즉시 미리듣기 재생한다(테스트 버튼용 + 실제 완료음
 * 둘 다 이 함수를 거친다). 알람 무음 토글이 켜져 있으면 테스트
 * 버튼을 눌러도 아무 소리가 나지 않는다 — 뮤트는 "이 소리 카테고리
 * 자체를 끈다"는 의미라, 완료음과 미리듣기를 굳이 구분하지 않는다
 * (백색소음 재생 여부와는 완전히 별개 토글).
 */
export function playAlarmPreset(presetId: AlarmPresetId) {
  if (useSoundSettingsStore.getState().alarmMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const preset = SOUND_PRESETS.find((p) => p.id === presetId);
  (preset ?? SOUND_PRESETS[0]).play(ctx);
}

/**
 * 타이머 종료 시 재생하는 완료음 — 현재 선택된 프리셋(localStorage에
 * 저장되어 두 타이머 페이지가 공유)을 재생한다. 스토어를 컴포넌트
 * 밖(zustand 액션 등)에서 읽어야 하므로 훅이 아닌 getState()를 쓴다.
 */
export function playCompletionTone() {
  const { alarmPreset } = useSoundSettingsStore.getState();
  playAlarmPreset(alarmPreset);
}
