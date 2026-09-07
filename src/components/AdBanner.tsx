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
 *
 * IntersectionObserver로 지연 초기화(성능 개선, 프로덕션 Lighthouse
 * 재감사 후 추가): push({})를 호출하는 순간 adsbygoogle가 Funding
 * Choices(동의 메시지), sodar(광고 품질 검증) 등 무거운 서드파티
 * 스크립트를 추가로 끌어오는 게 실측으로 확인됐다 — 이 배너는 모든
 * 페이지에서 이미 스크롤해야 보이는 위치(도구 패널 아래)에 있는데도
 * 마운트되자마자 즉시 push하고 있어서, 이 무거운 로드가 정작 중요한
 * 초기 화면(다이얼, 시작 버튼 등)의 하이드레이션과 메인 스레드를
 * 두고 경쟁하고 있었다. <ins>가 뷰포트 300px 이내로 들어올 때만
 * push하도록 미루면, 광고 자체의 지연 로딩(spec 요구사항이던 반응형
 * 배치와는 무관)과 별개로 이 서드파티 부하 전체가 실제로 스크롤해서
 * 볼 때까지 미뤄진다.
 */
function AdBannerInner() {
  const hasPushedRef = useRef(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const push = () => {
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
    };

    const el = insRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      push();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          push();
          observer.disconnect();
        }
      },
      // rootMargin 없음(0px) — 실제로 화면에 보이기 시작할 때만
      // push한다. 처음엔 300px 여유를 뒀는데, 실측(Lighthouse
      // 재감사)해보니 초기 로드 트레이스 구간 안에서 이 여유
      // 마진만으로도 광고가 아직 스크롤하지 않은 상태에서 이미
      // 트리거되어 TBT에 그대로 잡혔다 — 정말 뷰포트에 들어올 때까지
      // 더 미루는 쪽이 낫다.
      {},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ins
      ref={insRef}
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

type AdBannerProps = {
  /**
   * spec 3.4.5(Clock 페이지 한정): 시계~버튼줄~광고 배너를 촘촘하게
   * 붙이기 위한 좁은 상단 여백. 기본값(false)은 다른 모든 페이지의
   * 기존 mt-4를 그대로 유지한다 — Clock 페이지에서만 명시적으로 켠다.
   */
  compact?: boolean;
};

export default function AdBanner({ compact = false }: AdBannerProps) {
  const pathname = usePathname();
  const isFullscreen = useIsFullscreen();

  if (isFullscreen) {
    return null;
  }

  return (
    <div className={`${compact ? "mt-2" : "mt-4"} w-full max-w-3xl`}>
      <AdBannerInner key={pathname} />
    </div>
  );
}
