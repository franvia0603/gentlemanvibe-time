"use client";

import Link from "next/link";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

const LEGAL_LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact Us" },
] as const;

/**
 * 모든 페이지 하단에 공통으로 노출되는 푸터.
 * 일반 흐름(normal flow) 요소로 배치한다 — fixed로 고정하면
 * FullscreenHint 때 겪었던 것과 같은 종류의 문제(스크롤 중인 콘텐츠와
 * 겹침)가 재발할 수 있어 애초에 그럴 여지가 없는 구조를 택한다.
 */
export default function SiteFooter() {
  const isFullscreen = useIsFullscreen();

  return (
    <footer className="w-full px-4 py-4 text-center">
      <p className="text-xs font-normal text-gv-titanium">
        © 2026 GentlemanVibe. All rights reserved.
      </p>
      {!isFullscreen && (
        <nav
          aria-label="정책 링크"
          className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-normal text-gv-titanium transition-colors hover:text-gv-beige"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </footer>
  );
}
