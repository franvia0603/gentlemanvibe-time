import Stopwatch from "@/components/Stopwatch";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Stopwatch — GentlemanVibe Time",
  description:
    "랩타임 기록이 가능한 온라인 스톱워치. 설치 없이 브라우저에서 바로 시간을 측정하세요.",
  path: "/stopwatch",
});

export default function StopwatchPage() {
  return (
    <PageShell>
      <h1 className="sr-only">GV Stopwatch — 온라인 스톱워치</h1>
      <Stopwatch />
      <FullscreenHint featureName="스톱워치" modeName="Stopwatch" />
    </PageShell>
  );
}
