# time.gentlemanvibe.com — 프로젝트 스펙 문서

## 1. 프로젝트 개요

**컨셉**: 데스크테리어용 프리미엄 디지털/아날로그 클락 & 타이머 웹앱
**핵심 가치**: "Desk Wasting과 몰입을 동시에 만족시키는" 서브 모니터/태블릿 전용 시계
**도메인**: time.gentlemanvibe.com
**배포**: GitHub → Vercel (별도 프로젝트, 기존 gentlemanvibe.com과 분리)

---

## 2. 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js 14+ (App Router) + TypeScript | Vercel과 최적 궁합, SSG 가능 |
| 스타일 | Tailwind CSS | 다크테마/톤온톤 팔레트를 디자인 토큰으로 관리 |
| 상태관리 | Zustand 또는 React Context | 클라이언트 전용, 백엔드 없음 |
| 저장소 | localStorage (설정) + IndexedDB/idb-keyval (프리셋·랩타임 다수 저장 시) | 회원가입 없는 로컬 지속성 |
| PWA | next-pwa + manifest.json + service worker | 오프라인 동작, 홈 화면 설치 |
| 시계 렌더링 | requestAnimationFrame + Page Visibility API 재동기화 | setInterval 드리프트 방지 |
| 아날로그 시계 | SVG + CSS transform | 글로우 효과, 커스텀 컬러 적용 용이 (Canvas보다 CSS 감성 표현에 유리) |
| 사운드 | Web Audio API | 정밀한 재생 제어, 볼륨 페이드 등 |

---

## 3. 브랜드 헤더 & 사이트 구조 (Phase 1 필수 포함)

### 3.1 상단 브랜딩 (헤더)
- 위치: 사이트 상단 정중앙 + **풀스크린/Zen 모드에서도 동일하게 상단 정중앙 유지**
- 구성: "GV" 로고 텍스트(상단) + 그 아래 "GentlemanVibe" 텍스트(하단), 2단 세로 배치
- 컬러: 백색에 가까운 미색(warm off-white, 예: `#F5F1E8` 계열) — 다크 배경 위에서 은은하게 도드라지는 톤
- 기능: 클릭 시 `https://www.gentlemanvibe.com` 새 탭으로 이동하는 링크
- 톤: 눈에 띄되 튀지 않게 — 시계보다 작은 크기, 얇은 폰트 굵기로 "브랜드 워터마크"에 가깝게 처리

### 3.2 하단 푸터
- **일반 사이트 모드 하단**: 카피라이트(`© 2026 GentlemanVibe. All rights reserved.` 형식) + About GentlemanVibe / Privacy & Policy / Contact Us 링크 (구석에 작게, 애드센스 심사 대비 필수 페이지)
- **풀스크린/Zen 모드 하단**: 카피라이트 최소 표기만 유지 (About/Privacy/Contact는 일반 모드에서만 노출 — Zen 모드는 몰입이 핵심이므로 페이지 이동 링크 최소화)
- About/Privacy Policy/Contact Us는 별도 정적 페이지(`/about`, `/privacy-policy`, `/contact`)로 구현

### 3.3 사이트 기본 테마
- **다크모드가 디폴트** (라이트모드 전환 옵션은 Phase 2 이후 검토, 1단계는 다크 고정 또는 최소 토글)

---

## 4. 단계별 기능 범위 (Phased Rollout)

### Phase 1 — 코어 + 브랜드 감성 (동시 진행)
- [ ] 디지털 클락 (초저지연, 정확한 로컬 시간)
- [ ] 아날로그 클락 (SVG 기반, 디지털과 토글 전환)
- [ ] 플립 클락 애니메이션 (이징 적용, 기계적이지 않은 물리감)
- [ ] 뽀모도로 타이머 (25/5분 기본값 + 커스텀 가능)
- [ ] 커스텀 카운트다운 타이머
- [ ] 스톱워치 + 랩타임 (밀리초 단위)
- [ ] 다크 테마 디폴트 적용 (매트 블랙/차콜 베이스)
- [ ] 톤온톤 컬러 팔레트: 매트 블랙, 티타늄 그레이, 포레스트 그린, 웜 베이지, 앰버 글로우, True Black(OLED)
- [ ] 풀스크린 Zen 모드 (Fullscreen API)
- [ ] 상단 중앙 GV/GentlemanVibe 브랜드 헤더 + 메인 사이트 링크 (섹션 3.1)
- [ ] 하단 푸터: 카피라이트 + About/Privacy Policy/Contact Us 링크 (섹션 3.2)
- [ ] About / Privacy Policy / Contact Us 정적 페이지 3종
- [ ] localStorage 기반 설정 자동 저장 (마지막 테마, 마지막 타이머 값)
- [ ] PWA 기본 설정 (manifest, 아이콘, 홈 화면 설치)
- [ ] 반응형 레이아웃 (서브 모니터 가로형 최적화)
- [ ] 기본 SEO 세팅 (섹션 7 참고): 메타태그, sitemap.xml, robots.txt, 구조화 데이터

### Phase 2 — 사운드 & 확장 유틸리티
- [ ] 알람/타이머 종료음 프리셋 (시그니처 사운드 큐레이션/생성, 섹션 5 참고)
- [ ] 백색소음 재생 (비, 로파이, 카페 앰비언스)
- [ ] 월드 클락 (미니멀 그리드 레이아웃, 증권시장 스타일)
- [ ] 프리셋 다중 저장 (IndexedDB 전환)

