"use client";

import { Bebas_Neue } from "next/font/google";
import { formatStopwatch, useStopwatch } from "@/hooks/useStopwatch";
import Button from "@/components/ui/Button";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export default function Stopwatch() {
  const { elapsedMs, isRunning, laps, start, pause, reset, lap } =
    useStopwatch();

  const lapDurations = laps.map((l) => l.lapMs);
  const fastestMs = laps.length > 1 ? Math.min(...lapDurations) : null;
  const slowestMs = laps.length > 1 ? Math.max(...lapDurations) : null;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div
        className={`${bebasNeue.className} select-none whitespace-nowrap text-[clamp(3rem,13vw,7rem)] tabular-nums tracking-widest text-gv-amber-glow`}
        style={{
          textShadow: "0 0 40px var(--gv-amber-glow), 0 0 90px var(--gv-amber)",
        }}
      >
        {formatStopwatch(elapsedMs)}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button active onClick={isRunning ? pause : start}>
          {isRunning ? "일시정지" : "시작"}
        </Button>
        <Button onClick={lap} disabled={!isRunning}>
          랩
        </Button>
        <Button onClick={reset} disabled={isRunning}>
          리셋
        </Button>
      </div>

      {laps.length > 0 && (
        <div className="max-h-64 w-full overflow-y-auto rounded-lg border border-gv-titanium/20 bg-gv-charcoal/50">
          <ul>
            {[...laps].reverse().map((lapItem) => {
              const isFastest = fastestMs !== null && lapItem.lapMs === fastestMs;
              const isSlowest = slowestMs !== null && lapItem.lapMs === slowestMs;
              const highlight = isFastest || isSlowest;

              return (
                <li
                  key={lapItem.id}
                  className="flex items-center justify-between gap-3 border-b border-gv-titanium/10 px-4 py-2.5 text-sm tabular-nums last:border-b-0"
                >
                  <span className="text-gv-titanium">Lap {lapItem.id}</span>
                  <span
                    className={highlight ? "text-gv-amber" : "text-gv-beige"}
                  >
                    {formatStopwatch(lapItem.lapMs)}
                  </span>
                  <span className="text-gv-titanium">
                    {formatStopwatch(lapItem.totalMs)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
