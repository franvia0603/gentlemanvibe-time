import { GUIDE_ARTICLES } from "@/lib/guideArticles";
import { SITE_URL } from "@/lib/seo";

const CHANNEL_TITLE = "GentlemanVibe Time - 시간이야기";
const CHANNEL_LINK = `${SITE_URL}/guide`;
const CHANNEL_DESCRIPTION = "시간 관리와 시간의 과학·역사에 관한 이야기";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// "시간이야기"(/guide) 글만 RSS 대상이다 — 도구 페이지(Clock/Focus 등)는
// 콘텐츠가 아니라 기능이므로 제외한다(spec 3.7).
export function GET() {
  const items = [...GUIDE_ARTICLES]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .map((article) => {
      const link = `${SITE_URL}/guide/${article.slug}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.summary)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(CHANNEL_TITLE)}</title>
    <link>${CHANNEL_LINK}</link>
    <description>${escapeXml(CHANNEL_DESCRIPTION)}</description>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
