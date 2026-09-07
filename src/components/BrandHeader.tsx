export default function BrandHeader() {
  return (
    <a
      href="https://www.gentlemanvibe.com"
      target="_blank"
      rel="noopener noreferrer"
      // WCAG 2.5.3(Label in Name): 화면에 보이는 텍스트("GV",
      // "GentlemanVibe")가 접근성 이름에 그대로 포함되어야 한다 —
      // 이전엔 aria-label이 그 텍스트를 다른 문구로 완전히
      // 대체해버려서, 음성 명령으로 "GV 클릭"이라고 말해도 이
      // 링크의 접근성 이름과 일치하지 않는 문제가 있었다(Lighthouse
      // 접근성 감사에서 지적됨).
      aria-label="GV GentlemanVibe — 메인 사이트로 이동"
      className="flex flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
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
