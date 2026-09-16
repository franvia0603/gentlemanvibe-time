import dynamic from "next/dynamic";
import ClockView from "@/components/ClockView";
import FullscreenHint from "@/components/FullscreenHint";
import PomodoroPromoBanner from "@/components/PomodoroPromoBanner";
import GentlemanVibePromoBanner from "@/components/GentlemanVibePromoBanner";
import SettingsPanel from "@/components/SettingsPanel";
import ClockPageShell from "@/components/ClockPageShell";
import { buildMetadata } from "@/lib/seo";

// 스크롤해야 보이는 아래쪽 섹션들은 초기 번들에서 분리해 지연
// 로딩한다(Lighthouse TBT 개선) — UsageGuide는 SEO 핵심 h1을 담고
// 있어서 ssr은 기본값(켜짐) 그대로 둔다.
const UsageGuide = dynamic(() => import("@/components/UsageGuide"));
const TimeStoriesWidget = dynamic(
  () => import("@/components/TimeStoriesWidget"),
);
const WhiteNoiseControls = dynamic(
  () => import("@/components/WhiteNoiseControls"),
);
const ShareButtons = dynamic(() => import("@/components/ShareButtons"));

// spec 3.4.1: 기본 랜딩 페이지가 Focus로 바뀌면서 Clock 콘텐츠는
// "/"에서 이 라우트로 이동했다. 메타데이터도 그대로 옮겨왔다.
export const metadata = buildMetadata({
  title: "Clock — GentlemanVibe Time",
  description:
    "데스크테리어를 위한 무료 온라인 디지털·아날로그 시계. 설치 없이 브라우저에서 바로 사용하고 전체화면 Zen 모드로 감상하세요.",
  path: "/clock",
});

export default function ClockPage() {
  return (
    <ClockPageShell>
      <SettingsPanel />
      <ClockView />
      {/* 광고 제거(10일 운영 후 레이아웃 흔들림/수익 저하 이슈로 임시
          철수) — AdBanner 컴포넌트 자체는 재사용을 위해 남겨두고
          호출만 뺀다. */}
      <FullscreenHint featureName="디지털 클락" modeName="Clock" />
      <UsageGuide
        title="GV Clock 사용법"
        paragraphs={[
          "GV Clock은 서브 모니터나 태블릿을 데스크테리어의 일부로 만들어주는 심플한 시계입니다. 상단의 전체화면 버튼을 누르면 브라우저 UI가 전부 사라지고 시계만 화면 가득 표시되는 GV Clock 모드로 전환됩니다.",
          "디지털/아날로그 전환 버튼으로 원하는 스타일을 선택할 수 있으며, 설정 아이콘을 눌러 오전/오후 표시, 초 숨김, 날짜·요일 표시, 위치 기반 날씨 표시를 각각 켜고 끌 수 있습니다. 설정한 내용은 브라우저에 자동으로 저장되어 다음 방문 시에도 그대로 유지됩니다.",
        ]}
      />
      <TimeStoriesWidget />
      <WhiteNoiseControls tone="amber" />
      {/* spec 3.4.4: 교차 홍보 배너 — 뽀모도로 바로가기 → 젠틀맨바이브 순 */}
      <PomodoroPromoBanner />
      <GentlemanVibePromoBanner />
      <ShareButtons title="Clock — GentlemanVibe Time" />
    </ClockPageShell>
  );
}
