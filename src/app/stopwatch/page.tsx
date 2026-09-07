import dynamic from "next/dynamic";
import Stopwatch from "@/components/Stopwatch";
import FullscreenHint from "@/components/FullscreenHint";
import AdBanner from "@/components/AdBanner";
import PomodoroPromoBanner from "@/components/PomodoroPromoBanner";
import GentlemanVibePromoBanner from "@/components/GentlemanVibePromoBanner";
import PageShell from "@/components/PageShell";
import { buildMetadata } from "@/lib/seo";

// 스크롤해야 보이는 아래쪽 섹션들은 초기 번들에서 분리해 지연
// 로딩한다(Lighthouse TBT 개선) — UsageGuide는 SEO 핵심 h1을 담고
// 있어서 ssr은 기본값(켜짐) 그대로 둔다.
const UsageGuide = dynamic(() => import("@/components/UsageGuide"));
const TimeStoriesWidget = dynamic(
  () => import("@/components/TimeStoriesWidget"),
);
const ShareButtons = dynamic(() => import("@/components/ShareButtons"));

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
      {/* spec 3.6: 도구 패널과 사용법 설명 섹션 사이의 광고 자리 */}
      <AdBanner />
      <UsageGuide
        title="GV Stopwatch 사용법"
        paragraphs={[
          "GV Stopwatch는 밀리초 단위까지 정밀하게 측정하는 스톱워치입니다. 시작 버튼을 누르면 즉시 측정이 시작되고, 랩 버튼을 누를 때마다 그 시점까지의 누적 시간과 직전 구간과의 차이가 함께 기록됩니다.",
          "기록된 랩 중 가장 빠른 구간과 가장 느린 구간은 자동으로 색이 구분되어 표시되므로, 여러 번 반복되는 작업이나 운동의 페이스를 비교할 때 유용합니다. 일시정지 후 다시 시작해도 시간은 끊기지 않고 정확히 이어집니다.",
        ]}
      />
      <TimeStoriesWidget />
      {/* spec 3.4.4: 교차 홍보 배너 — 뽀모도로 바로가기 → 젠틀맨바이브 순 */}
      <PomodoroPromoBanner />
      <GentlemanVibePromoBanner />
      <ShareButtons title="Stopwatch — GentlemanVibe Time" />
    </PageShell>
  );
}
