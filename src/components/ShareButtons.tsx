"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

type ShareButtonsProps = {
  /** 공유 카드에 쓰일 제목(X 트윗 본문, 웹 공유 API 타이틀 등) */
  title: string;
};

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
    </svg>
  );
}

function KakaoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M12 4.5c-4.7 0-8.5 3-8.5 6.75 0 2.4 1.6 4.5 4 5.75-.18.68-.65 2.4-.75 2.78-.12.47.17.46.36.34.15-.1 2.4-1.6 3.37-2.27.48.07.98.1 1.52.1 4.7 0 8.5-3 8.5-6.7s-3.8-6.75-8.5-6.75Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2H15l-.5 3H11.5v6.5h-3V15h-2v-3h2v-2.3C8.5 7.5 10 6 12.4 6H15v2.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M9.5 14.5 14.5 9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 7.5 12.3 6.2a3 3 0 0 1 4.25 4.25L15.2 11.8M13 16.5 11.7 17.8a3 3 0 0 1-4.25-4.25L8.8 12.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 도구 화면(부가 콘텐츠 영역 근처, 푸터 위)과 /guide/[slug] 글 하단에
 * 공통으로 쓰는 공유 버튼 묶음(spec 3.4.2). 풀스크린에서는 이 컴포넌트를
 * 감싸는 부모 영역 자체가 이미 숨겨지므로(3.3.1) 별도 로직이 필요 없다.
 *
 * 카카오톡 공유는 정식 Kakao SDK 없이, 웹 공유 API(navigator.share)가
 * 되는 환경(대부분의 모바일 브라우저 — OS 공유 시트에 카카오톡이 앱으로
 * 뜬다)에서는 그걸 쓰고, 안 되는 환경(대부분의 데스크톱)에서는 링크를
 * 복사해 안내한다 — 정식 SDK 연동은 다음 단계로 미룬다.
 *
 * spec 3.4.2는 "풀스크린에서는 이미 이 영역 전체가 숨는 구조라 별도
 * 처리가 필요 없다"고 가정했지만, 실제로는 UsageGuide/TimeStoriesWidget/
 * FullscreenHint 각각이 자기 자신을 useIsFullscreen()으로 개별
 * 숨기는 구조라 그런 공통 래퍼가 없다 — 그래서 이 컴포넌트도 동일한
 * 패턴으로 직접 숨긴다.
 */
export default function ShareButtons({ title }: ShareButtonsProps) {
  const isFullscreen = useIsFullscreen();
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [kakaoState, setKakaoState] = useState<"idle" | "copied">("idle");

  if (isFullscreen) {
    return null;
  }

  function getShareUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  /**
   * navigator.clipboard.writeText는 브라우저/컨텍스트에 따라 권한
   * 거부로 reject될 수 있다 — 실패해도 조용히 죽지 않도록 구식
   * document.execCommand('copy') 방식으로 한 번 더 시도한다.
   */
  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        return ok;
      } catch {
        return false;
      }
    }
  }

  function shareToX() {
    const url = getShareUrl();
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  function shareToFacebook() {
    const url = getShareUrl();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  async function shareToKakao() {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // 사용자가 공유 시트를 취소한 경우 등 — 별도 처리 없이 조용히 무시.
      }
      return;
    }
    // 웹 공유 API가 없는 환경(대부분의 데스크톱)에서는 링크를 복사해
    // 카카오톡에 직접 붙여넣도록 안내한다.
    const ok = await copyToClipboard(url);
    if (ok) {
      setKakaoState("copied");
      setTimeout(() => setKakaoState("idle"), 2000);
    }
  }

  async function copyLink() {
    const ok = await copyToClipboard(getShareUrl());
    if (ok) {
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  const buttonClassName =
    "flex flex-col items-center gap-1 text-xs font-normal text-gv-titanium transition-colors hover:text-gv-amber";
  const iconWrapClassName =
    "flex h-10 w-10 items-center justify-center rounded-full border border-gv-titanium/25 bg-gv-charcoal/70";

  return (
    <section className="w-full max-w-lg pt-6 text-left">
      <h2 className="mb-3 text-sm font-normal uppercase tracking-wide text-gv-titanium">
        공유하기
      </h2>
      <div className="flex items-start gap-5">
        <button type="button" onClick={shareToX} className={buttonClassName}>
          <span className={iconWrapClassName}>
            <XIcon className="h-4 w-4" />
          </span>
          X
        </button>

        <button
          type="button"
          onClick={shareToKakao}
          className={buttonClassName}
        >
          <span className={iconWrapClassName}>
            <KakaoIcon className="h-5 w-5" />
          </span>
          {kakaoState === "copied" ? "링크 복사됨" : "카카오톡"}
        </button>

        <button
          type="button"
          onClick={shareToFacebook}
          className={buttonClassName}
        >
          <span className={iconWrapClassName}>
            <FacebookIcon className="h-4 w-4" />
          </span>
          페이스북
        </button>

        <button type="button" onClick={copyLink} className={buttonClassName}>
          <span className={iconWrapClassName}>
            <LinkIcon className="h-4 w-4" />
          </span>
          {copyState === "copied" ? "복사됨" : "URL 복사"}
        </button>
      </div>
    </section>
  );
}
