"use client";

import type { ButtonHTMLAttributes } from "react";
import type { ButtonTone } from "@/components/ui/Button";

const TONE_TEXT: Record<ButtonTone, string> = {
  amber: "text-gv-amber",
  "timer-red": "text-gv-timer-red",
};

const TONE_HOVER_TEXT: Record<ButtonTone, string> = {
  amber: "hover:text-gv-amber",
  "timer-red": "hover:text-gv-timer-red",
};

export type IconButtonSize = "sm" | "md";

// className을 뒤에 이어붙여 크기를 덮어쓰면 Tailwind 유틸리티 우선순위가
// 소스 작성 순서가 아니라 컴파일된 스타일시트 순서로 결정되어 신뢰할 수
// 없다 — 크기별로 완전한 클래스 문자열을 미리 선언해 안전하게 분기한다.
// spec 5.0.3: 터치 타깃은 항상 최소 40~44px을 유지한다 (sm도 예외 아님).
const SIZE_CLASSES: Record<IconButtonSize, string> = {
  sm: "h-10 w-10",
  md: "h-11 w-11",
};

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tone?: ButtonTone;
  size?: IconButtonSize;
}

/** Button과 동일한 시각 언어를 쓰는 원형 아이콘 전용 버튼 (톱니바퀴, 풀스크린, +/- 등) */
export default function IconButton({
  active = false,
  tone = "amber",
  size = "md",
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`flex items-center justify-center rounded-full border border-gv-titanium/25 bg-gv-charcoal/70 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        SIZE_CLASSES[size]
      } ${active ? TONE_TEXT[tone] : "text-gv-beige"} ${TONE_HOVER_TEXT[tone]} ${className}`}
      {...props}
    />
  );
}
