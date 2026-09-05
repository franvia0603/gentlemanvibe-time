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

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tone?: ButtonTone;
}

/** Button과 동일한 시각 언어를 쓰는 원형 아이콘 전용 버튼 (톱니바퀴, 풀스크린, +/- 등) */
export default function IconButton({
  active = false,
  tone = "amber",
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-gv-titanium/25 bg-gv-charcoal/70 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? TONE_TEXT[tone] : "text-gv-beige"
      } ${TONE_HOVER_TEXT[tone]} ${className}`}
      {...props}
    />
  );
}
