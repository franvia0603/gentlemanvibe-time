"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

interface WindowWithAdsbygoogle extends Window {
  adsbygoogle?: unknown[];
}

/**
 * spec 3.6 — 도구 패널(또는 글 본문)과 사용법 설명 섹션 사이에 두는
 * 반응형 디스플레이 광고 슬롯. 전역 adsbygoogle.js 로더는
 * layout.tsx에 이미 있으므로, 이 컴포넌트는 <ins> 태그와 그걸
 * 채워달라는 push({}) 호출만 담당한다.
 *
 * Next.js App Router는 페이지를 이동해도(SPA 라우팅) <ins> DOM
 * 노드가 그대로 재사용될 수 있는데, adsbygoogle는 이미 광고를 채운
 * <ins> 요소에 다시 push({})하면 "already have ads in it" 콘솔
 * 에러를 낸다. 그래서 key={pathname}으로 경로가 바뀔 때마다 이
 * 컴포넌트 전체(그리고 그 안의 <ins>)를 완전히 새 DOM 노드로
 * 강제 리마운트시킨다 — 사용하는 쪽에서 <AdBanner key={pathname} />
 * 처럼 감쌀 필요 없이, 이 컴포넌트가 usePathname()으로 스스로
 * key를 관리한다.
 *
 * 풀스크린 처리: 원래 요청은 사용하는 쪽에서
 * {!isFullscreen && <AdBanner />}로 감싸는 형태였지만, 이 배너를
 * 쓰는 페이지 중 상당수(Clock/Stopwatch/Timer/World의 page.tsx)가
 * 그 자체로 metadata를 export하는 서버 컴포넌트라 "use client"로
 * 바꿀 수 없고, 따라서 그 파일들 안에서 useIsFullscreen() 훅을 직접
 * 호출할 수 없다. 그래서 이 컴포넌트가 스스로 useIsFullscreen()을
 * 호출해 풀스크린이면 아무것도 렌더링하지 않는다 — ShareButtons/
 * FullscreenHint/SettingsPanel 등 같은 페이지들에서 이미 쓰고 있는
 * 것과 동일한 패턴이며, 결과는 동일하다: 풀스크린 중에는 <ins>가
 * DOM에 아예 존재하지 않아 광고 요청 자체가 발생하지 않는다.
 *
 * 개발 모드 전용 버그(실사용/프로덕션 빌드에서는 재현되지 않음, 이
 * 코드베이스에서 반복된 익숙한 패턴 — Stopwatch 랩 ID, CountdownTimer
 * 완료 배너, GA4 트래킹에서 이미 겪었다): React 18 StrictMode가 개발
 * 모드에서 effect를 mount→cleanup→mount로 두 번 실행하는데, 이때
 * DOM의 <ins> 노드 자체는 재사용된다(리마운트되는 건 React 컴포넌트
 * 인스턴스뿐, key가 바뀌지 않는 한 실제 DOM은 그대로다). 그래서 같은
 * <ins>에 push({})가 두 번 불려 adsbygoogle의 "already have ads in
 * it" TagError가 났다. key={pathname}은 "경로가 바뀔 때" 리마운트를
 * 막아주는 것이지, 이 StrictMode 이중 호출까지는 막지 못한다. cleanup
 * 에서 리셋하지 않는 ref로 "이미 push했는지"를 기억해두면, 같은 마운트
 * 사이클의 두 번째 호출은 조용히 스킵된다.
 */
function AdBannerInner() {
  const hasPushedRef = useRef(false);

  useEffect(() => {
    if (hasPushedRef.current) return;
    hasPushedRef.current = true;
    try {
      const w = window as WindowWithAdsbygoogle;
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle.js가 아직 로드되지 않았거나(afterInteractive라
      // 타이밍이 보장되지 않음) 광고 차단기로 막힌 경우 — 조용히
      // 무시한다. 이 배너는 부가 요소라 페이지 기능에 영향이 없어야
      // 한다.
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-5218488202760893"
      data-ad-slot="7970077598"
      // "auto"에서 "horizontal"로 변경 — 처음 나온 광고가 정사각형에
      // 가까운 비율로 채워져서, 구글에 긴 배너 형태를 우선해달라고
      // 요청한다. 어디까지나 힌트일 뿐 100% 보장되지는 않는다(구글이
      // 상황에 따라 다른 비율로 채울 수 있다).
      data-ad-format="horizontal"
      data-full-width-responsive="true"
    />
  );
}

export default function AdBanner() {
  const pathname = usePathname();
  const isFullscreen = useIsFullscreen();

  if (isFullscreen) {
    return null;
  }

  return (
    <div className="mt-4 w-full max-w-3xl">
      <AdBannerInner key={pathname} />
    </div>
  );
}
