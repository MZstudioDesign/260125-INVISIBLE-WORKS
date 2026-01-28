# Invisible Works - Project Instructions

> **Last Updated**: 2026-01-29

---

## 📖 문서 구조

| 파일 | 설명 |
|------|------|
| **CLAUDE.md** | 📌 이 파일 - 프로젝트 가이드, 구조, 규칙 |
| **DOCS.md** | 📚 통합 문서 (브랜드, 컬러, 컴포넌트 상세, 진행상황) |
| **SECTIONS.md** | 📄 섹션별 기획서 (의도, 연출, 카피) |
| **BUSINESS-CARD-TEMPLATES.md** | 🎨 명함 PDF 생성기 템플릿 가이드 |
| **plan.md** | 📋 견적서 시스템 개선 계획 |
| **README.md** | 📄 GitHub용 프로젝트 소개 |

---

## 🚀 Quick Start

```bash
npm run dev          # http://localhost:3000
npm run build        # 정적 빌드 (out/ 폴더)
npm run lint         # ESLint 검사
```

---

## 📱 페이지 구조 (다국어)

> 모든 페이지는 `/[locale]/...` 형태로 접근 (예: `/ko/contact`, `/en/contact`)
> 지원 언어: `ko`, `en`, `zh-CN`, `zh-TW`

| 경로 | 설명 | 상태 |
|------|------|------|
| `/[locale]` | 메인 페이지 (7개 섹션) | ✅ PC/모바일/다국어 완료 |
| `/[locale]/portfolio` | 포트폴리오 갤러리 | ✅ PC/모바일/다국어 완료 |
| `/[locale]/contact` | 문의 폼 (5단계 Wizard) | ✅ PC/모바일/다국어 완료 |
| `/[locale]/design-system` | 디자인 시스템 데모 | ✅ 완료 |
| `/[locale]/tools/business-card` | 명함 PDF 생성기 | ✅ 완료 |
| `/[locale]/tools/quote` | 견적서 PDF 생성기 | 🔄 개선 중 (plan.md 참고) |
| `/[locale]/privacy` | 개인정보 처리방침 | ✅ 완료 |
| `/[locale]/terms` | 이용약관 | ✅ 완료 |

### 메인 페이지 섹션 구성

```
1. Hero        - Spline 3D (PC/모바일 별도 URL)
2. Problem     - DialWheel + 텍스트 (검정 배경)
3. Change      - TimelineBlur + GradientHorizon
4. How We Do   - AccordionStep (3단계, "여기까지 무료" 하이라이트)
5. Portfolio   - PortfolioMarquee (2줄 무한 스크롤)
6. Why         - ScrollStory (스크롤 고정 PPT 스타일)
7. Footer      - CTA + 블랙 푸터
```

### Contact 페이지 (5단계 Wizard)

```
Step 1: 업종 선택 (8개 옵션 + 직접 입력)
Step 2: 웹사이트 목적 선택 (5개 옵션)
Step 3: 현재 보유 자산 (6개 체크박스, 복수 선택)
Step 4: 견적 경험 여부 (선택 시 피드백 멘트 표시)
Step 5: 연락처 입력 (문자/이메일/전화)
완료 화면: 링크 추가 + 메모 입력란 + 홈으로 버튼
```

- **레이아웃**: PC 50:50 (좌: 검정/제목, 우: 흰색/폼), 모바일: 단일 컬럼
- **번역**: 컴포넌트 내부 translations 객체로 4개 언어 지원
- **키보드**: Enter로 다음, Esc로 이전
- **저장**: localStorage에 진행 상황 자동 저장

### 견적서 시스템 (`/[locale]/tools/quote`)

> **상세 계획**: `plan.md` 참고

**구분**:
| 유형 | 용도 | 특징 |
|------|------|------|
| **간단 견적서** | 대략 견적 제시용 | 범위 금액, 서버/도메인 미정 옵션 |
| **세부 견적서** | 실제 청구용 | 확정 금액, 분할 결제, 2페이지(약관) |

