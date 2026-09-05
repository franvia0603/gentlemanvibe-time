import type { Metadata } from "next";
import WorldClock from "@/components/WorldClock";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "World Clock — GentlemanVibe Time",
};

export default function WorldClockPage() {
  return (
    <PageShell>
      <WorldClock />
      <FullscreenHint featureName="월드 클락" modeName="World Clock" />
    </PageShell>
  );
}
