export type GuideCategory = "theory" | "science";

export interface GuideArticle {
  slug: string;
  title: string;
  category: GuideCategory;
  summary: string;
}

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  theory: "시간 관리 이론·기법",
  science: "시간의 과학·역사",
};

export const GUIDE_CATEGORIES: GuideCategory[] = ["theory", "science"];

// 1단계 스캐폴딩 — 실제 제목/본문은 다음 단계에서 5개씩 채운다.
// 카테고리 10개씩 번갈아 배치해 목록 그리드 확인용으로만 쓴다.
export const GUIDE_ARTICLES: GuideArticle[] = Array.from(
  { length: 20 },
  (_, i) => {
    const index = i + 1;
    const category: GuideCategory = index % 2 === 1 ? "theory" : "science";
    return {
      slug: `article-${String(index).padStart(2, "0")}`,
      title: `시간이야기 #${String(index).padStart(2, "0")} (제목 준비 중)`,
      category,
      summary: "본문 준비 중입니다.",
    };
  },
);

export function getGuideArticle(slug: string): GuideArticle | undefined {
  return GUIDE_ARTICLES.find((article) => article.slug === slug);
}
