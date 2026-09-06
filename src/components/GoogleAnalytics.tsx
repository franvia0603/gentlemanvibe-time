"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

type GoogleAnalyticsProps = {
  gaId: string;
};

/**
 * App Router는 클라이언트 사이드 라우팅(예: Clock↔Focus↔World 탭 전환,
 * /guide/[slug] 같은 동적 라우트 포함)이 전통적인 페이지 로드를 거치지
 * 않기 때문에, gtag.js의 기본 config 호출 한 번만으로는 두 번째
 * 탭부터의 페이지뷰를 놓친다. 직접 history.pushState로 확인해보니
 * gtag.js가 History API 변경을 자동으로 감지해 page_view를 보내주는
 * 기능은 이 속성에서 켜져 있지 않았다 — usePathname으로 라우트
 * 변경을 감지해 수동으로 page_view를 보내야 한다.
 *
 * 최초 페이지뷰는 gtag('config', ...) 호출이 자동으로 보낸다 — 이 효과가
 * 마운트 시점에도 똑같이 수동 전송을 시도하면 gtag.js가 비동기로 아직
 * 로드되지 않았을 수 있어(afterInteractive는 로드 순서를 보장하지
 * 않음) 오히려 첫 페이지뷰를 놓치기 쉽다. 그래서 최초 마운트는 건너뛰고,
 * 이후 실제 경로 변경 때만 수동으로 전송한다.
 *
 * "마지막으로 실제 보낸 경로"를 ref로 기억해 pathname과 비교하는 이유:
 * 불리언 "첫 렌더" 플래그는 React 18 StrictMode의 개발 모드 effect
 * 이중 실행(이 코드베이스의 다른 곳 — Stopwatch 랩 ID, CountdownTimer
 * 완료 배너 — 에서 이미 겪은 것과 같은 버그 패턴)에서 두 번째 호출을
 * 막지 못한다. ref 비교는 같은 렌더에서 effect가 두 번 불려도 두
 * 번째 호출이 ref가 이미 최신이라 조용히 스킵되어 안전하다. 또한
 * page_path는 GA4 page_view 이벤트가 인식하는 공식 파라미터가
 * 아니라서(page_location/page_title/page_referrer만 인식) 전달해도
 * 조용히 무시되고 있었다 — 제거하고 page_location만 쓴다.
 */
export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    // 최초 마운트의 pathname은 gtag('config', ...)가 이미 자동으로
    // 전송했다 — 그 값을 "마지막으로 보낸 경로"의 시작값으로 잡아두면
    // 마운트 시 중복 전송도 자연히 막힌다.
    if (lastTrackedPathRef.current === null) {
      lastTrackedPathRef.current = pathname;
      return;
    }
    if (lastTrackedPathRef.current === pathname) return;
    lastTrackedPathRef.current = pathname;

    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
