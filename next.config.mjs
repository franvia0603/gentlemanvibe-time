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

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(nextConfig);