**비용 구조** (지침서 기준):
```
페이지 제작비:
- 1~15 블록: 40만원
- 15~30 블록: 50만원
- 30~45 블록: 60만원
- 45 초과: 2페이지당 +3만원

UIUX: 화려 → 1.2배
기능: 게시판 +10만, 쇼핑 +20만 (상품 20개 초과 시 1개당 +1만)
서버: 1년 15만 / 2년 25만 / 3년 30만
도메인: 신규 연 3만, 이전 +3만
```

**분할 결제**:
- 기본: 선금 100%
- 2분할: 착수금/잔금 (% 조정 가능)
- 3분할: 착수금/중도금/완료금 (% 조정 가능)

**관리자 설정**: 토글 버튼으로 비용 설정 패널 열기

---

## 🎨 브랜드 핵심

> "우리는 처음부터 다 보여주지 않습니다."

| 항목 | 값 |
|------|-----|
| 컨셉 | 투명함 (Transparency) |
| 스타일 | Liquid Glass |
| 키 컬러 | `#7fa8c9` (Muted Aqua) - 신호용으로만 사용 |
| 배경 | `#f2f8fc` (Soft Blue), `#FFFFFF` |
| 텍스트 | `#1a1a1a` (Dark Gray) |

---

## 🧩 컴포넌트 Import

```tsx
// UI 컴포넌트
import {
  GlassCard, GlassButton, GlassBadge, GlassInput, GlassTextarea, GlassDivider,
  Navigation, Footer,
  RevealText, HighlightReveal,
  DialWheel, TimelineBlur, GradientHorizon,
  AccordionStep, DesignStepContent,
  PortfolioMarquee, ScrollStory,
  Marquee, SplineEmbed,
} from '@/presentation/components/ui';

// 배경
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';

// 명함 생성기
import {
  BusinessCardGenerator,
  BusinessCardPreview,
  BusinessCardForm,
  TemplateSelector,
  LogoDropzone,
  ColorPicker,
} from '@/presentation/components/business-card';
```

### 자주 쓰는 컴포넌트

| 컴포넌트 | 용도 | 예시 |
|----------|------|------|
| `GlassCard` | 카드 컨테이너 | `<GlassCard className="p-8" hover={false}>` |
| `GlassButton` | 버튼 | `variant="outline"` / `variant="accent"` |
| `GlassBadge` | 라벨/태그 | `<GlassBadge>Process</GlassBadge>` |
| `HighlightReveal` | 텍스트 하이라이트 | `<HighlightReveal color="#7fa8c9">강조</HighlightReveal>` |
| `DialWheel` | 회전 텍스트 | `showIndicator={false}` 로 화살표 숨김 |
| `ScrollStory` | PPT 스타일 스크롤 | slides prop으로 내용 전달 |
| `Marquee` | 무한 스크롤 | `speed="normal"`, `pauseOnHover`, `reverse` |

---

## 📐 모바일 최적화 규칙

### 반응형 줄바꿈 패턴

```tsx
// 방법 1: 조건부 렌더링
<span className="md:hidden">모바일<br />텍스트</span>
<span className="hidden md:inline">PC 텍스트</span>

// 방법 2: break-keep (한국어 단어 단위 줄바꿈)
<p className="break-keep">한국어 텍스트는 단어 중간에서 안 끊김</p>

// 방법 3: break-all (URL 등 긴 문자열)
<p className="break-all">https://very-long-url.com/...</p>
```

### 모바일 전용 설정

| 항목 | PC | 모바일 |
|------|-----|--------|
| Spline URL | `hoverscrolleffect-0t0T7vh0ZeR3YDGt5l8LNDFw` | `hoverscrolleffect-IzHoBaO7ENQvu6w2kOuUGAfj` |
| DialWheel 화살표 | `showIndicator={true}` | `showIndicator={false}` |
| 네비 로고 높이 | `h-5` | `h-2.5` |
| Footer 로고 위치 | 중앙 | 맨 아래 |
| CTA 화살표 | 텍스트 옆 | 텍스트 위 |

---

## ⚠️ 자주 하는 요청 & 규칙

