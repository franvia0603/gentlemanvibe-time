export interface CityInfo {
  /** IANA 타임존 문자열을 그대로 고유 id로 사용 */
  id: string;
  label: string;
}

// 지역별로 고르게 분포한 주요 도시 목록 (추가 후보)
export const CITY_CATALOG: CityInfo[] = [
  { id: "Asia/Seoul", label: "서울" },
  { id: "Asia/Tokyo", label: "도쿄" },
  { id: "Asia/Shanghai", label: "베이징" },
  { id: "Asia/Hong_Kong", label: "홍콩" },
  { id: "Asia/Singapore", label: "싱가포르" },
  { id: "Asia/Bangkok", label: "방콕" },
  { id: "Asia/Kolkata", label: "뭄바이" },
  { id: "Asia/Dubai", label: "두바이" },
  { id: "Europe/Istanbul", label: "이스탄불" },
  { id: "Europe/Moscow", label: "모스크바" },
  { id: "Europe/London", label: "런던" },
  { id: "Europe/Paris", label: "파리" },
  { id: "Europe/Berlin", label: "베를린" },
  { id: "Europe/Rome", label: "로마" },
  { id: "Europe/Madrid", label: "마드리드" },
  { id: "Europe/Amsterdam", label: "암스테르담" },
  { id: "Africa/Cairo", label: "카이로" },
  { id: "Africa/Johannesburg", label: "요하네스버그" },
  { id: "America/New_York", label: "뉴욕" },
  { id: "America/Chicago", label: "시카고" },
  { id: "America/Denver", label: "덴버" },
  { id: "America/Los_Angeles", label: "로스앤젤레스" },
  { id: "America/Toronto", label: "토론토" },
  { id: "America/Mexico_City", label: "멕시코시티" },
  { id: "America/Sao_Paulo", label: "상파울루" },
  { id: "Australia/Sydney", label: "시드니" },
  { id: "Australia/Melbourne", label: "멜버른" },
  { id: "Pacific/Auckland", label: "오클랜드" },
  { id: "Pacific/Honolulu", label: "호놀룰루" },
];

export const SEOUL_TIMEZONE = "Asia/Seoul";

export const DEFAULT_CITY_IDS = [
  "Asia/Seoul",
  "Asia/Tokyo",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Australia/Sydney",
  "Asia/Dubai",
  "America/Los_Angeles",
];

export function getCityInfo(id: string): CityInfo | undefined {
  return CITY_CATALOG.find((city) => city.id === id);
}
