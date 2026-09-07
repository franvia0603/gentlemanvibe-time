// robots.txt/route.ts와 동일한 패턴 — ads.txt는 정확히 한 줄짜리
// 순수 텍스트 파일이어야 하는데, Next.js에 이 파일 형식을 위한
// 전용 메타데이터 컨벤션이 없어서 raw text/plain을 직접 반환하는
// 일반 라우트 핸들러로 만든다.
const ADS_TXT = `google.com, pub-5218488202760893, DIRECT, f08c47fec0942fa0
`;

export function GET() {
  return new Response(ADS_TXT, {
    headers: { "Content-Type": "text/plain" },
  });
}
