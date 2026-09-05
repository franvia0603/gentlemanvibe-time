import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400" });

const SIZE = 460;
const CENTER = SIZE / 2;

const SEGMENT_OUTER_R = 172;
const SEGMENT_INNER_R = 122;
const SEGMENT_WIDTH = 9;
const SEGMENT_COUNT = 60;

const TICK_OUTER_R = 190;
const TICK_MAJOR_INNER_R = 176;
const TICK_MINOR_INNER_R = 183;
const LABEL_R = 210;

const GLOW_TAIL = 3;

type PomodoroDialProps = {
  /** 0~1, 경과 비율 (더미 데이터 — 실제 카운트다운 로직은 다음 단계에서 연결) */
  progress?: number;
  /** 원 중심에 표시할 남은 시간 텍스트, 예: "11:55" */
  remainingLabel?: string;
};

function polarPoint(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

/** 0분을 12시 방향(-90deg)에 두고 시계 방향으로 진행하는 각도 */
function angleForMinute(minute: number) {
  return (minute / SEGMENT_COUNT) * 360 - 90;
}

export default function PomodoroDial({
  progress = 0.5,
  remainingLabel = "11:55",
}: PomodoroDialProps) {
  const filledCount = Math.round(SEGMENT_COUNT * progress);

  const majorTicks = Array.from({ length: 12 }, (_, i) => i * 5);
  const minorTicks = Array.from({ length: SEGMENT_COUNT }, (_, i) => i).filter(
    (minute) => minute % 5 !== 0,
  );

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`뽀모도로 타이머, 남은 시간 ${remainingLabel}`}
      className="h-full w-full"
    >
      {/* 방사형 세그먼트 링 — 1분 단위 60칸, 절반 진행 더미 상태 */}
      {Array.from({ length: SEGMENT_COUNT }, (_, i) => {
        const angle = angleForMinute(i + 0.5);
        const isFilled = i < filledCount;
        const isLeadingEdge = isFilled && i >= filledCount - GLOW_TAIL;

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
                  ? "var(--gv-amber-glow)"
                  : "var(--gv-amber)"
                : "var(--gv-charcoal)"
            }
            style={
              isLeadingEdge
                ? { filter: "drop-shadow(0 0 6px var(--gv-amber-glow))" }
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
            stroke="var(--gv-titanium)"
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
            stroke="var(--gv-titanium)"
            strokeWidth={1}
            strokeOpacity={0.4}
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
            fill="var(--gv-titanium)"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {minute}
          </text>
        );
      })}

      {/* 중심 — 남은 시간 */}
      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={80}
        fill="var(--gv-amber-glow)"
        className={bebasNeue.className}
        style={{
          fontVariantNumeric: "tabular-nums",
          filter:
            "drop-shadow(0 0 20px var(--gv-amber-glow)) drop-shadow(0 0 45px var(--gv-amber))",
        }}
      >
        {remainingLabel}
      </text>
    </svg>
  );
}
