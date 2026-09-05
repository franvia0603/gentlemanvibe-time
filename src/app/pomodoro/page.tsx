import type { Metadata } from "next";
import PomodoroTimer from "@/components/PomodoroTimer";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Pomodoro — GentlemanVibe Time",
};

export default function PomodoroPage() {
  return (
    <PageShell>
      <PomodoroTimer />
      <FullscreenHint featureName="뽀모도로 타이머" modeName="Focus" />
    </PageShell>
  );
}
