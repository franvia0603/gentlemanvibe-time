import ClockView from "@/components/ClockView";
import FullscreenHint from "@/components/FullscreenHint";
import SettingsPanel from "@/components/SettingsPanel";
import PageShell from "@/components/PageShell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Clock — GentlemanVibe Time",
  description:
    "데스크테리어를 위한 무료 온라인 디지털·아날로그 시계. 설치 없이 브라우저에서 바로 사용하고 전체화면 Zen 모드로 감상하세요.",
  path: "",
});

export default function Home() {
  return (
    <PageShell>
      <h1 className="sr-only">GV Clock — 실시간 디지털·아날로그 시계</h1>
      <SettingsPanel />
      <ClockView />
      <FullscreenHint featureName="디지털 클락" modeName="Clock" />
    </PageShell>
  );
}
