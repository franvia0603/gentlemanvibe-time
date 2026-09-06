import PomodoroTimer from "@/components/PomodoroTimer";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";
import UsageGuide from "@/components/UsageGuide";
import TimeStoriesWidget from "@/components/TimeStoriesWidget";

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
      <UsageGuide
        title="GV Focus 사용법"
        paragraphs={[
          "GV Focus는 집중과 휴식을 반복하는 뽀모도로 타이머입니다. 기본값은 25분 집중, 5분 휴식이지만 숫자 입력이나 원형 다이얼을 직접 클릭해서 원하는 시간으로 자유롭게 조정할 수 있습니다.",
          "시간을 설정하면 다이얼이 그 분량만큼 꽉 채워진 상태로 시작하고, 시간이 흐를수록 세그먼트가 하나씩 줄어들어 남은 시간을 한눈에 확인할 수 있습니다. 집중 시간이 끝나면 자동으로 휴식 시간으로 전환되며, 전체화면으로 전환하면 다이얼과 남은 시간만 남아 방해 요소 없이 집중할 수 있습니다.",
        ]}
      />
      <TimeStoriesWidget />
    </PageShell>
  );
}
