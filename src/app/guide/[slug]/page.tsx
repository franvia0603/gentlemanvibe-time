import Image from "next/image";
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
      {article.image && (
        // 이미지가 밝은 크림/화이트 배경이라 매트 블랙 테마와 대비가 강해서,
        // 색을 억지로 반전하는 대신 둥근 모서리 카드 프레임(테두리+그림자)으로
        // 감싸 다크 배경 위에 자연스럽게 얹히도록 한다.
        <div className="overflow-hidden rounded-xl border border-gv-charcoal bg-gv-charcoal/40 shadow-lg shadow-black/40">
          <Image
            src={article.image.src}
            alt={article.image.alt}
            width={article.image.width}
            height={article.image.height}
            className="h-auto w-full"
            priority
          />
        </div>
      )}
      {article.body ? (
        article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
      ) : (
        <p>이 글은 아직 준비 중입니다. 곧 채워질 예정이니 조금만 기다려 주세요.</p>
      )}
    </StaticPageShell>
  );
}
