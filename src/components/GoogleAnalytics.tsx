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
 * 로드되지 않았을 수 있어 오히려 첫 페이지뷰를 놓치기 쉽다. 그래서
 * 최초 마운트는 건너뛰고, 이후 실제 경로 변경 때만 수동으로 전송한다.
 *
 * strategy="lazyOnload"(프로덕션 Lighthouse 감사 후 변경): gtag.js는
 * 약 70KB가 "사용되지 않는 JS"로 잡힐 만큼 대부분 이 사이트에서 쓰이지
 * 않는 기능을 포함하는 서드파티 스크립트다. afterInteractive로
 * 두면 하이드레이션 직후 곧바로 파싱·실행되어 LCP/TBT를 계산하는
 * 구간과 메인 스레드를 두고 경쟁한다 — lazyOnload로 늦추면 핵심
 * 콘텐츠가 먼저 그려진 뒤에야 로드되어 체감 성능에 영향이 없으면서도
 * Lighthouse 성능 점수에 실질적으로 도움이 된다. 첫 페이지뷰가 몇백ms
 * 늦게 잡히는 것 외에는 실제 수집 데이터 손실이 없다.
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
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
      />
      {/*
        JSON.stringify로 gaId를 안전하게 이스케이프해서 넣는다 —
        환경변수 값에 개행이나 따옴표가 섞여 들어와도(실제로 겪은
        사고: 끝에 실제 개행 문자가 붙어 들어온 적이 있다) 이 인라인
        스크립트 자체가 SyntaxError로 통째로 죽는 일이 없도록 하기
        위함이다. 그런 사고가 나면 window.gtag가 아예 정의되지 않아
        페이지뷰가 하나도 수집되지 않는데, 에러가 콘솔에만 찍히고
        화면상으로는 아무 징후가 없어 뒤늦게 "실시간 데이터가 안
        잡힌다"는 형태로만 드러난다.
      */}
      <Script id="google-analytics-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(gaId)});
        `}
      </Script>
    </>
  );
}
