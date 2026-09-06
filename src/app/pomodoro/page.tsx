import PomodoroTimer from "@/components/PomodoroTimer";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";
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
      <h1 className="sr-only">GV Focus — 뽀모도로 집중 타이머</h1>
      <PomodoroTimer />
      <FullscreenHint featureName="뽀모도로 타이머" modeName="Focus" />
    </PageShell>
  );
}
