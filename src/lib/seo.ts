import type { Metadata } from "next";

export const SITE_URL = "https://time.gentlemanvibe.com";
export const SITE_NAME = "GentlemanVibe Time";

type PageMetadataInput = {
  title: string;
  description: string;
  /** 루트 기준 경로 (예: "/pomodoro"). 홈은 "" */
  path: string;
};

/** 페이지별 title/description에서 canonical + OG + Twitter Card 메타데이터까지 한 번에 생성한다 */
export function buildMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