### 1. 컴포넌트 수정 시
- **메인 페이지에서 prop 오버라이드 금지** → 컴포넌트 default 값 수정
- 예: `speed={750}` 같은 prop은 컴포넌트 내부 default로

### 2. 텍스트 수정 시
- 한국어는 `break-keep` 필수
- 모바일 줄바꿈은 `<br className="md:hidden" />` 사용
- URL이 있는 곳은 `break-all`

### 3. 새 컴포넌트 추가 시
1. `src/presentation/components/ui/` 에 파일 생성
2. `index.ts`에 export 추가
3. `design-system` 페이지에 데모 추가
4. DOCS.md 컴포넌트 목록 업데이트

### 4. 색상 사용 규칙
- 키 컬러 `#7fa8c9`는 **신호용**으로만 (CTA, 강조, 인터랙션)
- 일반 텍스트는 `#1a1a1a` 또는 `text-[#1a1a1a]/60`
- 배경은 `#f2f8fc` 또는 `white`

### 5. 전화번호 노출 금지
- 모든 페이지에서 개인 전화번호 노출 제거
- 연락처는 이메일만 (`mzstudio104@gmail.com`)

### 6. 디자인 통일
- `/design-system` 페이지 스타일 참고
- Pretendard 폰트
- 모노톤 블랙/화이트 기조
- 브루탈리스트/인더스트리얼 스타일

---

## 🏢 회사 정보

```
Invisible Works
대표: 오유택
사업자등록번호: 377-44-01126
이메일: mzstudio104@gmail.com
주소: 대구광역시 중구 남산동 677-58, 명륜로21길 33-11
웹사이트: invisibleworks.studio

결제 계좌:
카카오뱅크 3333-14-9478697
오유택(엠지쓰studio)
```

---

## 📁 폴더 구조

```
src/
├── app/[locale]/           # Next.js App Router (i18n)
│   ├── page.tsx            # 메인 페이지
│   ├── contact/            # 문의 페이지
│   ├── portfolio/          # 포트폴리오 페이지
│   ├── design-system/      # 디자인 시스템
│   ├── tools/
│   │   └── business-card/  # 명함 PDF 생성기
│   ├── privacy/            # 개인정보 처리방침
│   └── terms/              # 이용약관
├── presentation/
│   └── components/
│       ├── ui/             # 모든 UI 컴포넌트 (30개)
│       │   └── index.ts    # 통합 export
│       ├── business-card/  # 명함 생성기 컴포넌트
│       │   ├── templates/  # 5종 템플릿
│       │   └── index.ts
│       ├── quote/          # 견적서 생성기 컴포넌트
│       │   ├── templates/  # SimpleQuote, DetailedQuote (2페이지)
│       │   ├── QuoteForm.tsx
│       │   ├── QuotePreview.tsx
│       │   ├── QuoteGenerator.tsx
│       │   ├── QuoteSettingsPanel.tsx  # (예정) 관리자 설정
│       │   └── index.ts
│       └── common/         # AmbientBackground 등
└── lib/
    ├── utils.ts            # cn() 유틸리티
    ├── businessCard/       # 명함 타입 및 PDF 생성
    └── quote/              # 견적서 타입 및 PDF 생성
        ├── types.ts        # QuoteData, QuoteItem 등
        ├── generatePDF.ts  # PDF 생성 (다중 페이지 지원)
        ├── settings.ts     # (예정) 비용 설정 상수
        └── useQuoteSettings.ts  # (예정) 설정 상태 관리
```

---

## 🔧 개발 도구

| 도구 | 용도 |
|------|------|
| `sequential-thinking MCP` | 복잡한 로직 분석 |
| `context7 MCP` | 라이브러리 문서 조회 |
| `frontend-design skill` | UI 구현 |

---

## 📝 변경 시 체크리스트

- [ ] 컴포넌트 수정 → `index.ts` export 확인
- [ ] 모바일 테스트 → `break-keep`, 줄바꿈 확인
- [ ] 새 기능 → `design-system` 페이지에 데모 추가
- [ ] 문서 업데이트 → DOCS.md 변경 이력 추가

---

**상세 컴포넌트 사용법 → DOCS.md**
