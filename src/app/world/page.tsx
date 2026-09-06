import WorldClock from "@/components/WorldClock";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "World Clock — GentlemanVibe Time",
  description:
    "서울 기준 뉴욕·런던·파리 등 주요 도시의 현재 시각과 시차를 한눈에 비교하는 무료 월드 클락.",
  path: "/world",
});

export default function WorldClockPage() {
  return (
    <PageShell>
      <h1 className="sr-only">GV World Clock — 세계 시간 비교</h1>
      <WorldClock />
      <FullscreenHint featureName="월드 클락" modeName="World Clock" />
    </PageShell>
  );
}
