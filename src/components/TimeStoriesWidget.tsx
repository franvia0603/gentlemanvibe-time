"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";
import { GUIDE_ARTICLES, type GuideArticle } from "@/lib/guideArticles";

function pickRandom(articles: GuideArticle[], count: number): GuideArticle[] {
  const shuffled = [...articles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 도구 페이지 하단(사용법 설명/조리팁 섹션과 푸터 사이)에 배치하는
 * "시간이야기" 추천 위젯(spec 3.7). 무작위 선택이라 서버 렌더와
 * 클라이언트 첫 렌더가 다를 수 있으므로, 다른 훅들과 동일하게
 * 마운트 후 이펙트에서만 값을 채운다(hydration mismatch 방지).
 *
 * 3.3.1 원칙에 따라 풀스크린 중에는 숨긴다.
 */
export default function TimeStoriesWidget() {
  const isFullscreen = useIsFullscreen();
  const [picks, setPicks] = useState<GuideArticle[] | null>(null);

  useEffect(() => {
    const count = Math.random() < 0.5 ? 2 : 3;
    setPicks(pickRandom(GUIDE_ARTICLES, count));
  }, []);

  if (isFullscreen || !picks) return null;

  return (
    <section className="w-full max-w-lg pt-10 text-left">
      <h2 className="mb-3 text-sm font-normal uppercase tracking-wide text-gv-titanium">
        시간이야기
      </h2>
      <div className="flex flex-col gap-2">
        {picks.map((article) => (
          <Link
            key={article.slug}
            href={`/guide/${article.slug}`}
            className="rounded-lg border border-gv-titanium/25 bg-gv-charcoal/70 p-3 text-sm font-normal text-gv-titanium transition-colors hover:border-gv-amber/40 hover:text-gv-amber"
          >
            {article.title}
          </Link>
        ))}
      </div>
      <Link
        href="/guide"
        className="mt-3 inline-block text-xs font-normal text-gv-titanium underline underline-offset-2 transition-colors hover:text-gv-beige"
      >
        더 많은 시간 이야기 보기
      </Link>
    </section>
  );
}
