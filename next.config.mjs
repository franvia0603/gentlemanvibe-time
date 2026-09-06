import withPWAInit from "next-pwa";

// 개발 모드에서는 서비스워커를 끈다 — next-pwa 공식 권장 설정으로,
// 켜두면 HMR로 바뀐 코드가 캐시된 이전 응답에 가려 반영이 안 되는
// 문제가 생긴다. 오프라인 캐싱은 `next build && next start`로 켜지는
// 프로덕션 빌드에서만 실제로 확인할 수 있다.
//
// register:false — next-pwa@5.6.0은 App Router 이전에 나온 버전이라
// 등록 스크립트를 webpack의 `main.js` 엔트리에 주입하는데, App
// Router는 `main-app.js`를 쓰기 때문에 그 스크립트가 아예 로드되지
// 않는다(실빌드로 확인함). 그래서 등록은 next-pwa에 맡기지 않고
// ServiceWorkerRegister 컴포넌트에서 직접 한다.
const withPWA = withPWAInit({
  dest: "public",
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

// 시간이야기 아티클 slug를 숫자 코드(article-01 등)에서 의미가 담긴
// 영문 슬러그로 바꾸면서, 이미 색인되었거나 공유된 옛 URL이 깨지지
// 않도록 301(영구 이동)로 새 URL에 연결한다.
const GUIDE_SLUG_REDIRECTS = {
  "article-01": "pomodoro-technique",
  "article-02": "parkinsons-law",
  "article-03": "two-minute-rule",
  "article-04": "time-blocking",
  "article-05": "eisenhower-matrix",
  "article-06": "deep-work",
  "article-07": "rule-of-three",
  "article-08": "time-tech",
  "article-09": "chronotype",
  "article-10": "scheduled-rest",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return Object.entries(GUIDE_SLUG_REDIRECTS).map(([from, to]) => ({
      source: `/guide/${from}`,
      destination: `/guide/${to}`,
      permanent: true,
    }));
  },
};

export default withPWA(nextConfig);
