"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FocusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function StopwatchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M9 3h6" strokeLinecap="round" />
      <path d="M12 3v2.25" strokeLinecap="round" />
      <path d="M18.5 6.2l1.1-1.1" strokeLinecap="round" />
      <circle cx="12" cy="14" r="7.5" />
      <path d="M12 14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TimerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 12V4.75" strokeLinecap="round" />
      <path
        d="M12 12L17 15.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WorldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.75 12h16.5" strokeLinecap="round" />
      <path
        d="M12 3.75c2.6 2.2 2.6 14.3 0 16.5M12 3.75c-2.6 2.2-2.6 14.3 0 16.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GuideIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M4 5.5c0-.8.7-1.5 1.5-1.5H12v15H5.5c-.8 0-1.5.7-1.5 1.5V5.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v15h6.5c.8 0 1.5.7 1.5 1.5V5.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HamburgerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

// spec 3.4.1: "시간이야기"가 맨 왼쪽, 이어서 Clock/Focus/Stopwatch/Timer/
// World. 기본 랜딩 페이지가 Focus로 바뀌면서 Focus는 "/", Clock은
// "/clock"으로 이동했다.
const MODES = [
  { href: "/guide", label: "시간이야기", Icon: GuideIcon },
  { href: "/clock", label: "Clock", Icon: ClockIcon },
  { href: "/", label: "Focus", Icon: FocusIcon },
  { href: "/stopwatch", label: "Stopwatch", Icon: StopwatchIcon },
  { href: "/timer", label: "Timer", Icon: TimerIcon },
  { href: "/world", label: "World", Icon: WorldIcon },
] as const;

function isModeActive(pathname: string, href: string) {
  // "/pomodoro"는 Focus("/")와 동일한 화면을 보여주는 대체 URL이므로
  // (spec 3.4.1), 그 경로에 있을 때도 Focus 탭을 활성 상태로 표시한다.
  if (href === "/") return pathname === "/" || pathname === "/pomodoro";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function ModeNav() {
  const pathname = usePathname();
  const isFullscreen = useIsFullscreen();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isFullscreen) {
    return null;
  }

  return (
    <div className="flex flex-1 justify-center">
      {/* 데스크톱/태블릿: 압축된 한 줄 탭 (spec 3.4.1) — 아이콘/폰트/간격을
          줄여서 6개 탭이 항상 한 줄에 들어가게 하되, 터치 타깃은
          min-h-10(40px)로 유지한다. */}
      <nav
        aria-label="모드 전환"
        className="hidden items-center justify-center gap-x-3 md:flex lg:gap-x-4"
      >
        {MODES.map(({ href, label, Icon }) => {
          const isActive = isModeActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-10 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-normal tracking-wide transition-colors ${
                isActive
                  ? "text-gv-amber"
                  : "text-gv-titanium hover:text-gv-beige"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* 모바일: 압축해도 6개 탭이 한 줄에 안 들어가는 좁은 뷰포트에서는
          탭 나열 대신 햄버거 메뉴로 전환한다 — 버튼 자체는 항상 보이고,
          펼치면 6개 탭이 세로로 나열된다. */}
      <div className="relative md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gv-titanium/25 bg-gv-charcoal/70 text-gv-beige transition-colors hover:text-gv-amber"
        >
          {menuOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <HamburgerIcon className="h-5 w-5" />
          )}
        </button>

        {menuOpen && (
          <nav
            aria-label="모드 전환"
            className="absolute left-1/2 top-12 z-50 flex w-48 -translate-x-1/2 flex-col gap-1 rounded-lg border border-gv-titanium/20 bg-gv-charcoal/95 p-2 shadow-lg"
          >
            {MODES.map(({ href, label, Icon }) => {
              const isActive = isModeActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-normal transition-colors ${
                    isActive
                      ? "text-gv-amber"
                      : "text-gv-beige hover:text-gv-amber"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
