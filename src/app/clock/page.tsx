import dynamic from "next/dynamic";
import ClockView from "@/components/ClockView";
import FullscreenHint from "@/components/FullscreenHint";
import AdBanner from "@/components/AdBanner";
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
      {/* Clock 페이지 전용 순서(재배치 요청): 날짜·시계·전환 버튼
          바로 다음에 광고 배너, 그 뒤에 FullscreenHint/사용법 등
          기존 콘텐츠가 이어진다 — 다른 도구 페이지(광고가 FullscreenHint
          다음에 오는 순서)와는 의도적으로 다르다.
          spec 3.4.5: 좁은 상단 여백(compact)으로 시계~버튼줄~광고
          배너를 촘촘하게 붙인다 — 다른 페이지의 AdBanner는 그대로. */}
      <AdBanner compact />
      <FullscreenHint featureName="디지털 클락" modeName="Clock" />
      <UsageGuide
        title="GV Clock 사용법"
        paragraphs={[
          "GV Clock은 서브 모니터나 태블릿을 데스크테리어의 일부로 만들어주는 심플한 시계입니다. 상단의 전체화면 버튼을 누르면 브라우저 UI가 전부 사라지고 시계만 화면 가득 표시되는 GV Clock 모드로 전환됩니다.",
          "디지털/아날로그 전환 버튼으로 원하는 스타일을 선택할 수 있으며, 설정 아이콘을 눌러 오전/오후 표시, 초 숨김, 날짜·요일 표시, 위치 기반 날씨 표시를 각각 켜고 끌 수 있습니다. 설정한 내용은 브라우저에 자동으로 저장되어 다음 방문 시에도 그대로 유지됩니다.",
        ]}
      />
      <TimeStoriesWidget />
      {/* spec 3.6의 광고 슬롯 예정 자리(도구 패널↔사용법 설명 섹션 사이)와
          겹치지 않도록, 백색소음 컨트롤은 그보다 아래(부가 옵션 영역)에 둔다. */}
      <WhiteNoiseControls tone="amber" />
      {/* spec 3.4.4: 교차 홍보 배너 — 뽀모도로 바로가기 → 젠틀맨바이브 순 */}
      <PomodoroPromoBanner />
      <GentlemanVibePromoBanner />
      <ShareButtons title="Clock — GentlemanVibe Time" />
    </ClockPageShell>
  );
}
