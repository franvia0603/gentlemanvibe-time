export default function BrandHeader() {
  return (
    <a
      href="https://www.gentlemanvibe.com"
      target="_blank"
      rel="noopener noreferrer"
      // WCAG 2.5.3(Label in Name): 화면에 보이는 텍스트가 접근성
      // 이름에 그대로 포함되어야 한다 — 이전엔 aria-label이 그
      // 텍스트를 다른 문구로 완전히 대체해버려서, 음성 명령으로
      // "GV 클릭"이라고 말해도 이 링크의 접근성 이름과 일치하지
      // 않는 문제가 있었다(Lighthouse 접근성 감사에서 지적됨). "GV"와
      // "GentlemanVibe"가 각각 별개의 <span>이라 실제 렌더링된
      // 텍스트는 사이 공백 없이 "GVGentlemanVibe"로 이어진다 — 접근성
      // 이름도 정확히 그 부분 문자열을 포함하도록 공백 없이 붙인다.
      aria-label="GVGentlemanVibe — 메인 사이트로 이동"
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
