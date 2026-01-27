# Invisible Works - 프로젝트 통합 문서

> **Last Updated**: 2026-01-26  
> 이 문서는 프로젝트의 모든 핵심 정보를 통합한 문서입니다.

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [브랜드 아이덴티티](#2-브랜드-아이덴티티)
3. [컬러 시스템](#3-컬러-시스템)
4. [아키텍처](#4-아키텍처)
5. [컴포넌트 사용법](#5-컴포넌트-사용법)
6. [Liquid Glass 구현](#6-liquid-glass-구현)
7. [개발 진행 상황](#7-개발-진행-상황)
8. [개발 규칙](#8-개발-규칙)

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
| Testing | Jest + React Testing Library |
| Font | Pretendard |

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
| Muted Aqua | `#7fa8c9` | 액센트, 인터랙티브 신호, orb |
| Dark Gray | `#1a1a1a` | 기본 텍스트 |
| Pure Black | `#000000` | 강조 텍스트 |

### 컬러 규칙
- 브랜드 키 컬러: **없음**
- 블루는 '신호'로만 사용
- 따뜻함은 색이 아니라 **구조와 말투**로 구현

---

## 4. 아키텍처

### Clean Architecture 구조

```
src/
├── domain/           # 비즈니스 규칙
│   ├── entities/     # 비즈니스 객체
│   └── interfaces/   # Repository 인터페이스
├── application/      # 유즈케이스
│   ├── use-cases/    # 앱 특화 로직
│   └── dto/          # Data Transfer Objects
├── infrastructure/   # 외부 연동
│   ├── repositories/ # 데이터 접근 구현
│   ├── services/     # 외부 서비스
│   └── config/       # 설정
├── presentation/     # UI 레이어
│   ├── components/
│   │   ├── common/   # AmbientBackground 등
│   │   ├── sections/ # 페이지 섹션
│   │   └── ui/       # Glass 컴포넌트들
│   ├── hooks/
│   └── styles/
└── app/              # Next.js App Router
    └── design-system/  # 디자인 시스템 페이지
```

---

## 5. 컴포넌트 사용법

### 📦 Import 방법

모든 UI 컴포넌트는 `@/presentation/components/ui`에서 import합니다.

```tsx
import {
  // 카드 & 레이아웃
  GlassCard,
  GlassDivider,
  
  // 버튼
  GlassButton,
  
  // 입력
  GlassInput,
  GlassTextarea,
  
  // 네비게이션
  Navigation,
  SideNavigation,
  
  // 유틸리티
  GlassBadge,
  Skeleton,
  FloatingCTA,
  ScrollToTop,
  
  // 애니메이션
  RevealText,
  SplitText,
  CharacterReveal,
  BlurFade,
} from '@/presentation/components/ui';

// 배경
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
```

---

### 🃏 GlassCard

흰색 배경에 아쿠아 보더로 브랜드 아이덴티티를 강조하는 카드입니다.

```tsx
// 기본 사용 (호버 시 살짝 떠오름)
<GlassCard className="p-8">
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</GlassCard>

// 정적 카드 (폼, 콘텐츠 영역)
<GlassCard className="p-8" hover={false}>
  <form>...</form>
</GlassCard>
```

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `hover` | boolean | `true` | 호버 효과 활성화 |
| `className` | string | - | 추가 스타일 |

---

### 🔘 GlassButton

리플 효과가 내장된 Glass 버튼입니다. 클릭 시 물결 효과가 자동 적용됩니다.

```tsx
// Outline 버튼 (기본)
<GlassButton variant="outline">
  버튼 텍스트
</GlassButton>

// Accent 버튼 (강조)
<GlassButton variant="accent">
  버튼 텍스트
</GlassButton>

// 아이콘 포함
<GlassButton variant="accent">
  메시지 보내기
  <Send className="w-4 h-4" />
</GlassButton>

// 사이즈 조절
<GlassButton variant="outline" size="sm">Small</GlassButton>
<GlassButton variant="outline" size="md">Medium</GlassButton>
<GlassButton variant="outline" size="lg">Large</GlassButton>
```

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `variant` | `'outline'` \| `'accent'` | `'outline'` | 버튼 스타일 |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | 버튼 크기 |
| `className` | string | - | 추가 스타일 |

**스타일 가이드:**
- `outline`: 일반 액션, 보조 버튼
- `accent`: CTA, 주요 액션, 제출 버튼

---

### 🏷️ GlassBadge

```tsx
// Accent 배지 (강조)
<GlassBadge variant="accent">
  <Sparkles className="w-3.5 h-3.5" />
  New Feature
</GlassBadge>

// Outline 배지
<GlassBadge variant="outline">Category</GlassBadge>

// 애니메이션 적용
<GlassBadge variant="accent" animated>
  Animated Badge
</GlassBadge>
```

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `variant` | `'accent'` \| `'outline'` | `'accent'` | 배지 스타일 |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | 배지 크기 |
| `animated` | boolean | `false` | 등장 애니메이션 |

---

### 📝 GlassInput / GlassTextarea

```tsx
// 기본 입력
<GlassInput 
  label="이름" 
  placeholder="홍길동" 
/>

// 이메일 타입
<GlassInput 
  label="이메일" 
  placeholder="hello@example.com" 
  type="email" 
/>

// 에러 상태
<GlassInput 
  placeholder="에러 상태" 
  error="올바른 이메일을 입력해주세요" 
/>

// 텍스트 영역
<GlassTextarea 
  label="메시지" 
  placeholder="프로젝트에 대해 알려주세요..." 
/>
```

---

### 🧭 Navigation

```tsx
const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
];

// 상단 네비게이션
<Navigation
  items={navItems}
  cta={{ label: '문의하기', href: '#contact' }}
/>

// 사이드 네비게이션 (데스크톱)
<SideNavigation sections={[
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
]} />
```

---

### ✨ RevealText / SplitText / CharacterReveal

스크롤 시 자연스럽게 드러나는 텍스트 애니메이션입니다.

```tsx
// RevealText - 다양한 효과
<RevealText variant="fade">페이드 등장</RevealText>
<RevealText variant="slide">슬라이드 등장</RevealText>
<RevealText variant="blur">블러 해제</RevealText>
<RevealText variant="mask">마스크 해제</RevealText>

// 호버 시 애니메이션 재실행
<RevealText variant="fade" replayOnHover>
  호버하면 다시 애니메이션
</RevealText>

// SplitText - 단어별 순차 등장
<SplitText 
  text="우리는 처음부터 다 보여주지 않습니다"
  className="text-3xl"
  replayOnHover
/>

// CharacterReveal - 글자별 순차 등장
<CharacterReveal 
  text="Invisible Works"
  className="text-4xl font-semibold"
  replayOnHover
/>
```

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `variant` | `'fade'` \| `'slide'` \| `'blur'` \| `'mask'` | `'fade'` | 애니메이션 종류 |
| `replayOnHover` | boolean | `false` | 호버 시 재실행 |
| `delay` | number | `0` | 지연 시간 (초) |

---

### 📏 GlassDivider

```tsx
<GlassDivider variant="line" />
<GlassDivider variant="dots" />
<GlassDivider variant="wave" />
<GlassDivider variant="gradient" />
```

---

### ⏳ Skeleton

블루 기가 도는 로딩 플레이스홀더입니다.

```tsx
<Skeleton width="100%" height={16} />
<Skeleton width="85%" height={16} />
<Skeleton width="70%" height={16} />
```

---

### 🎯 FloatingCTA / ScrollToTop

```tsx
// 플로팅 CTA
<FloatingCTA
  label="문의하기"
  icon={<MessageCircle className="w-5 h-5" />}
  expandItems={[
    {
      icon: <Phone className="w-4 h-4 text-[#7fa8c9]" />,
      label: '전화 상담',
      onClick: () => {},
    },
    {
      icon: <Mail className="w-4 h-4 text-[#7fa8c9]" />,
      label: '이메일 문의',
      onClick: () => {},
    },
  ]}
/>

// 스크롤 투 탑
<ScrollToTop />
```

---

### 🌊 AmbientBackground

페이지 배경에 은은한 블러 오브 효과를 추가합니다.

```tsx
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';

// 기본 사용 (lido 권장)
<AmbientBackground variant="lido" />

// 페이지 구조
export default function Page() {
  return (
    <div className="min-h-screen">
      <AmbientBackground variant="lido" />
      {/* 페이지 콘텐츠 */}
    </div>
  );
}
```

| Variant | 설명 |
|---------|------|
| `lido` | 권장. 은은한 아쿠아 오브 2개 |
| `default` | 기본 배경 |
| `subtle` | 더 약한 효과 |
| `intense` | 강한 효과 |

---

### 🎠 PortfolioMarquee (NEW)

Magic UI Marquee 기반 좌우 무한 스크롤 포트폴리오 카드입니다.

```tsx
import { PortfolioMarquee, PortfolioCard } from '@/presentation/components/ui';

// 포트폴리오 아이템 정의
const portfolioItems = [
  {
    id: '1',
    title: '프로젝트명',
    category: '웹사이트',
    imageUrl: '/portfolio/project1.jpg',
    href: '/portfolio/1',
  },
  // ...
];

// 섹션에서 사용
<PortfolioMarquee
  items={portfolioItems}
  pauseOnHover
  speed="normal"
/>
```

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `items` | PortfolioItem[] | required | 포트폴리오 아이템 배열 |
| `pauseOnHover` | boolean | `true` | 호버 시 일시정지 |
| `speed` | `'slow'` \| `'normal'` \| `'fast'` | `'normal'` | 스크롤 속도 |
| `reverse` | boolean | `false` | 역방향 스크롤 |

**주의사항:**
- 이미지는 **스톡 이미지** 사용 필수 (플레이스홀더 X)
- DB 연동 가능한 구조로 설계

---

### 📬 ContactModal (NEW)

CTA 클릭 시 모달로 표시되는 문의 폼입니다.

```tsx
import { ContactModal } from '@/presentation/components/ui';

const [isOpen, setIsOpen] = useState(false);

<button onClick={() => setIsOpen(true)}>문의하기</button>

<ContactModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `isOpen` | boolean | required | 모달 열림 상태 |
| `onClose` | () => void | required | 닫기 콜백 |

**특징:**
- 새 페이지 이동 없이 모달로 처리
- GlassInput/GlassTextarea 활용
- 배경 오버레이 클릭 시 닫힘

---

## 6. Liquid Glass 구현

### 개요
Apple WWDC 2025에서 발표된 Liquid Glass 디자인 언어를 웹에서 구현합니다.
단순한 블러(Glassmorphism)를 넘어 **유리의 광학적 특성**을 모방합니다.

### 현재 구현 (Simplified Glass)
웹 브라우저 호환성을 위해 Glassmorphism 기반으로 구현:

```css
.iw-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(127, 168, 201, 0.25);
  box-shadow:
    0 12px 40px rgba(127, 168, 201, 0.12),
    inset 0 2px 0 rgba(255, 255, 255, 0.95);
}
```

### 배경 Orb 시스템 (variant="lido")

```tsx
// AmbientBackground variant="lido"
Primary Orb:   300px, rgba(127, 168, 201, 0.25), blur(50px), top: 5%, right: 10%
Secondary Orb: 250px, rgba(127, 168, 201, 0.2), blur(50px), bottom: 10%, left: 5%
Background:    fixed, bg-white, -z-10
```

### 핵심 파라미터

| 파라미터 | 권장값 | 설명 |
|----------|--------|------|
| blur | 40-60px | 너무 높으면 원형 사라짐 |
| opacity | 0.2-0.3 | 은은한 효과 |
| size | 250-350px | 적당한 크기 |
| position | fixed | 스크롤 시 고정 (깊이감) |

---

## 7. 개발 진행 상황

### ✅ Phase 1: Foundation (완료)
- [x] Next.js 16 프로젝트 초기화
- [x] Clean Architecture 폴더 구조
- [x] shadcn/ui, framer-motion 설치
- [x] Jest + React Testing Library 설정
- [x] 테마 기본 설정

### ✅ Phase 2: Context Gathering (완료)
- [x] 브랜드 아이덴티티 정의
- [x] 컬러 시스템 정의 (#f2f8fc, #7fa8c9)
- [x] 비주얼 컨셉 정의 (Liquid Glass, 투명함)
- [x] PROJECT.md 문서화
- [x] LIQUID-GLASS.md 가이드 작성
- [x] globals.css 브랜드 컬러 적용

### ✅ Phase 3: Component Design (완료)
- [x] AmbientBackground 컴포넌트
- [x] GlassCard 컴포넌트 (단순화: bordered only)
- [x] GlassButton 컴포넌트 (단순화: outline, accent + 리플 내장)
- [x] RevealText / SplitText / CharacterReveal (replayOnHover 지원)
- [x] GlassInput / GlassTextarea
- [x] GlassNavigation
- [x] GlassBadge (단순화: accent, outline)
- [x] GlassDivider
- [x] Skeleton (블루 기)
- [x] Navigation (상단/사이드)
- [x] FloatingCTA / ScrollToTop
- [x] /design-system 페이지 완성

### ✅ Phase 3.5: Section Components (완료 - 피드백 수정 완료)
- [x] SplineEmbed - Hero 섹션용 Spline 3D 임베드
- [x] ScrollingTextReel - Problem 섹션용 무한 스크롤 텍스트 (**수정됨**: 보이지 않는 문제 해결)
- [x] TimelineBlur - Change 섹션용 타임라인 블러 효과 (**수정됨**: 원과 선 위치 정렬)
- [x] GradientHorizon - 섹션 전환용 그라데이션 지평선 (**수정됨**: 위아래 마스킹 추가)
- [x] AccordionStep - How We Do 섹션용 아코디언 스텝 (**수정됨**: "여기까지 무료 입니다" 단색 파랑)
- [x] ImageLightbox - 이미지 라이트박스 (디자인 시안 미리보기)
- [x] LargeQuote - Why We Work 섹션용 큰 타이포그래피 (**수정됨**: 3가지 안 - Apple/Cinematic/Minimal)
- [x] CTASection - CTA 섹션 (**수정됨**: 배경 없이 한 줄 텍스트)
- [x] Footer - CTA 포함 블랙 푸터 (**수정됨**: CTA+푸터 통합, 로고 이미지 추가)
- [x] Navigation - 검정 로고 좌상단 추가
- [x] /design-system 페이지에 모든 컴포넌트 쇼케이스 추가

### ✅ Phase 4: Page Development (완료)
- [x] Hero 섹션 (Spline 풀뷰포트 + Fallback)
- [x] Problem 섹션 (DialWheel + 타이포그래피)
- [x] Change 섹션 (TimelineBlur + GradientHorizon)
- [x] How We Do 섹션 (AccordionStep + DesignStepContent)
- [x] **Portfolio 섹션 (PortfolioMarquee - 2줄 Marquee 카드 갤러리)**
- [x] Why We Work Like This 섹션 (StoryQuote)
- [x] CTA + Footer (블랙 푸터, CTA 통합)
- [x] **ContactModal (문의 모달 - GlassInput/Textarea 활용)**
- [x] **/portfolio 페이지 (그리드 갤러리 + 필터링 + 라이트박스)**
- [x] Navigation에 포트폴리오 링크 추가
- [x] SideNavigation 6개 섹션 연결

### ⏳ Phase 5: Polish (대기)
- [ ] 전체 애니메이션 정리
- [ ] 반응형 최적화
- [ ] 성능 최적화
- [ ] SEO 설정
- [ ] 배포 준비

---

## 8. 개발 규칙

### TDD 준수
1. **Red**: 실패하는 테스트 먼저 작성
2. **Green**: 테스트 통과하는 최소 코드 작성
3. **Refactor**: 코드 품질 개선

### 섹션별 진행
- 한 섹션씩 확인 후 다음 진행
- 클라이언트 리뷰 후 수정

### Liquid Glass 일관성
- 모든 컴포넌트에 글래스 스타일 유지
- 투명함과 신뢰의 브랜드 컨셉 반영

### 문서 업데이트
- 변경 시 DOCS.md 동기화
- 컴포넌트 추가 시 목록 업데이트

### 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 빌드
npm run test         # 테스트
npm run lint         # 린트
```

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-26 | 프로젝트 초기화, Phase 1 완료 |
| 2026-01-26 | 브랜드 아이덴티티, 컬러 시스템 정의 |
| 2026-01-26 | Liquid Glass 구현 가이드 작성 |
| 2026-01-26 | Phase 3 완료: 모든 컴포넌트 구현 |
| 2026-01-26 | Navigation, FloatingCTA 컴포넌트 추가 |
| 2026-01-26 | MD 파일 통합 (DOCS.md) |
| 2026-01-26 | 컴포넌트 단순화 (GlassCard, GlassButton, GlassBadge) |
| 2026-01-26 | 컴포넌트 사용법 가이드 추가 |
| 2026-01-26 | Phase 3.5: 9개 섹션 컴포넌트 추가 (승인 대기) |
| 2026-01-26 | 피드백 반영: 컴포넌트 대폭 수정 (3D 룰렛, 블루 호라이즌, 블랙 푸터 등) |
| 2026-01-26 | 전체 피드백 수정 완료 - ScrollingTextReel, TimelineBlur, GradientHorizon, LargeQuote(3안), CTASection, Footer, Navigation 수정 |
| 2026-01-26 | Phase 4 시작: PortfolioMarquee, ContactModal 컴포넌트 계획 추가 |
| 2026-01-26 | 포트폴리오 섹션 및 /portfolio 페이지 계획 추가 |
| 2026-01-27 | **Phase 4 완료**: 메인 페이지 전체 구현 (7개 섹션) |
| 2026-01-27 | PortfolioMarquee 컴포넌트 구현 (Magic UI Marquee 기반) |
| 2026-01-27 | ContactModal 컴포넌트 구현 (GlassInput/Textarea 활용) |
| 2026-01-27 | /portfolio 페이지 구현 (그리드 갤러리 + 필터링 + 라이트박스) |
| 2026-01-27 | 빌드 성공 확인 |
| 2026-01-27 | Footer 풀페이지(min-h-screen) 검정 배경으로 수정 |
| 2026-01-27 | /contact 페이지 구현 (문의 폼) |
| 2026-01-27 | /privacy 페이지 구현 (개인정보 처리방침) |
| 2026-01-27 | /terms 페이지 구현 (이용약관) |