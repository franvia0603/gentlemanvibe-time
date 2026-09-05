"use client";

import { Bebas_Neue } from "next/font/google";
import type { MouseEvent } from "react";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400" });

const SIZE = 460;
const CENTER = SIZE / 2;

const SEGMENT_OUTER_R = 172;
const SEGMENT_INNER_R = 122;
const SEGMENT_WIDTH = 9;
const SEGMENT_COUNT = 60;
const DIAL_MAX_MINUTES = 60;

const TICK_OUTER_R = 190;
const TICK_MAJOR_INNER_R = 176;
const TICK_MINOR_INNER_R = 183;
const LABEL_R = 210;

const GLOW_TAIL = 3;

export type SegmentDialTone = "timer-red" | "amber";

const TONE_COLORS: Record<SegmentDialTone, { fill: string; glow: string }> = {
  "timer-red": {
    fill: "var(--gv-timer-red)",
    glow: "var(--gv-timer-red-glow)",
  },
  amber: {
    fill: "var(--gv-amber)",
    glow: "var(--gv-amber-glow)",
  },
};

type SegmentDialProps = {
  /** 다이얼에 표시할 총 설정 시간(분). 다이얼은 최대 60분(한 바퀴)까지 표현한다. */
  totalMinutes: number;
  /** 남은 시간(초) — 세그먼트 채움과 중앙 표시에 사용 */
  remainingSeconds: number;
  /** 다이얼 둘레를 클릭/드래그해 시간을 설정할 때 호출 (1~60분) */
  onSelectMinutes?: (minutes: number) => void;
  /** true면 클릭으로 시간 설정 불가 (타이머 실행 중) */
  disabled?: boolean;
  /** 세그먼트 강조 색 계열 — 뽀모도로는 timer-red, 범용 타이머는 amber */
  tone?: SegmentDialTone;
  /** 접근성 라벨에 쓸 기능명, 예: "뽀모도로 타이머" / "카운트다운 타이머" */
  label?: string;
  /** 지정하면 중앙 표시를 이 문자열로 대체 (예: 초과 경과 "+00:15") */
  centerLabel?: string;
};

// 삼각함수 결과는 서버(Node.js)와 브라우저의 부동소수점 마지막 자리가
// 미세하게 달라질 수 있어, 좌표를 소수점 3자리로 고정해 hydration mismatch를 막는다.
function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

function polarPoint(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: round(CENTER + radius * Math.cos(rad)),
    y: round(CENTER + radius * Math.sin(rad)),
  };
}

/** 0분을 12시 방향(-90deg)에 두고 시계 방향으로 진행하는 각도 */
function angleForMinute(minute: number) {
  return round((minute / SEGMENT_COUNT) * 360 - 90);
}

