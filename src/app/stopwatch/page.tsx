import type { Metadata } from "next";
import Stopwatch from "@/components/Stopwatch";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Stopwatch — GentlemanVibe Time",
};

export default function StopwatchPage() {
  return (
    <PageShell>
      <Stopwatch />
      <FullscreenHint featureName="스톱워치" modeName="Stopwatch" />
    </PageShell>
  );
}
