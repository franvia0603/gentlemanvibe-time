import ClockView from "@/components/ClockView";
import FullscreenHint from "@/components/FullscreenHint";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gv-matte-black px-8 pb-24 pt-24">
      <SettingsPanel />
      <ClockView />
      <FullscreenHint featureName="디지털 클락" modeName="Clock" />
    </main>
  );
}
