import FocusPage from "@/components/FocusPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GV 집중력타이머 : 뽀모도로 포커스 타이머 | GentlemanVibe Time",
  description:
    "25분 집중, 5분 휴식. 원형 다이얼로 남은 시간을 한눈에 보는 무료 집중력 타이머 GV 포커스. 데스크테리어 감성의 뽀모도로 타이머.",
  path: "",
});

export default function Home() {
  return <FocusPage />;
}
