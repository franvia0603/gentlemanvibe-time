import ClockView from "@/components/ClockView";
import FullscreenHint from "@/components/FullscreenHint";
import SettingsPanel from "@/components/SettingsPanel";
import PageShell from "@/components/PageShell";

export default function Home() {
  return (
    <PageShell>
      <SettingsPanel />
      <ClockView />
      <FullscreenHint featureName="디지털 클락" modeName="Clock" />
    </PageShell>
  );
}
