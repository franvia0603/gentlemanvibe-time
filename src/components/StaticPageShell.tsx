import type { ReactNode } from "react";

type StaticPageShellProps = {
  title: string;
  children: ReactNode;
};

/**
 * About/Privacy Policy/Contact 같은 정적 콘텐츠 페이지 공통 레이아웃.
 * 도구 화면(PageShell)과 달리 가운데 정렬된 위젯이 아니라 좌측 정렬
 * 본문을 담는 읽기용 레이아웃이다.
 */
export default function StaticPageShell({
  title,
  children,
}: StaticPageShellProps) {
  return (
    <main className="min-h-screen bg-gv-matte-black px-6 pb-16 pt-28">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-normal text-gv-brand-offwhite">
          {title}
        </h1>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-gv-beige">
          {children}
        </div>
      </div>
    </main>
  );
}
