import Link from "next/link";
import {
  GUIDE_ARTICLES,
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_LABELS,
} from "@/lib/guideArticles";
import { buildMetadata, SITE_URL } from "@/lib/seo";

const baseMetadata = buildMetadata({
  title: "시간이야기 — GentlemanVibe Time",
  description:
    "시간 관리 이론·기법과 시간의 과학·역사를 다루는 GentlemanVibe Time의 아티클 모음.",
  path: "/guide",
});

// RSS 자동 검색(브라우저/피드 리더가 <link rel="alternate">를 인식)을
// 위해 /guide 목록 페이지에만 피드 링크를 추가한다.
export const metadata = {
  ...baseMetadata,
  alternates: {
    ...baseMetadata.alternates,
    types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
  },
};

export default function GuidePage() {
  return (
    <main
      className="min-h-screen bg-gv-matte-black px-6 pb-16"
      style={{ paddingTop: "calc(var(--gv-header-height, 124px) + 8px)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <h1 className="text-2xl font-normal text-gv-brand-offwhite">
          시간이야기
        </h1>

        {GUIDE_CATEGORIES.map((category) => {
          const articles = GUIDE_ARTICLES.filter(
            (article) => article.category === category,
          );

          return (
            <section key={category} className="flex flex-col gap-4">
              <h2 className="text-base font-normal text-gv-brand-offwhite">
                {GUIDE_CATEGORY_LABELS[category]}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/guide/${article.slug}`}
                    className="flex flex-col gap-1 rounded-lg border border-gv-titanium/25 bg-gv-charcoal/70 p-4 transition-colors hover:border-gv-amber/40"
                  >
                    <span className="text-sm font-normal text-gv-beige">
                      {article.title}
                    </span>
                    <span className="text-xs font-normal text-gv-titanium">
                      {article.summary}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
