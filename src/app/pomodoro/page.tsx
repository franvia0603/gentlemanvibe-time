import type { Metadata } from "next";
import PomodoroTimer from "@/components/PomodoroTimer";
import FullscreenHint from "@/components/FullscreenHint";

export const metadata: Metadata = {
  title: "Pomodoro — GentlemanVibe Time",
};

export default function PomodoroPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gv-matte-black px-8 pb-8 pt-24">
      <PomodoroTimer />
      <FullscreenHint featureName="뽀모도로 타이머" modeName="Focus" />
    </main>
  );
}
