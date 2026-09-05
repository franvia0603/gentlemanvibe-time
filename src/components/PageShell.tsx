import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

/**
 * 모든 도구 화면이 공유하는 표준 레이아웃.
 * 상단은 고정된 BrandHeader/ModeNav(약 96px), 하단은 고정된
 * FullscreenHint(약 80px)를 위한 안전 여백을 항상 확보해서,
 * 화면 콘텐츠가 커지거나 뷰포트가 좁아져도 두 고정 UI와 겹치지 않게 한다.
 */
export default function PageShell({ children }: PageShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gv-matte-black px-8 pb-20 pt-24">
      {children}
    </main>
  );
}
