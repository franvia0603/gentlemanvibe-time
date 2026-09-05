import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPageShell title="Privacy Policy">
      <p className="text-xs text-gv-titanium">최종 수정일: 2026년 9월 6일</p>

      <p>
        GentlemanVibe Time(time.gentlemanvibe.com, 이하 &ldquo;본
        서비스&rdquo;)은 이용자의 개인정보를 소중히 여기며, 아래와 같은
        원칙으로 운영됩니다.
      </p>

      <h2 className="mt-2 text-base font-normal text-gv-brand-offwhite">
        1. 수집하는 정보
      </h2>
      <p>
        본 서비스는 별도의 회원가입이나 로그인을 요구하지 않으며, 서버에
        개인 식별 정보를 저장하지 않습니다.
      </p>

      <h2 className="mt-2 text-base font-normal text-gv-brand-offwhite">
        2. 브라우저 로컬 저장소(localStorage) 사용
      </h2>
      <p>
        클락 표시 설정, 타이머 프리셋, 월드클락에 추가한 도시 목록 등은
        이용자의 브라우저에만 저장되며, 본 서비스 서버로 전송되지 않습니다.
        브라우저 설정에서 언제든 삭제할 수 있습니다.
      </p>

      <h2 className="mt-2 text-base font-normal text-gv-brand-offwhite">
        3. 위치 정보(선택 기능)
      </h2>
      <p>
        날씨 표시 기능을 켜신 경우에만 브라우저의 위치 권한을 요청하며, 이
        정보는 날씨 조회를 위해 Open-Meteo API에 일회성으로 전달될 뿐
        저장되지 않습니다. 위치 권한을 거부하셔도 다른 모든 기능은 정상적으로
        이용하실 수 있습니다.
      </p>

      <h2 className="mt-2 text-base font-normal text-gv-brand-offwhite">
        4. 쿠키 및 광고
      </h2>
      <p>
        본 서비스는 향후 Google AdSense를 통한 광고를 게재할 수 있으며,
        Google 및 광고 파트너는 쿠키를 사용해 관심 기반 광고를 제공할 수
        있습니다. Google의 광고 개인정보 처리방침은{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gv-amber underline underline-offset-2"
        >
          policies.google.com/technologies/ads
        </a>
        에서 확인하실 수 있습니다.
      </p>

      <h2 className="mt-2 text-base font-normal text-gv-brand-offwhite">
        5. 제3자 서비스
      </h2>
      <p>
        본 서비스는 Vercel(호스팅), Open-Meteo(날씨 정보 제공)를 이용하며,
        각 서비스의 자체 개인정보처리방침이 적용될 수 있습니다.
      </p>

      <h2 className="mt-2 text-base font-normal text-gv-brand-offwhite">
        6. 문의
      </h2>
      <p>
        개인정보 관련 문의사항은{" "}
        <a
          href="mailto:novamedia101@gmail.com"
          className="text-gv-amber underline underline-offset-2"
        >
          novamedia101@gmail.com
        </a>
        으로 연락해 주세요.
      </p>

      <h2 className="mt-2 text-base font-normal text-gv-brand-offwhite">
        7. 정책 변경
      </h2>
      <p>
        본 방침은 서비스 개선에 따라 변경될 수 있으며, 변경 시 본 페이지를
        통해 공지합니다.
      </p>
    </StaticPageShell>
  );
}
