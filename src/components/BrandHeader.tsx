import Link from "next/link";

export default function BrandHeader() {
  return (
    <Link
      href="/"
      // WCAG 2.5.3(Label in Name): 화면에 보이는 텍스트가 접근성
      // 이름에 그대로 포함되어야 한다 — 이전엔 aria-label이 그
      // 텍스트를 다른 문구로 완전히 대체해버려서, 음성 명령으로
      // "GV 클릭"이라고 말해도 이 링크의 접근성 이름과 일치하지
      // 않는 문제가 있었다(Lighthouse 접근성 감사에서 지적됨). "GV"와
      // "GentlemanVibe"가 각각 별개의 <span>이라 실제 렌더링된
      // 텍스트는 사이 공백 없이 "GVGentlemanVibe"로 이어진다 — 접근성
      // 이름도 정확히 그 부분 문자열을 포함하도록 공백 없이 붙인다.
      //
      // spec 3.1(수정): 로고는 이제 외부 gentlemanvibe.com이 아니라
      // 내부 홈("/", Focus)으로 이동한다 — ModeNav에 이미 별도 "홈"
      // 탭(spec 3.4.1)이 있어 로고의 외부 연결 역할이 중복이었고,
      // 젠틀맨바이브 본사이트로의 유입은 신규 배너(spec 3.4.4,
      // GentlemanVibePromoBanner)가 대신 담당한다.
      aria-label="GVGentlemanVibe — 홈으로 이동"
      className="flex flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
    >
      <span className="text-xl font-extrabold tracking-[0.15em] text-gv-brand-offwhite">
        GV
      </span>
      <span className="text-[11px] font-light tracking-[0.25em] text-white">
        GentlemanVibe
      </span>
    </Link>
  );
}
