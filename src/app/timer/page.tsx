import CountdownTimer from "@/components/CountdownTimer";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";
import TimeStoriesWidget from "@/components/TimeStoriesWidget";
import ShareButtons from "@/components/ShareButtons";
import { buildMetadata } from "@/lib/seo";

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
      <TimeStoriesWidget />
      <ShareButtons title="Timer — GentlemanVibe Time" />
    </PageShell>
  );
}
