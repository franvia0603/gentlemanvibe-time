"use client";

import { useEffect, useRef } from "react";

const SIZE = 300;
const CENTER = SIZE / 2;
const FACE_R = 142;
const TICK_OUTER_R = 134;
const TICK_MAJOR_INNER_R = 114;
const TICK_MINOR_INNER_R = 124;

// 삼각함수 결과는 서버(Node.js)와 브라우저의 부동소수점 마지막 자리가
// 미세하게 달라질 수 있어, 좌표를 소수점 3자리로 고정해 hydration mismatch를 막는다.
function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

/** 0분을 12시 방향(위쪽)에 두고 시계 방향으로 도는 각도의 좌표 */
function polarPoint(radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: round(CENTER + radius * Math.cos(rad)),
    y: round(CENTER + radius * Math.sin(rad)),
  };
}

export default function AnalogClock() {
  const hourRef = useRef<SVGLineElement>(null);
  const minuteRef = useRef<SVGLineElement>(null);
  const secondRef = useRef<SVGLineElement>(null);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // React state를 거치지 않고 매 프레임 DOM에 직접 회전값을 반영해,
    // 초침이 뚝뚝 끊기지 않고 부드럽게 돌아가면서도 불필요한 리렌더를 피한다.
    const applyAngles = () => {
      const now = new Date();
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      if (secondRef.current) {
        secondRef.current.style.transform = `rotate(${seconds * 6}deg)`;
      }
      if (minuteRef.current) {
        minuteRef.current.style.transform = `rotate(${minutes * 6}deg)`;
      }
      if (hourRef.current) {
        hourRef.current.style.transform = `rotate(${hours * 30}deg)`;
      }
    };

    const tick = () => {
      applyAngles();
      frameRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameRef.current === undefined) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        applyAngles(); // 화면 복귀 즉시 재동기화
        start();
      } else {
        stop();
      }
    };

    applyAngles();
    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const originStyle = { transformOrigin: `${CENTER}px ${CENTER}px` };

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label="아날로그 시계"
      className="h-full w-full select-none"
    >
      <circle cx={CENTER} cy={CENTER} r={FACE_R} fill="var(--gv-charcoal)" />

      {Array.from({ length: 60 }, (_, i) => {
        const angle = i * 6;
        const isMajor = i % 5 === 0;
        const outer = polarPoint(TICK_OUTER_R, angle);
        const inner = polarPoint(
          isMajor ? TICK_MAJOR_INNER_R : TICK_MINOR_INNER_R,
          angle,
        );
        return (
          <line
            key={i}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke="var(--gv-titanium)"
            strokeWidth={isMajor ? 3 : 1}
            strokeOpacity={isMajor ? 0.9 : 0.35}
            strokeLinecap="round"
          />
        );
      })}

      {/* 시침 */}
      <line
        ref={hourRef}
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2={CENTER - 70}
        stroke="var(--gv-brand-offwhite)"
        strokeWidth={6}
        strokeLinecap="round"
        style={originStyle}
      />

      {/* 분침 */}
      <line
        ref={minuteRef}
        x1={CENTER}
        y1={CENTER}
        x2={CENTER}
        y2={CENTER - 104}
        stroke="var(--gv-brand-offwhite)"
        strokeWidth={4}
        strokeOpacity={0.85}
        strokeLinecap="round"
        style={originStyle}
      />

      {/* 초침 */}
      <line
        ref={secondRef}
        x1={CENTER}
        y1={CENTER + 18}
        x2={CENTER}
        y2={CENTER - 118}
        stroke="var(--gv-amber)"
        strokeWidth={2}
        strokeLinecap="round"
        style={originStyle}
      />

      <circle cx={CENTER} cy={CENTER} r={5} fill="var(--gv-amber)" />
    </svg>
  );
}
