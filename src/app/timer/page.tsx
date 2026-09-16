import dynamic from "next/dynamic";
import CountdownTimer from "@/components/CountdownTimer";
import FullscreenHint from "@/components/FullscreenHint";
import PomodoroPromoBanner from "@/components/PomodoroPromoBanner";
import GentlemanVibePromoBanner from "@/components/GentlemanVibePromoBanner";
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
      {/* 광고 제거(10일 운영 후 레이아웃 흔들림/수익 저하 이슈로 임시
          철수) — AdBanner 컴포넌트 자체는 재사용을 위해 남겨두고
          호출만 뺀다. */}
      <TimeStoriesWidget />
      {/* spec 3.4.4: 교차 홍보 배너 — 뽀모도로 바로가기 → 젠틀맨바이브 순 */}
      <PomodoroPromoBanner />
      <GentlemanVibePromoBanner />
      <ShareButtons title="Timer — GentlemanVibe Time" />
    </PageShell>
  );
}
