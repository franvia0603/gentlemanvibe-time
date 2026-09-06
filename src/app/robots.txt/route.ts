import { SITE_URL } from "@/lib/seo";

// Next.js의 app/robots.ts(MetadataRoute.Robots) 컨벤션은 User-agent/
// Allow/Disallow/Sitemap 같은 표준 필드만 지원해서, Daum(카카오)
// 웹마스터도구가 요구하는 임의의 #DaumWebMasterTool 주석 줄을 담을 수
// 없다. 그래서 이 파일을 raw text/plain을 직접 반환하는 일반 라우트
// 핸들러로 만들어, 표준 내용은 그대로 유지하면서 그 줄만 맨 아래에
// 덧붙인다.
const ROBOTS_TXT = `User-Agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

#DaumWebMasterTool:6e64475e7750a28b1b2c451a315f3ca0ea4072f3ff658eb4a8cd53ff744de07c:5V2l4zzpVdoc3wbVoHspjg==
`;

export function GET() {
  return new Response(ROBOTS_TXT, {
    headers: { "Content-Type": "text/plain" },
  });
}
