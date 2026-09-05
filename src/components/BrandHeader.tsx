export default function BrandHeader() {
  return (
    <a
      href="https://www.gentlemanvibe.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GentlemanVibe 메인 사이트로 이동"
      className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
    >
      <span className="text-xl font-extrabold tracking-[0.15em] text-gv-brand-offwhite">
        GV
      </span>
      <span className="text-[11px] font-light tracking-[0.25em] text-white">
        GentlemanVibe
      </span>
    </a>
  );
}
