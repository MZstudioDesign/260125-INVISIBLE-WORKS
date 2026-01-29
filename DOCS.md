# Invisible Works - 프로젝트 통합 문서

> **Last Updated**: 2026-01-29
> 이 문서는 프로젝트의 모든 핵심 정보를 통합한 문서입니다.

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [브랜드 아이덴티티](#2-브랜드-아이덴티티)
3. [컬러 시스템](#3-컬러-시스템)
4. [아키텍처](#4-아키텍처)
5. [컴포넌트 목록](#5-컴포넌트-목록)
6. [컴포넌트 상세 사용법](#6-컴포넌트-상세-사용법)
7. [모바일 최적화](#7-모바일-최적화)
8. [개발 진행 상황](#8-개발-진행-상황)
9. [변경 이력](#9-변경-이력)

---

## 1. 프로젝트 개요

### 기본 정보
- **프로젝트명**: Invisible Works
- **목적**: 웹사이트 제작 서비스 회사의 웹사이트
- **프레임워크**: Next.js 16 (App Router) + TypeScript
- **스타일링**: Tailwind CSS 4 + Framer Motion

### 기술 스택
| 분류 | 기술 |
|------|------|
| Core | Next.js 16, TypeScript (strict), Tailwind CSS 4 |
| Animation | Framer Motion, CSS Animations |
| UI | Magic UI 스타일, Glassmorphism |
| 3D | Spline (Hero 섹션) |
| Font | Pretendard (KO), Inter (EN), Noto Sans SC/TC (ZH) |
| i18n | next-intl (App Router 통합) |

### 페이지 구조 (다국어)
| 경로 | 설명 |
|------|------|
| `/[locale]` | 메인 페이지 (7개 섹션) |
| `/[locale]/portfolio` | 포트폴리오 갤러리 |
| `/[locale]/contact` | 문의 폼 (5단계 Wizard) |
| `/[locale]/design-system` | 디자인 시스템 데모 |
| `/[locale]/privacy` | 개인정보 처리방침 |
| `/[locale]/terms` | 이용약관 |

**지원 언어**: `ko` (한국어), `en` (영어), `zh-CN` (중국어 간체), `zh-TW` (중국어 번체)

---

## 2. 브랜드 아이덴티티

### 핵심 문구
> "우리는 처음부터 다 보여주지 않습니다. 하지만 드러날 때는 정확합니다."

### 브랜드 선언문
> "Invisible Works는 눈에 띄는 디자인이 아니라, 스크롤할수록 신뢰가 쌓이는 디자인입니다.
> 우리는 우리 색을 보여주는 팀이 아니라, 고객의 색을 정리해주는 팀이기 때문입니다."

### 디자인 원칙
1. **따뜻함은 색이 아니라 구조와 말투로 구현**
2. **장식보다 드러나는 방식**
3. **강조보다 맥락**
4. **시각적 자극보다 신뢰의 누적**

### 비주얼 컨셉: 투명함 (Transparency)
- 물처럼 투명한 것이 Invisible Works
- 뒤에서 신뢰를 줄 수 있게 일하는 팀
- **Liquid Glass** 스타일 적극 활용

---

## 3. 컬러 시스템

### 컬러 철학
> "뮤트 블루는 '색'이 아니라 '신호'입니다."

블루는 꼭 필요한 순간에만 사용합니다. 브랜드 키 컬러는 없습니다 (고객의 색을 정리해주는 팀).

### 팔레트

| 이름 | Hex | 용도 |
|------|-----|------|
| Pure White | `#FFFFFF` | 기본 배경 |
| Soft Blue | `#f2f8fc` | 배경 그라데이션, 서브틀 필 |
| Muted Aqua | `#7fa8c9` | 액센트, 인터랙티브 신호 |
| Dark Gray | `#1a1a1a` | 기본 텍스트 |
| Pure Black | `#000000` | 강조 텍스트, Problem/Why 섹션 배경 |

### 컬러 규칙
- 브랜드 키 컬러: **없음**
- 블루는 '신호'로만 사용 (CTA, 하이라이트, 인터랙션)
- 따뜻함은 색이 아니라 **구조와 말투**로 구현

---

## 4. 아키텍처

### 폴더 구조

```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/             # 다국어 라우팅 (ko, en, zh-CN, zh-TW)
│   │   ├── page.tsx          # 메인 페이지
│   │   ├── contact/page.tsx  # 문의 페이지 (5단계 Wizard, 다국어)
│   │   ├── portfolio/page.tsx # 포트폴리오 갤러리
│   │   ├── design-system/page.tsx # 디자인 시스템
│   │   ├── privacy/page.tsx  # 개인정보 처리방침
│   │   ├── terms/page.tsx    # 이용약관
│   │   └── layout.tsx        # 다국어 레이아웃
│   ├── globals.css           # 전역 스타일
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # 리다이렉트 (→ /ko)
├── presentation/
│   └── components/
│       ├── ui/               # UI 컴포넌트 (30개)
│       │   ├── index.ts      # 통합 export
│       │   ├── GlassCard.tsx
│       │   ├── GlassButton.tsx
│       │   └── ... (28개 더)
│       └── common/
│           └── AmbientBackground.tsx
├── i18n/                     # 다국어 설정
│   ├── routing.ts
│   └── request.ts
├── lib/
│   └── utils.ts              # cn() 유틸리티
├── messages/                 # 번역 파일
│   ├── ko.json
│   ├── en.json
│   ├── zh-CN.json
│   └── zh-TW.json
└── public/
    └── user_source/
        └── logo/             # 로고 이미지
```

---

## 5. 컴포넌트 목록

### Base UI (6개)
| 컴포넌트 | 설명 |
|----------|------|
| `GlassCard` | Glass 스타일 카드 컨테이너 |
| `GlassButton` | 리플 효과 내장 버튼 |
| `GlassBadge` | 라벨/태그 |
| `GlassInput` | 입력 필드 |
| `GlassTextarea` | 텍스트 영역 |
| `GlassDivider` | 구분선 |

### Navigation (2개)
| 컴포넌트 | 설명 |
|----------|------|
| `Navigation` | 상단 네비게이션 (로고 + 링크 + CTA) |
| `SideNavigation` | 사이드 섹션 네비게이션 |

### Animation (6개)
| 컴포넌트 | 설명 |
|----------|------|
| `RevealText` | 페이드/슬라이드/블러 텍스트 애니메이션 |
| `SplitText` | 단어별 순차 등장 |
| `CharacterReveal` | 글자별 순차 등장 |
| `BlurFade` | 블러 페이드 효과 |
| `TextAnimate` | 텍스트 애니메이션 |
| `UnderlineReveal` / `HighlightReveal` | 밑줄/하이라이트 효과 |

### Section Components (12개)
| 컴포넌트 | 섹션 | 설명 |
|----------|------|------|
| `SplineEmbed` | Hero | Spline 3D 임베드 |
| `DialWheel` | Problem | 회전하는 텍스트 휠 |
| `TimelineBlur` | Change | 순차 스트라이크스루 타임라인 |
| `GradientHorizon` | Change | 그라데이션 배경 |
| `AccordionStep` | How We Do | 아코디언 스텝 |
| `DesignStepContent` | How We Do | 디자인 단계 콘텐츠 |
| `PortfolioMarquee` | Portfolio | 무한 스크롤 카드 |
| `Marquee` | 공통 | 무한 스크롤 컴포넌트 |
| `ScrollStory` | Why | 스크롤 고정 PPT 스타일 |
| `ImageLightbox` | Portfolio | 이미지 라이트박스 |
| `Footer` | Footer | CTA + 블랙 푸터 |
| `CTASection` | CTA | CTA 섹션 |

### Others (4개)
| 컴포넌트 | 설명 |
|----------|------|
| `ContactModal` | 문의 모달 |
| `PhotoStack` | 폴라로이드 스택 |
| `Skeleton` | 로딩 플레이스홀더 |
| `FloatingCTA` / `ScrollToTop` | 플로팅 버튼 |

---

## 6. 컴포넌트 상세 사용법

### Import 방법

```tsx
import {
  // Base UI
  GlassCard, GlassButton, GlassBadge, GlassInput, GlassTextarea, GlassDivider,
  // Navigation
  Navigation, SideNavigation,
  // Animation
  RevealText, SplitText, CharacterReveal, HighlightReveal,
  // Section Components
  SplineEmbed, DialWheel, TimelineBlur, GradientHorizon,
  AccordionStep, DesignStepContent, PortfolioMarquee, Marquee,
  ScrollStory, ImageLightbox, Footer, CTASection,
  // Others
  ContactModal, PhotoStack, Skeleton, FloatingCTA, ScrollToTop,
} from '@/presentation/components/ui';

import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
```

### GlassCard

```tsx
// 기본 (호버 효과 O)
<GlassCard className="p-8">
  <h3>카드 제목</h3>
</GlassCard>

// 정적 (호버 효과 X) - 폼 등에 사용
<GlassCard className="p-8" hover={false}>
  <form>...</form>
</GlassCard>
```

### GlassButton

```tsx
// Outline (기본)
<GlassButton variant="outline">버튼</GlassButton>

// Accent (CTA)
<GlassButton variant="accent">문의하기</GlassButton>

// 사이즈
<GlassButton size="sm">Small</GlassButton>
<GlassButton size="md">Medium</GlassButton>
<GlassButton size="lg">Large</GlassButton>
```

### HighlightReveal

```tsx
// 텍스트 하이라이트 효과
<p>
  그리고,{' '}
  <HighlightReveal color="#7fa8c9" delay={0.3}>
    <span className="text-[#1a1a1a]">여기까지 무료</span>
  </HighlightReveal>
  {' '}입니다.
</p>
```

### DialWheel

```tsx
// 기본 (화살표 표시)
<DialWheel showIndicator />

// 모바일용 (화살표 숨김)
<DialWheel showIndicator={false} />

// 속도 커스텀 (기본값: 750ms)
<DialWheel speed={1000} />
```

### ScrollStory

```tsx
const slides = [
  { id: 'slide-1', content: ['첫 번째 줄', '두 번째 줄'] },
  { id: 'slide-2', content: ['슬라이드 2'] },
  { id: 'slide-3', content: ['마지막'], isEnding: true },
];

<ScrollStory slides={slides} />
```

### Marquee

```tsx
<Marquee speed="normal" pauseOnHover reverse={false}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Marquee>
```

### AccordionStep

```tsx
const steps = [
  {
    id: 'step1',
    number: '01',
    title: '내용 전달',
    content: <p>설명...</p>,
  },
  // ...
];

<AccordionStep steps={steps} defaultOpenAll />
```

---

## 7. 모바일 최적화

### 줄바꿈 규칙

| 클래스 | 용도 |
|--------|------|
| `break-keep` | 한국어 단어 단위 줄바꿈 (필수) |
| `break-all` | URL 등 긴 문자열 |
| `md:whitespace-nowrap` | PC에서 한 줄 유지 |

### 반응형 줄바꿈 패턴

```tsx
// 모바일/PC 다른 줄바꿈
<span className="md:hidden">모바일<br />텍스트</span>
<span className="hidden md:inline">PC 텍스트 한 줄</span>

// 모바일에서만 줄바꿈
<br className="md:hidden" />
```

### PC/모바일 차이점

| 항목 | PC | 모바일 |
|------|-----|--------|
| Spline URL | 별도 URL | 별도 URL (모바일 최적화) |
| DialWheel 화살표 | 표시 | 숨김 |
| 네비 로고 높이 | `h-5` | `h-2.5` |
| Footer 로고 | 중앙 | 맨 아래 |
| CTA 화살표 | 텍스트 옆 | 텍스트 위 |

---

## 8. 다국어 지원 (i18n)

### 설정
- **라이브러리**: `next-intl` (App Router 통합)
- **기본 언어**: 한국어 (`ko`)
- **지원 언어**: `ko`, `en`, `zh-CN`, `zh-TW`
- **라우팅**: Prefix 방식 (`/ko/`, `/en/`, `/zh-CN/`, `/zh-TW/`)

### 언어별 폰트
| 언어 | 폰트 | CSS 클래스 |
|------|------|-----------|
| 한국어 (ko) | Pretendard Variable | `font-pretendard` |
| 영어 (en) | Inter | `font-inter` |
| 중국어 간체 (zh-CN) | Noto Sans SC | `font-noto-sc` |
| 중국어 번체 (zh-TW) | Noto Sans TC | `font-noto-tc` |

### 언어별 줄바꿈 클래스
| 언어 | 권장 클래스 | 설명 |
|------|------------|------|
| 한국어 | `break-keep` | 단어 단위 줄바꿈 |
| 영어 | `hyphens-auto` | 자동 하이픈 처리 |
| 중국어 | (기본) | 문자 단위 줄바꿈 |

### 파일 구조
```
messages/
├── ko.json       # 한국어 번역
├── en.json       # 영어 번역
├── zh-CN.json    # 중국어 간체 번역
└── zh-TW.json    # 중국어 번체 번역

src/
├── i18n/
│   ├── routing.ts    # 라우팅 설정
│   └── request.ts    # 서버 요청 설정
├── middleware.ts     # 언어 감지 미들웨어
└── app/
    └── [locale]/     # 다국어 페이지
        ├── layout.tsx
        ├── page.tsx
        └── ...
```

### 번역 사용법
```tsx
// 클라이언트 컴포넌트에서
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('Navigation');
  return <h1>{t('contact')}</h1>;
}
```

### LanguageSwitcher 컴포넌트
```tsx
import { LanguageSwitcher } from '@/presentation/components/ui';

// Navigation에 통합됨 (자동 표시)
// 별도 사용 시:
<LanguageSwitcher variant="compact" />  // 축약형 (KO, EN)
<LanguageSwitcher />                    // 전체형 (한국어, English)
```

---

## 9. 개발 진행 상황

### ✅ Phase 1-4 완료
- [x] 프로젝트 초기화
- [x] 브랜드/컬러 시스템 정의
- [x] 30개 UI 컴포넌트 구현
- [x] 메인 페이지 (7개 섹션)
- [x] 포트폴리오 페이지
- [x] 문의 페이지 (5단계 Wizard)
- [x] 개인정보/이용약관 페이지
- [x] 디자인 시스템 페이지

### ✅ Phase 5: 모바일 최적화 완료
- [x] 헤더 모바일 최적화
- [x] Problem 섹션 줄바꿈
- [x] Change 섹션 줄바꿈
- [x] DialWheel 모바일 (화살표 숨김)
- [x] Portfolio 제목 줄바꿈
- [x] Marquee 모바일 사이즈 축소
- [x] Why (ScrollStory) 모바일 최적화
- [x] CTA 모바일 레이아웃
- [x] Footer 로고 위치
- [x] Contact 페이지 모바일 최적화
- [x] 개인정보/이용약관 break-all 적용

### ✅ Phase 6: 다국어 지원 완료
- [x] next-intl 설치 및 설정
- [x] 4개 언어 번역 파일 (ko, en, zh-CN, zh-TW)
- [x] 언어별 폰트 설정 (Pretendard, Inter, Noto Sans SC/TC)
- [x] [locale] 라우팅 구조
- [x] LanguageSwitcher 컴포넌트
- [x] Navigation 언어 전환 UI
- [x] 모든 페이지 다국어 적용
- [x] design-system 폰트 섹션 추가

---

## 9. 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-26 | 프로젝트 초기화, Phase 1-3 완료 |
| 2026-01-27 | Phase 4 완료 (메인, 포트폴리오, 문의 페이지) |
| 2026-01-27 | PortfolioMarquee, ContactModal, ScrollStory 컴포넌트 추가 |
| 2026-01-27 | Marquee 컴포넌트 분리 및 design-system 추가 |
| 2026-01-27 | HighlightReveal 효과 추가 ("여기까지 무료" 하이라이트) |
| 2026-01-27 | 문의 폼 5단계 Wizard로 전면 개편 |
| 2026-01-27 | **Phase 5 완료: 전체 모바일 최적화** |
| 2026-01-27 | break-keep, 반응형 줄바꿈, Spline 모바일 URL 분리 |
| 2026-01-27 | CLAUDE.md, DOCS.md 전면 업데이트 |
| 2026-01-27 | **다국어 지원 추가: ko, en, zh-CN, zh-TW** |
| 2026-01-27 | next-intl 설정, LanguageSwitcher 컴포넌트 추가 |
| 2026-01-27 | 언어별 폰트 설정 (Pretendard, Inter, Noto Sans SC/TC) |
| 2026-01-28 | **Contact 페이지 완전 복원**: 5단계 Wizard + 완료 화면 링크/메모 |
| 2026-01-28 | Contact 페이지 다국어 완전 지원 (ko, en, zh-CN, zh-TW) |
| 2026-01-28 | 사용하지 않는 `/contact` 페이지 제거 (→ `/[locale]/contact`만 사용) |
| 2026-01-29 | **견적서 시스템 고도화**: 레거시 배송비 삭제, UI 리디자인 (`QuoteForm`) |
| 2026-01-29 | `SectionHeader` 도입 및 견적 항목 입력 UI 개선 (Accordion 스타일, Numbering) |
| 2026-01-29 | **문서 통합**: `SECTIONS.md` 내용을 `CLAUDE.md`로 통합 및 아키텍처 반영 |
