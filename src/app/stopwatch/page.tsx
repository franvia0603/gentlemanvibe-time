import Stopwatch from "@/components/Stopwatch";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";
import UsageGuide from "@/components/UsageGuide";
import TimeStoriesWidget from "@/components/TimeStoriesWidget";
import ShareButtons from "@/components/ShareButtons";
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
      <Stopwatch />
      <FullscreenHint featureName="스톱워치" modeName="Stopwatch" />
      <UsageGuide
        title="GV Stopwatch 사용법"
        paragraphs={[
          "GV Stopwatch는 밀리초 단위까지 정밀하게 측정하는 스톱워치입니다. 시작 버튼을 누르면 즉시 측정이 시작되고, 랩 버튼을 누를 때마다 그 시점까지의 누적 시간과 직전 구간과의 차이가 함께 기록됩니다.",
          "기록된 랩 중 가장 빠른 구간과 가장 느린 구간은 자동으로 색이 구분되어 표시되므로, 여러 번 반복되는 작업이나 운동의 페이스를 비교할 때 유용합니다. 일시정지 후 다시 시작해도 시간은 끊기지 않고 정확히 이어집니다.",
        ]}
      />
      <TimeStoriesWidget />
      <ShareButtons title="Stopwatch — GentlemanVibe Time" />
    </PageShell>
  );
}
