import BrandHeader from "@/components/BrandHeader";
import ModeNav from "@/components/ModeNav";

/**
 * BrandHeader/ModeNav를 감싸는 단일 fixed 상단 바.
 * 이전에는 두 컴포넌트가 각자 fixed로 투명하게 떠 있어서, 스크롤이
 * 필요한 긴 페이지(Privacy Policy 등)에서 스크롤 중인 본문 텍스트와
 * 시각적으로 겹쳐 읽기 어려운 문제가 있었다. 배경이 있는 하나의 헤더
 * 바로 통합해 스크롤되는 콘텐츠가 그 뒤로 자연스럽게 지나가도록 한다
 * (표준적인 고정 헤더 동작).
 */
export default function SiteHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-1 border-b border-gv-titanium/10 bg-gv-matte-black pb-3 pt-4">
      <BrandHeader />
      <ModeNav />
    </div>
  );
}
