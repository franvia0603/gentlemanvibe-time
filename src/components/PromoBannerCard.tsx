import type { ReactNode } from "react";
import Link from "next/link";

type PromoBannerCardProps = {
  href: string;
  external?: boolean;
  ariaLabel: string;
  icon: ReactNode;
  /** 좌측 원형 아이콘 배지 배경색 — 배너마다 고유색이라 디자인 토큰이
   * 없는 일회성 값들이다(Tailwind 임의값으로 처리). */
  iconBgClassName: string;
  eyebrow: string;
  /** 깜빡이는 점의 배경색 클래스(예: "bg-gv-timer-red") */
  eyebrowDotClassName: string;
  /** eyebrow 라벨 텍스트 색 클래스(예: "text-gv-timer-red") */
  eyebrowTextClassName: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaClassName: string;
};

/**
 * spec 3.4.4 — 교차 홍보 배너 2종(뽀모도로 바로가기, 젠틀맨바이브)이
 * 공유하는 카드 뼈대. 좌측 원형 아이콘 + 우측 텍스트(깜빡이는 eyebrow
 * 라벨 + 제목 + 부제목) + 우측 끝 알약형 CTA, 가로 정렬 카드.
 *
 * 내부 이동(href가 "/"로 시작)이면 next/link로 SPA 네비게이션하고,
 * 외부 링크는 새 탭으로 연다. 카드 전체가 클릭 가능한 하나의 링크다 —
 * CTA 텍스트는 시각적 강조일 뿐 별도 버튼이 아니다(중첩 인터랙티브
 * 엘리먼트를 피해 접근성 트리를 단순하게 유지).
 */
export default function PromoBannerCard({
  href,
  external = false,
  ariaLabel,
  icon,
  iconBgClassName,
  eyebrow,
  eyebrowDotClassName,
  eyebrowTextClassName,
  title,
  subtitle,
  ctaLabel,
  ctaClassName,
}: PromoBannerCardProps) {
  const content = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBgClassName}`}
      >
        {icon}
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${eyebrowDotClassName} animate-pulse`}
            aria-hidden="true"
          />
          <span
            className={`text-[10px] font-normal uppercase tracking-[0.2em] ${eyebrowTextClassName}`}
          >
            {eyebrow}
          </span>
        </span>
        {/* 제목은 잘리면 안 되는 핵심 문구라 truncate하지 않는다 —
            모바일에서 한 줄에 안 들어가면 자연스럽게 2줄로 감싼다
            (부제목을 숨기는 것과 별개로, 제목 자체는 항상 온전히
            보여야 한다). */}
        <span className="text-sm font-normal leading-snug text-gv-beige">
          {title}
        </span>
        {/* spec 5.0.3: 모바일에서 한 줄 안에 안 들어가는 부제목은
            숨긴다(잘리거나 줄바꿈으로 카드가 무너지는 대신 완전히
            생략) — sm 이상에서만 노출. */}
        <span className="hidden truncate text-xs font-normal text-gv-titanium sm:block">
          {subtitle}
        </span>
      </span>

      <span
        className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-normal ${ctaClassName}`}
      >
        {ctaLabel}
      </span>
    </>
  );

  // mt-6: PageShell은 형제 요소 사이에 공통 gap을 두지 않고 각
  // 컴포넌트가 스스로 위쪽 여백을 책임지는 구조다(UsageGuide/
  // TimeStoriesWidget의 pt-10, ShareButtons의 pt-6와 같은 패턴) —
  // 이 카드도 margin 없이 두면 바로 앞 요소, 그리고 배너①/②끼리도
  // 완전히 붙어버린다.
  const className =
    "mt-6 flex w-full max-w-3xl items-center gap-3 rounded-[10px] border px-4 py-3 transition-opacity hover:opacity-90";
  const style = {
    backgroundColor: "#1c1c1e",
    borderColor: "#33272b",
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className} style={style}>
      {content}
    </Link>
  );
}
