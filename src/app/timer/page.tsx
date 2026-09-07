import dynamic from "next/dynamic";
import CountdownTimer from "@/components/CountdownTimer";
import FullscreenHint from "@/components/FullscreenHint";
import AdBanner from "@/components/AdBanner";
import PageShell from "@/components/PageShell";
import { buildMetadata } from "@/lib/seo";

// 스크롤해야 보이는 아래쪽 섹션들은 초기 번들에서 분리해 지연
// 로딩한다(Lighthouse TBT 개선).
const TimeStoriesWidget = dynamic(
  () => import("@/components/TimeStoriesWidget"),
);
const ShareButtons = dynamic(() => import("@/components/ShareButtons"));

export const metadata = buildMetadata({
  title: "Timer — GentlemanVibe Time",
  description:
    "라면 조리시간 프리셋을 포함한 온라인 카운트다운 타이머. 원하는 시간을 설정하고 종료 알림을 받아보세요.",
  path: "/timer",
});

export default function TimerPage() {
  return (
    <PageShell>
      <h1 className="sr-only">GV Timer — 카운트다운 타이머</h1>
      <CountdownTimer />
      <FullscreenHint featureName="카운트다운 타이머" modeName="Timer" />
      {/* spec 3.6: 도구 패널(라면 프리셋·조리 팁 포함)과 다음 콘텐츠
          섹션 사이의 광고 자리 — 이 페이지엔 별도 UsageGuide가 없어서
          FullscreenHint 바로 다음, TimeStoriesWidget 앞에 둔다. */}
      <AdBanner />
      <TimeStoriesWidget />
      <ShareButtons title="Timer — GentlemanVibe Time" />
    </PageShell>
  );
}
