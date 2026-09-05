"use client";

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

const MODES = [
  { href: "/", label: "Clock", Icon: ClockIcon },
  { href: "/pomodoro", label: "Focus", Icon: FocusIcon },
  { href: "/stopwatch", label: "Stopwatch", Icon: StopwatchIcon },
  { href: "/timer", label: "Timer", Icon: TimerIcon },
  { href: "/world", label: "World", Icon: WorldIcon },
] as const;

export default function ModeNav() {
  const pathname = usePathname();
  const isFullscreen = useIsFullscreen();

  if (isFullscreen) {
    return null;
  }

  return (
    <nav
      aria-label="모드 전환"
      className="fixed left-1/2 top-16 z-40 flex w-[92vw] max-w-md -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 md:gap-x-8"
    >
      {MODES.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center gap-1 text-sm font-normal tracking-wide transition-colors ${
              isActive
                ? "text-gv-amber"
                : "text-gv-titanium hover:text-gv-beige"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
