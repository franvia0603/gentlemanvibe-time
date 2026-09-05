import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "About GentlemanVibe Time",
};

export default function AboutPage() {
  return (
    <StaticPageShell title="About GentlemanVibe Time">
      <p>
        GentlemanVibe Time (time.gentlemanvibe.com)은 GentlemanVibe가 만든
        공식 데스크테리어 시계·타이머 서비스입니다.
      </p>
      <p>
        GentlemanVibe는 오디오와 인테리어를 중심으로 소리와 공간이 조화를
        이루는 라이프스타일을 소개해온 브랜드입니다. GentlemanVibe Time은 이
        감성을 그대로 이어받아, 여러분의 책상 위 서브 모니터나 태블릿이 그저
        시간을 알려주는 도구가 아니라 공간의 일부가 되도록 만들었습니다.
      </p>
      <p>
        디지털·아날로그 클락, 뽀모도로 포커스 타이머, 카운트다운 타이머,
        스톱워치, 월드 클락까지 — 회원가입이나 설치 없이 브라우저에서 바로
        사용할 수 있으며, 모든 설정은 여러분의 기기에만 저장됩니다.
      </p>
      <p>문의사항이 있으시면 Contact 페이지를 통해 언제든 연락해 주세요.</p>
    </StaticPageShell>
  );
}
