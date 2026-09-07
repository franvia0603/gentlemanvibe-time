/**
 * 시간대별 무드톤 자동 변화(spec 5.0.4) — Clock 배경에만 적용되는
 * 3단계 톤. 색상 값은 전부 미리 계산해둔 상수다(런타임에 blend 계산을
 * 하지 않는다 — 어차피 고정된 세 값뿐이라 미리 구해두는 쪽이 더
 * 명확하고 실수할 여지가 없다):
 *
 * - morning: gv-matte-black(13,13,13)에 gv-beige(232,220,200)를 4%
 *   블렌드 → rgb(22,21,20). "5% 이내"라는 스펙 요구를 여유 있게 지킨다.
 * - afternoon: gv-matte-black 그대로, rgb(13,13,13) — 변화 없음.
 * - night: gv-matte-black을 gv-true-black(0,0,0) 쪽으로 30% 블렌드 →
 *   rgb(9,9,9). "가깝게 아주 살짝 더 어둡게"라는 표현에 맞춰 완전한
 *   true black까지는 가지 않는다.
 *
 * 밤 시간대의 "앰버 글로우 채도 살짝 상승"은 --gv-amber/--gv-amber-glow
 * CSS 커스텀 프로퍼티를 이 톤이 적용되는 요소 아래로만 로컬 재정의해
 * (전역 :root 값은 건드리지 않는다 — 다른 페이지의 앰버 색상까지
 * 바뀌면 안 되므로) 처리한다. HSL에서 채도만 +12%p 올린 값이다.
 */

export type MoodTone = "morning" | "afternoon" | "night";

export function getMoodTone(date: Date): MoodTone {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

export const MOOD_TONE_BACKGROUND: Record<MoodTone, string> = {
  morning: "rgb(22, 21, 20)",
  afternoon: "rgb(13, 13, 13)",
  night: "rgb(9, 9, 9)",
};

/** night 톤에서만 로컬 재정의하는 앰버 계열 CSS 변수 (채도 +12%p) */
export const NIGHT_AMBER_VARS: Record<string, string> = {
  "--gv-amber": "#f3a94c",
  "--gv-amber-rgb": "243 169 76",
  "--gv-amber-glow": "#fdca82",
  "--gv-amber-glow-rgb": "253 202 130",
};
