import WorldClock from "@/components/WorldClock";
import FullscreenHint from "@/components/FullscreenHint";
import PageShell from "@/components/PageShell";
import UsageGuide from "@/components/UsageGuide";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "World Clock — GentlemanVibe Time",
  description:
    "서울 기준 뉴욕·런던·파리 등 주요 도시의 현재 시각과 시차를 한눈에 비교하는 무료 월드 클락.",
  path: "/world",
});

export default function WorldClockPage() {
  return (
    <PageShell>
      <WorldClock />
      <FullscreenHint featureName="월드 클락" modeName="World Clock" />
      <UsageGuide
        title="GV World Clock 사용법"
        paragraphs={[
          "GV World Clock은 여러 도시의 현재 시각을 한 화면에서 비교할 수 있는 기능입니다. 서울을 기준으로 뉴욕, 런던, 파리, 시드니, 두바이, 로스앤젤레스, 토론토의 시각과 시차가 기본으로 표시됩니다.",
          "'추가' 버튼을 눌러 원하는 도시를 검색해서 새로 추가하거나, 필요 없는 도시는 카드의 삭제 버튼으로 언제든 제거할 수 있습니다. 추가하거나 삭제한 목록은 브라우저에 저장되어 다음 방문 시에도 그대로 유지됩니다.",
        ]}
      />
    </PageShell>
  );
}
