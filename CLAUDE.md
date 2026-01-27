# Invisible Works - Project Instructions

> **Last Updated**: 2026-01-27

## 📖 문서 구조

| 파일 | 설명 |
|------|------|
| **DOCS.md** | 📚 통합 문서 (브랜드, 컬러, 아키텍처, **컴포넌트 사용법**, 진행상황) |
| **SECTIONS.md** | 📄 섹션별 기획서 (의도, 연출, 카피) |
| **README.md** | 📄 GitHub용 프로젝트 소개 |
| **전역CLAUDE.md** | ⚙️ 전역 Claude 설정 |

---

## 🚀 Quick Start

```bash
npm run dev    # http://localhost:3000
```

### 주요 페이지
- http://localhost:3000 - 메인 페이지 ✅
- http://localhost:3000/design-system - 디자인 시스템 ✅
- http://localhost:3000/portfolio - 포트폴리오 ✅
- http://localhost:3000/contact - 문의하기 ✅
- http://localhost:3000/privacy - 개인정보 처리방침 ✅
- http://localhost:3000/terms - 이용약관 ✅

---

## 🎨 Brand

> "우리는 처음부터 다 보여주지 않습니다."

- **컨셉**: 투명함 (Transparency)
- **스타일**: Liquid Glass
- **컬러**: `#f2f8fc` (Soft Blue), `#7fa8c9` (Muted Aqua), `#1a1a1a` (Dark Gray)

---

## 🧩 컴포넌트 Quick Reference

### Import
```tsx
import {
  GlassCard, GlassButton, GlassBadge,
  GlassInput, GlassTextarea, GlassDivider,
  Navigation, SideNavigation,
  FloatingCTA, ScrollToTop, Skeleton,
  RevealText, SplitText, CharacterReveal,
  // Section Components
  SplineEmbed, DialWheel, TimelineBlur,
  GradientHorizon, AccordionStep, ImageLightbox,
  LargeQuote, CTASection, Footer,
  // NEW
  PortfolioMarquee, ContactModal,
} from '@/presentation/components/ui';

import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
```

### 핵심 컴포넌트

| 컴포넌트 | 사용법 |
|----------|--------|
| `GlassCard` | `<GlassCard className="p-8">내용</GlassCard>` |
| `GlassCard (정적)` | `<GlassCard className="p-8" hover={false}>폼</GlassCard>` |
| `GlassButton (outline)` | `<GlassButton variant="outline">버튼</GlassButton>` |
| `GlassButton (accent)` | `<GlassButton variant="accent">CTA 버튼</GlassButton>` |
| `GlassBadge` | `<GlassBadge variant="accent">New</GlassBadge>` |
| `RevealText` | `<RevealText variant="fade" replayOnHover>텍스트</RevealText>` |
| `AmbientBackground` | `<AmbientBackground variant="lido" />` |
| `PortfolioMarquee` | `<PortfolioMarquee items={portfolioItems} />` |
| `ContactModal` | `<ContactModal isOpen={open} onClose={close} />` |

### 버튼 가이드
- `outline`: 일반 액션, 보조 버튼
- `accent`: CTA, 주요 액션, 제출 버튼
- **리플 효과 내장** (클릭 시 자동)

### 배지 가이드
- `accent`: 강조, 신규
- `outline`: 카테고리, 일반

---

## 📋 Status

- ✅ Phase 1-3 완료 (Foundation, Context, Components)
- ✅ Phase 3.5 완료 (Section Components - 9개)
- ✅ Phase 4 완료 (Page Development)
- ⏳ Phase 5 대기 (Polish)

---

## 🎉 구현 완료된 페이지

### 메인 페이지 (/)
7개 섹션 + 네비게이션:
1. **Hero** - Spline 3D 임베드 (풀뷰포트)
2. **Problem** - DialWheel + 타이포그래피 (블랙 배경)
3. **Change** - TimelineBlur + GradientHorizon
4. **How We Do** - AccordionStep (3단계 + 무료 강조)
5. **Portfolio** - PortfolioMarquee (2줄 Marquee)
6. **Why We Work** - StoryQuote
7. **Footer** - CTA + 블랙 푸터

### 포트폴리오 페이지 (/portfolio)
- 그리드 갤러리 (12개 아이템)
- 카테고리 필터링 (전체/웹사이트/랜딩페이지/웹앱)
- 클릭 시 라이트박스 모달

### ContactModal
- 네비게이션 CTA 클릭 시 모달
- 이름/연락처/이메일/메시지 입력
- 폼 검증 + 제출 애니메이션

---

## 🛠️ 개발 시 사용할 도구

페이지 구현 시 아래 도구들을 적극 활용:
- **sequential-thinking MCP**: 복잡한 로직 분석
- **frontend-design skill**: UI 구현
- **context7 MCP**: 컴포넌트 레퍼런스 조회
- **ui-design-system skill**: 디자인 시스템 일관성

---

**상세 사용법 및 전체 컴포넌트 목록 → DOCS.md**
