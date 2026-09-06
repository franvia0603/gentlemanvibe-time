"use client";

import { useEffect } from "react";

/**
 * next-pwa@5.6.0의 자동 등록 스크립트는 webpack의 `main.js` 엔트리에
 * 주입되는데, App Router는 `main-app.js`를 쓰기 때문에 그 스크립트가
 * 로드되지 않는다 — 그래서 직접 등록한다. `next build`가 생성하는
 * `public/sw.js`는 개발 모드에는 존재하지 않으므로 프로덕션에서만
 * 시도한다.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // 오프라인 캐싱은 보조 기능이므로, 등록에 실패해도 앱 사용 자체는 지장이 없다.
    });
  }, []);

  return null;
}
