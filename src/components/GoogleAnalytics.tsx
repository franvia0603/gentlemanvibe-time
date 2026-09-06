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
 * App Router는 클라이언트 사이드 라우팅(예: Clock↔Focus↔World 탭 전환)
 * 이 전통적인 페이지 로드를 거치지 않기 때문에, gtag.js의 기본 config
 * 호출 한 번만으로는 두 번째 탭부터의 페이지뷰를 놓친다. usePathname으로
 * 라우트 변경을 감지해 수동으로 page_view를 보내 해결한다.
 *
 * 최초 페이지뷰는 gtag('config', ...) 호출이 자동으로 보낸다 — 이 효과가
 * 마운트 시점에도 똑같이 수동 전송을 시도하면 gtag.js가 비동기로 아직
 * 로드되지 않았을 수 있어(afterInteractive는 로드 순서를 보장하지
 * 않음) 오히려 첫 페이지뷰를 놓치기 쉽다. 그래서 최초 마운트는 건너뛰고,
 * 이후 실제 경로 변경 때만 수동으로 전송한다.
 */
export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: pathname,
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