### Phase 3 — 브랜드 연계 & 폴리시
- [ ] 시간대별(아침/오후/밤) 배경 밝기·무드톤 자동 미세 변화
- [ ] GentlemanVibe 메인 사이트 연계 링크 (하단 미니멀 텍스트)
- [ ] 성능/접근성 최종 점검 (Lighthouse 90+ 목표)

---

## 5. 디자인 방향

**한 줄 정의**: 클래식하고 심플하며, 기계적이지 않은 모던 미니멀

- **타이포그래피**: Inter / Manrope 등 휴머니스트 산세리프, 얇은 굵기 + 넓은 트래킹의 tabular-nums. 세븐세그먼트/디지털 계산기 폰트 지양. 라벨 텍스트에 세리프 소량 배합 가능 (클래식함 보강).
- **컬러 팔레트**: 매트 블랙·차콜 배경 + 앰버/웜 아이보리 글로우. 네온 시안·라임그린 등 전형적 "테크" 컬러 배제.
- **브랜드 헤더 컬러**: 백색에 가까운 미색(`#F5F1E8` 계열, warm off-white) — 시계 본체의 앰버 글로우와 톤을 맞추되 구분되도록 채도 낮은 미색 유지.
- **모션**: 플립/전환 애니메이션에 자연스러운 이징 적용 — 뚝뚝 끊기는 디지털 전환이 아닌 아날로그 기계식 물리감.
- **레이아웃**: 여백을 넉넉히 두는 미니멀 그리드. 불필요한 장식·구분선 없이 타이포와 여백만으로 위계 표현.

---

## 6. 사운드 방향

**한 줄 정의**: 일반적인 알림음이 아닌, 은은하고 특별한 브랜드 시그니처 사운드

- **알람/종료음**: AI 사운드 생성 도구(예: ElevenLabs Sound Effects)로 "부드러운 아날로그 벨, 낮은 리버브, 서두르지 않는 톤" 등 구체적 프롬프트를 줘서 브랜드 전용 사운드로 신규 제작. 기성 무료 라이브러리의 전형적 "띵동/삐삐" 사운드는 배제.
- **백색소음**: Freesound.org의 CC0 라이선스 필드 레코딩 중 후보를 선별해 별도로 청취·선택하는 프로세스로 진행 (구현 단계에서 별도 세션으로 진행 예정).
- **재생 방식**: Web Audio API로 페이드인/아웃 적용, 볼륨 조절 가능하게 구현.

---

## 7. SEO 최적화 & 애드센스 대비 (Phase 1 필수)

### 7.1 온페이지 SEO
- [ ] `<title>`, `<meta description>` 페이지별 최적화 (홈/About/Privacy/Contact 개별 설정)
- [ ] Open Graph + Twitter Card 메타태그 (SNS 공유 시 미리보기 이미지·설명 노출)
- [ ] `robots.txt` 작성 (크롤링 허용 범위 명시)
- [ ] `sitemap.xml` 자동 생성 (Next.js `sitemap.ts` 활용, 페이지 추가 시 자동 반영)
- [ ] 구조화 데이터(JSON-LD) — WebApplication 또는 SoftwareApplication 스키마 적용
- [ ] 시맨틱 HTML 구조 (h1/h2 위계, `alt` 텍스트, 접근성 랜드마크)
- [ ] canonical URL 설정
- [ ] favicon, PWA 아이콘 세트, `manifest.json`에 name/description 명시 (PWA 항목과 연동)
- [ ] Core Web Vitals 최적화 (이미지 최적화, 폰트 preload, 불필요한 JS 최소화)

### 7.2 필수 정적 페이지 (애드센스 심사 대비)
- `/about` — GentlemanVibe 브랜드 및 서비스 소개
- `/privacy-policy` — 개인정보처리방침 (쿠키/로컬스토리지 사용 고지 포함)
- `/contact` — 문의 채널 (이메일 또는 폼)

### 7.3 프로젝트 완료 후 제출 항목 (Google Search Console)
- [ ] `sitemap.xml` 최종 URL을 GSC에 제출
- [ ] GSC 소유권 확인 (DNS TXT 레코드 또는 HTML 메타태그 방식 중 선택)
- [ ] `robots.txt`에 sitemap 위치 명시 (`Sitemap: https://time.gentlemanvibe.com/sitemap.xml`)
- [ ] 색인 요청(URL 검사 도구)으로 주요 페이지 수동 색인 요청
- [ ] 향후 애드센스 신청 전 About/Privacy/Contact 페이지 실제 콘텐츠 채움 여부 최종 점검

---

## 8. 배포 절차 (Vercel + GitHub + 서브도메인)

1. GitHub에 새 리포지토리 생성 (예: `gentlemanvibe-time`)
2. Vercel에서 해당 리포지토리를 새 프로젝트로 Import
3. Vercel 프로젝트 설정 → Domains → `time.gentlemanvibe.com` 추가
4. Vercel이 안내하는 CNAME 레코드 값을 기존 `gentlemanvibe.com`을 관리 중인 DNS(가비아/카페24 등)에 등록
5. DNS 전파 확인 후 Vercel에서 도메인 활성화 확인
6. 이후 GitHub main 브랜치 push 시 자동 배포(CI/CD) 확인
7. 배포 완료 후 섹션 7.3의 GSC 제출 절차 진행

---

## 9. 미해결/추후 결정 사항

- 백색소음 최종 음원 선정 (구현 단계에서 후보 청취 후 결정)
- 월드 클락에 포함할 기본 도시 리스트
- 시간대별 무드톤 자동 변화의 구체적 색상 곡선
- Contact 페이지의 실제 연락 채널(이메일 주소 등) 확정
- GSC 소유권 확인 방식(DNS TXT vs HTML 태그) 결정
