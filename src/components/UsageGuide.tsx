"use client";

import { useIsFullscreen } from "@/hooks/useIsFullscreen";

type UsageGuideProps = {
  title: string;
  paragraphs: string[];
};

/**
 * 도구 페이지 하단의 "사용법 설명" 섹션(spec 3.6) — 이 섹션의 <h1>이
 * 이 페이지의 유일한 실제 h1이자 SEO 핵심 콘텐츠 역할을 한다
 * (spec 8.1, 시맨틱 h1 요건).
 *
 * 풀스크린 중엔 3.3.1 원칙(도구의 핵심 표시 요소 + 나가기 버튼만 노출)에
 * 따라 완전히 숨긴다 — FullscreenHint와 동일한 패턴.
 */
export default function UsageGuide({ title, paragraphs }: UsageGuideProps) {
  const isFullscreen = useIsFullscreen();

  if (isFullscreen) return null;

  return (
    <section className="w-full max-w-lg pt-10 text-left">
      <h1 className="mb-3 text-lg font-normal text-gv-brand-offwhite">
        {title}
      </h1>
      <div className="flex flex-col gap-3 text-sm font-normal leading-relaxed text-gv-beige">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
