"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M4 11.5 12 4l8 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9.5V19a1 1 0 0 0 1 1h3v-5.5h4V20h3a1 1 0 0 0 1-1V9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

// spec 3.4.1: 맨 앞에 홈(집 아이콘, "/") 탭을 추가하고, 이어서
// 시간이야기 → Clock → Focus → Stopwatch → Timer → World. 기본 랜딩
// 페이지가 Focus로 바뀌면서 Focus는 "/", Clock은 "/clock"으로 이동했다.
// 홈과 Focus가 둘 다 "/"를 가리키므로 href만으로는 React key/활성 판정이
// 겹친다 — 각 항목에 고유한 id를 따로 둔다.
const MODES = [
  { id: "home", href: "/", label: "홈", Icon: HomeIcon },
  { id: "guide", href: "/guide", label: "시간이야기", Icon: GuideIcon },
  { id: "clock", href: "/clock", label: "Clock", Icon: ClockIcon },
  { id: "focus", href: "/", label: "Focus", Icon: FocusIcon },
  { id: "stopwatch", href: "/stopwatch", label: "Stopwatch", Icon: StopwatchIcon },
  { id: "timer", href: "/timer", label: "Timer", Icon: TimerIcon },
  { id: "world", href: "/world", label: "World", Icon: WorldIcon },
] as const;

function isModeActive(pathname: string, id: string, href: string) {
  // 홈과 Focus는 같은 "/"를 가리키지만, 동시에 둘 다 활성 표시되면
  // 오히려 혼란스럽다 — "/"에서는 홈만, "/pomodoro"에서는 Focus만
  // 활성 표시되도록 역할을 나눈다(둘 다 정확히 하나의 경로에만 대응).
  if (id === "home") return pathname === "/";
  if (id === "focus") return pathname === "/pomodoro";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * 데스크톱/태블릿(md 이상) 전용 압축된 한 줄 탭(spec 3.4.1). 모바일
 * 폭에서는 렌더링 자체를 하지 않는다 — 햄버거 트리거+메뉴는 별도의
 * MobileNavMenu가 담당한다(spec 3.4.3: 모바일에서 헤더를 좌-햄버거/
 * 중앙-로고/우-풀스크린토글 3분할로 재배치하려면 햄버거 트리거를
 * ModeNav에서 분리해 독립적으로 배치할 수 있어야 했다).
 */
export default function ModeNav() {
  const pathname = usePathname();
  const isFullscreen = useIsFullscreen();

  if (isFullscreen) {
    return null;
  }

  return (
    <nav
      aria-label="모드 전환"
      className="hidden items-center justify-center gap-x-3 md:flex lg:gap-x-4"
    >
      {MODES.map(({ id, href, label, Icon }) => {
        const isActive = isModeActive(pathname, id, href);
        return (
          <Link
            key={id}
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
  );
}

/**
 * 모바일(md 미만) 전용 햄버거 트리거+드롭다운. spec 3.4.3에 따라
 * SiteHeader가 이걸 화면 좌측 구석에 독립적으로 배치한다 — 우측 구석의
 * FullscreenToggle과 분리된 컴포넌트라야 서로 다른 위치에 놓을 수 있다.
 */
export function MobileNavMenu() {
  const pathname = usePathname();
  const isFullscreen = useIsFullscreen();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isFullscreen) {
    return null;
  }

  return (
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
          className="absolute left-0 top-12 z-50 flex w-48 flex-col gap-1 rounded-lg border border-gv-titanium/20 bg-gv-charcoal/95 p-2 shadow-lg"
        >
          {MODES.map(({ id, href, label, Icon }) => {
            const isActive = isModeActive(pathname, id, href);
            return (
              <Link
                key={id}
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
  );
}
