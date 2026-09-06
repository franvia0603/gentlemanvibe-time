import type { MetadataRoute } from "next";
import { GUIDE_ARTICLES } from "@/lib/guideArticles";
import { SITE_URL } from "@/lib/seo";

// spec 3.4.1: "/"는 이제 Focus를 렌더링한다. "/pomodoro"는 동일한
// 화면을 별도 URL로 유지하고, Clock은 "/clock"으로 이동했다.
const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/clock", priority: 0.8 },
  { path: "/pomodoro", priority: 0.8 },
  { path: "/stopwatch", priority: 0.8 },
  { path: "/timer", priority: 0.8 },
  { path: "/world", priority: 0.8 },
  { path: "/guide", priority: 0.6 },
  { path: "/about", priority: 0.5 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/contact", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const guideEntries = GUIDE_ARTICLES.map((article) => ({
    url: `${SITE_URL}/guide/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticEntries, ...guideEntries];
}
