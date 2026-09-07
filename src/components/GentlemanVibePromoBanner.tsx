"use client";

import PromoBannerCard from "@/components/PromoBannerCard";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

/**
 * spec 3.4.4 배너② — 본사이트(gentlemanvibe.com)로의 유입 통로.
 * 배너①과 달리 Focus 페이지를 포함해 대상 페이지 전부에 항상
 * 노출된다(이 배너는 "자기 자신 홍보"가 아니라 완전히 다른
 * 사이트로의 링크이기 때문).
 *
 * ShareButtons 등과 동일한 패턴으로 풀스크린 중엔 스스로 숨긴다.
 */
export default function GentlemanVibePromoBanner() {
  const isFullscreen = useIsFullscreen();

  if (isFullscreen) {
    return null;
  }

  return (
    <PromoBannerCard
      href="https://www.gentlemanvibe.com"
      external
      ariaLabel="GentlemanVibe 인테리어 IDEA — 메인 사이트로 이동(새 탭)"
      icon={
        <span className="text-xs font-extrabold tracking-wide text-gv-brand-offwhite">
          GV
        </span>
      }
      iconBgClassName="bg-[#2c2f36]"
      eyebrow="GENTLEMANVIBE"
      eyebrowDotClassName="bg-[#c98a95]"
      eyebrowTextClassName="text-[#c98a95]"
      title="인테리어 IDEA"
      subtitle="데스크테리어 영감을 만나보세요."
      ctaLabel="더 보기 →"
      ctaClassName="bg-gv-brand-offwhite text-gv-charcoal"
    />
  );
}
