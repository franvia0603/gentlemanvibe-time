import PomodoroTimer from "@/components/PomodoroTimer";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";
import UsageGuide from "@/components/UsageGuide";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pomodoro — GentlemanVibe Time",
  description:
    "뽀모도로 기법 기반 온라인 집중 타이머. 집중·휴식 시간을 자유롭게 설정하고 전체화면으로 몰입하세요.",
  path: "/pomodoro",
});

export default function PomodoroPage() {
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
    </PageShell>
  );
}
