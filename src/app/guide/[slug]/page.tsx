import { notFound } from "next/navigation";
import StaticPageShell from "@/components/StaticPageShell";
import { GUIDE_ARTICLES, getGuideArticle } from "@/lib/guideArticles";
import { buildMetadata } from "@/lib/seo";

type GuideArticlePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return GUIDE_ARTICLES.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: GuideArticlePageProps) {
  const article = getGuideArticle(params.slug);
  if (!article) {
    return buildMetadata({
      title: "시간이야기 — GentlemanVibe Time",
      description: "GentlemanVibe Time의 시간이야기 아티클.",
      path: `/guide/${params.slug}`,
    });
  }

  return buildMetadata({
    title: `${article.title} — GentlemanVibe Time`,
    description: article.summary,
    path: `/guide/${article.slug}`,
  });
}

export default function GuideArticlePage({ params }: GuideArticlePageProps) {
  const article = getGuideArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <StaticPageShell title={article.title}>
      <p>이 글은 아직 준비 중입니다. 곧 채워질 예정이니 조금만 기다려 주세요.</p>
    </StaticPageShell>
  );
}
