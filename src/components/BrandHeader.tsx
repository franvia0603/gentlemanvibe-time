export default function BrandHeader() {
  return (
    <a
      href="https://www.gentlemanvibe.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GentlemanVibe 메인 사이트로 이동"
      className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 flex-col items-center gap-0.5 text-gv-brand-offwhite/50 transition-colors hover:text-gv-brand-offwhite/80"
    >
      <span className="text-sm font-thin tracking-[0.3em]">GV</span>
      <span className="text-[10px] font-thin tracking-[0.25em]">
        GentlemanVibe
      </span>
    </a>
  );
}
