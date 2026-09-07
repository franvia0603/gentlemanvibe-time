"use client";

import type { ButtonHTMLAttributes } from "react";

export type ButtonTone = "amber" | "timer-red";

// 강조 색은 페이지 문맥(클락=amber, 뽀모도로=timer-red)에 따라 갈리므로,
// 완전한 클래스 문자열로 미리 선언해둬야 Tailwind가 클래스를 생성한다
// (동적으로 이어붙인 문자열은 스캔되지 않는다).
const TONE_TEXT: Record<ButtonTone, string> = {
  amber: "text-gv-amber",
  "timer-red": "text-gv-timer-red",
};

const TONE_HOVER_TEXT: Record<ButtonTone, string> = {
  amber: "hover:text-gv-amber",
  "timer-red": "hover:text-gv-timer-red",
};

export type ButtonSize = "md" | "lg";

// IconButton과 동일한 이유로 완전한 클래스 문자열을 미리 선언한다 —
// className을 뒤에 이어붙여 px-6/px-7처럼 같은 종류의 유틸리티를
// 덮어쓰려 하면, Tailwind가 실제로 어떤 걸 우선할지는 소스 코드상
// 순서가 아니라 컴파일된 스타일시트의 클래스 생성 순서로 정해져
// 신뢰할 수 없다.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "min-h-11 px-6 py-2.5 text-base",
  lg: "min-h-11 px-7 py-3 text-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 선택/강조 상태 — 테두리를 바꾸지 않고 텍스트 색만 tone으로 전환한다 (spec 5.0.1) */
  active?: boolean;
  /** 강조 색 계열: 기본 gv-amber, 뽀모도로 화면은 gv-timer-red */
  tone?: ButtonTone;
  /** 기본 md, 더 눈에 띄어야 하는 단독 버튼(예: Clock의 모드 전환)은 lg */
  size?: ButtonSize;
}

/**
 * 사이트 전역 공통 버튼. 밝은 테두리 대신 은은한 배경 채움 +
 * 낮은 불투명도 테두리를 쓰고, 강조는 항상 텍스트 색으로만 표현한다.
 */
export default function Button({
  active = false,
  tone = "amber",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-full border border-gv-titanium/25 bg-gv-charcoal/70 font-normal tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        SIZE_CLASSES[size]
      } ${active ? TONE_TEXT[tone] : "text-gv-beige"} ${TONE_HOVER_TEXT[tone]} ${className}`}
      {...props}
    />
  );
}
