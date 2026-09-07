import dynamic from "next/dynamic";
import PomodoroTimer from "@/components/PomodoroTimer";
import FullscreenHint from "@/components/FullscreenHint";
import AdBanner from "@/components/AdBanner";
import GentlemanVibePromoBanner from "@/components/GentlemanVibePromoBanner";
import PageShell from "@/components/PageShell";

// 스크롤해야 보이는 아래쪽 섹션들은 초기 번들에서 분리해 지연
// 로딩한다 — 하이드레이션 비용이 첫 화면(다이얼+시작/리셋)과 경쟁하지
// 않도록 하기 위함(Lighthouse TBT 개선). UsageGuide는 페이지의 SEO
// 핵심 h1을 담고 있어서 ssr을 끄면 안 된다 — next/dynamic 기본값(ssr
// 켜짐)을 그대로 쓰면 서버 렌더 HTML엔 그대로 남고, 클라이언트에서만
// 별도 청크로 나뉘어 로드된다.
const UsageGuide = dynamic(() => import("@/components/UsageGuide"));
const TimeStoriesWidget = dynamic(
  () => import("@/components/TimeStoriesWidget"),
);
const WhiteNoiseControls = dynamic(
  () => import("@/components/WhiteNoiseControls"),
);
const ShareButtons = dynamic(() => import("@/components/ShareButtons"));

/**
 * spec 3.4.1: 기본 랜딩 페이지가 Clock에서 Focus로 바뀌면서, "/"와
 * "/pomodoro" 둘 다 이 동일한 화면을 렌더링한다 — 각 라우트는 자신만의
 * canonical/메타데이터를 가지고 이 컴포넌트를 그대로 불러 쓴다.
 */
export default function FocusPage() {
  return (
    <PageShell>
      <PomodoroTimer />
      <FullscreenHint featureName="뽀모도로 타이머" modeName="Focus" />
      {/* spec 3.6: 도구 패널과 사용법 설명 섹션 사이의 광고 자리 */}
      <AdBanner />
      <UsageGuide
        title="GV Focus 사용법"
        paragraphs={[
          "GV Focus는 집중과 휴식을 반복하는 뽀모도로 타이머입니다. 기본값은 25분 집중, 5분 휴식이지만 숫자 입력이나 원형 다이얼을 직접 클릭해서 원하는 시간으로 자유롭게 조정할 수 있습니다.",
          "시간을 설정하면 다이얼이 그 분량만큼 꽉 채워진 상태로 시작하고, 시간이 흐를수록 세그먼트가 하나씩 줄어들어 남은 시간을 한눈에 확인할 수 있습니다. 집중 시간이 끝나면 자동으로 휴식 시간으로 전환되며, 전체화면으로 전환하면 다이얼과 남은 시간만 남아 방해 요소 없이 집중할 수 있습니다.",
        ]}
      />
      <TimeStoriesWidget />
      {/* spec 3.6의 광고 슬롯 예정 자리(도구 패널↔사용법 설명 섹션 사이)와
          겹치지 않도록, 백색소음 컨트롤은 그보다 아래(부가 옵션 영역)에 둔다. */}
      <WhiteNoiseControls tone="timer-red" />
      {/* spec 3.4.4: 배너①(뽀모도로 바로가기)은 이 페이지 자체가
          Focus라서 제외 — 배너②(젠틀맨바이브)만 노출한다. */}
      <GentlemanVibePromoBanner />
      <ShareButtons title="GV Focus 뽀모도로 타이머 — GentlemanVibe Time" />
    </PageShell>
  );
}
