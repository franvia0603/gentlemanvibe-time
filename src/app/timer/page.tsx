import type { Metadata } from "next";
import CountdownTimer from "@/components/CountdownTimer";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Timer — GentlemanVibe Time",
};

export default function TimerPage() {
  return (
    <PageShell>
      <CountdownTimer />
      <FullscreenHint featureName="카운트다운 타이머" modeName="Timer" />
    </PageShell>
  );
}