function formatRemaining(totalSeconds: number) {
  const clamped = Math.max(0, totalSeconds);
  const mm = String(Math.floor(clamped / 60)).padStart(2, "0");
  const ss = String(Math.floor(clamped % 60)).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function SegmentDial({
  totalMinutes,
  remainingSeconds,
  onSelectMinutes,
  disabled = false,
  tone = "timer-red",
  label = "타이머",
  centerLabel,
}: SegmentDialProps) {
  const colors = TONE_COLORS[tone];

  const totalCount = Math.min(
    DIAL_MAX_MINUTES,
    Math.max(1, Math.round(totalMinutes)),
  );
  const remainingCount = Math.min(
    totalCount,
    Math.max(0, Math.round(remainingSeconds / 60)),
  );
  // 남은 시간만큼 "뒤쪽"(설정 구간의 끝)이 채워져 있고, 경과한 앞쪽부터 비워진다.
  const elapsedCount = totalCount - remainingCount;

  const majorTicks = Array.from({ length: 12 }, (_, i) => i * 5);
  const minorTicks = Array.from({ length: SEGMENT_COUNT }, (_, i) => i).filter(
    (minute) => minute % 5 !== 0,
  );

  const displayText = centerLabel ?? formatRemaining(remainingSeconds);

  function handleDialClick(event: MouseEvent<SVGSVGElement>) {
    if (disabled || !onSelectMinutes) return;

    const svg = event.currentTarget;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const svgPoint = point.matrixTransform(ctm.inverse());
    const dx = svgPoint.x - CENTER;
    const dy = svgPoint.y - CENTER;

    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angleDeg < 0) angleDeg += 360;

    const minutes = Math.round((angleDeg / 360) * DIAL_MAX_MINUTES);
    onSelectMinutes(minutes === 0 ? DIAL_MAX_MINUTES : minutes);
  }

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role={onSelectMinutes ? "slider" : "img"}
      aria-label={`${label}, 남은 시간 ${displayText}`}
      aria-valuenow={onSelectMinutes ? totalCount : undefined}
      aria-valuemin={onSelectMinutes ? 1 : undefined}
      aria-valuemax={onSelectMinutes ? DIAL_MAX_MINUTES : undefined}
      onClick={handleDialClick}
      className={`h-full w-full ${
        disabled ? "" : onSelectMinutes ? "cursor-pointer" : ""
      }`}
    >
      {/* 방사형 세그먼트 링 — 설정 시간만큼 꽉 찬 상태로 시작해 남은 시간만큼만 유지 */}
      {Array.from({ length: SEGMENT_COUNT }, (_, i) => {
        const angle = angleForMinute(i + 0.5);
        const isInPlay = i < totalCount;
        const isFilled = isInPlay && i >= elapsedCount;
        const isLeadingEdge = isFilled && i < elapsedCount + GLOW_TAIL;

        return (
          <rect
            key={i}
            x={CENTER - SEGMENT_WIDTH / 2}
            y={CENTER - SEGMENT_OUTER_R}
            width={SEGMENT_WIDTH}
            height={SEGMENT_OUTER_R - SEGMENT_INNER_R}
            rx={SEGMENT_WIDTH / 2}
            transform={`rotate(${angle} ${CENTER} ${CENTER})`}
            fill={
              isFilled
                ? isLeadingEdge
                  ? colors.glow
                  : colors.fill
                : "var(--gv-charcoal)"
            }
            style={
              isLeadingEdge
                ? { filter: `drop-shadow(0 0 6px ${colors.glow})` }
                : undefined
            }
          />
        );
      })}

      {/* 5분 단위 굵은 눈금 */}
      {majorTicks.map((minute) => {
        const angle = angleForMinute(minute);
        const p1 = polarPoint(TICK_MAJOR_INNER_R, angle);
        const p2 = polarPoint(TICK_OUTER_R, angle);
        return (
          <line
            key={`major-${minute}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="var(--gv-brand-offwhite)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}

      {/* 1분 단위 얇은 눈금 */}
      {minorTicks.map((minute) => {
        const angle = angleForMinute(minute);
        const p1 = polarPoint(TICK_MINOR_INNER_R, angle);
        const p2 = polarPoint(TICK_OUTER_R, angle);
        return (
          <line
            key={`minor-${minute}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="var(--gv-brand-offwhite)"
            strokeWidth={1}
            strokeOpacity={0.35}
            strokeLinecap="round"
          />
        );
      })}

      {/* 5분 단위 눈금 숫자 */}
      {majorTicks.map((minute) => {
        const angle = angleForMinute(minute);
        const pos = polarPoint(LABEL_R, angle);
        return (
          <text
            key={`label-${minute}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={15}
            fontWeight={300}
            fill="var(--gv-brand-offwhite)"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {minute}
          </text>
        );
      })}

      {/* 중심 — 남은 시간 (또는 centerLabel로 대체) */}
      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={centerLabel && centerLabel.length > 6 ? 60 : 80}
        fill="var(--gv-brand-offwhite)"
        className={bebasNeue.className}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {displayText}
      </text>
    </svg>
  );
}
