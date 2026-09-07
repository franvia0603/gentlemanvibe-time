import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

// .trim() 방어: Vercel 대시보드 등에서 환경변수 값을 붙여넣을 때
// 실수로 끝에 개행 문자가 함께 들어가는 사고가 실제로 있었다(예:
// "G-XXXXXXXXXX\n"). 이 값은 GoogleAnalytics의 인라인 <script> 안에
// 작은따옴표 문자열 리터럴로 그대로 삽입되는데, 문자열 리터럴 안에
// 이스케이프되지 않은 실제 개행이 들어가면 SyntaxError로 그 스크립트
// 태그 전체가 조용히 실행 실패한다 — 콘솔 에러 외에는 아무 징후도
// 없어서 "GA4 실시간 데이터가 안 잡힌다"는 형태로만 뒤늦게 드러난다.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_DESCRIPTION =
  "데스크테리어용 프리미엄 디지털/아날로그 클락 & 타이머 웹앱";

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (웹 브라우저)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

// spec 3.3.2: 노치/카메라 컷아웃 기기에서 env(safe-area-inset-*)가
// 정상적으로 계산되려면 viewport-fit=cover가 먼저 설정돼 있어야 한다.
// themeColor는 PWA 설치 시 상태표시줄/작업 전환 화면 색상에 반영된다 —
// manifest.json의 theme_color와 동일한 매트 블랙으로 맞춘다.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d0d0d",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GV Time",
  },
  alternates: { canonical: SITE_URL },
  // 검색엔진 소유권 확인 태그 — 각 서치콘솔에서 발급한 값을 그대로 사용.
  other: {
    "msvalidate.01": "C50E89F7C4548F89B68EA0187DDBE7CA",
    "naver-site-verification": "9a7e04679beda7ae2e367f1e5f4f8cd0ad306a0a",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
        />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <ServiceWorkerRegister />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
