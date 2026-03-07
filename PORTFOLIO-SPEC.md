# Portfolio Implementation Spec

> Last Updated: 2026-03-07

## Overview

Replace dummy portfolio data with 23 real projects (69 design variants total).
Each project has 3 design variants (시안) that are showcased as the core value proposition:
"We deliver 3 design options — you pick one."

Source: `D:\OneDrive - 대건중학교\260216 포트폴리오\Created\portfolio\`

---

## 1. Data Structure

### Project Model
```typescript
interface PortfolioProject {
  id: string;                    // e.g. "codelab-academy"
  name: string;                  // English name: "CodeLab Academy"
  category: CategoryKey;         // Simplified category key
  industry: string;              // Original industry from manifest
  thumbnail: string;             // WebP thumbnail path (variant 001)
  designs: DesignVariant[];      // Always 3 variants
}

interface DesignVariant {
  id: string;                    // "001" | "002" | "003"
  htmlPath: string;              // "/portfolio-sites/{project-id}/{variant}/index.html"
  thumbnail: string;             // WebP thumbnail path
  colorMood: string;             // e.g. "Dark", "Warm", "Neutral"
  tone: string;                  // e.g. "Modern / Technical"
}

type CategoryKey =
  | 'education' | 'beauty' | 'brand' | 'fitness' | 'medical'
  | 'business' | 'architecture' | 'design' | 'legal'
  | 'production' | 'tech' | 'veterinary' | 'fnb';
```

### Category Labels (i18n)
| Key | ko | en | zh-CN | zh-TW |
|-----|----|----|-------|-------|
| education | 교육 | Education | 教育 | 教育 |
| beauty | 뷰티 | Beauty | 美容 | 美容 |
| brand | 브랜드 | Brand | 品牌 | 品牌 |
| fitness | 피트니스 | Fitness | 健身 | 健身 |
| medical | 의료 | Medical | 医疗 | 醫療 |
| business | 비즈니스 | Business | 商务 | 商務 |
| architecture | 건축 | Architecture | 建筑 | 建築 |
| design | 디자인 | Design | 设计 | 設計 |
| legal | 법률 | Legal | 法律 | 法律 |
| production | 영상 | Production | 影视 | 影視 |
| tech | 테크 | Tech | 科技 | 科技 |
| veterinary | 동물병원 | Veterinary | 宠物医院 | 寵物醫院 |
| fnb | 식음료 | F&B | 餐饮 | 餐飲 |
| all | 전체 | All | 全部 | 全部 |

---

## 2. Project List (23 projects)

| # | Folder | English Name | Category |
|---|--------|-------------|----------|
| 1 | 코드랩아카데미 | CodeLab Academy | education |
| 2 | 플로우잉글리시 | Flow English Studio | education |
| 3 | 메종드쉐르 | Maison de Cher | beauty |
| 4 | 아뜰리에네일 | Atelier Nail | beauty |
| 5 | 넥서스프리시전 | Nexus Precision | brand |
| 6 | 루미노우드 | Lumino Wood | brand |
| 7 | 에코라브스킨 | EcoLove Skin | brand |
| 8 | 브레스앤플로우 | Breath & Flow | fitness |
| 9 | 오블리크필라테스 | Oblique Pilates | fitness |
| 10 | 루메르클리닉 | Lumere Clinic | medical |
| 11 | 프라임모션정형외과 | Prime Motion Orthopedics | medical |
| 12 | 런치패드스페이스 | Launchpad Space | business |
| 13 | 브릿지세무회계 | Bridge Tax & Accounting | business |
| 14 | 스트래티움컨설팅 | Stratium Consulting | business |
| 15 | 스튜디오아키브 | Studio Archiv | architecture |
| 16 | 모노스페이스스튜디오 | Monospace Studio | design |
| 17 | 오브제디자인랩 | Objet Design Lab | design |
| 18 | 레가토법률사무소 | Legato Law Office | legal |
| 19 | 프레임워크스튜디오 | Framework Studio | production |
| 20 | 스펙트라AI | Spectra AI | tech |
| 21 | 벳시그니처동물의료센터 | Vet Signature Medical Center | veterinary |
| 22 | 모어닝키친 | Morning Kitchen | fnb |
| 23 | 소무다이닝 | Somu Dining | fnb |

---

## 3. File Structure (public/)

```
public/
├── portfolio-sites/              # 69 HTML sites (for iframe)
│   ├── codelab-academy/
│   │   ├── 001/
│   │   │   ├── index.html
│   │   │   └── images/
│   │   ├── 002/
│   │   └── 003/
│   ├── flow-english-studio/
│   │   ├── 001/ 002/ 003/
│   └── ... (23 projects × 3 variants)
│
└── portfolio-thumbnails/         # WebP thumbnails (optimized)
    ├── codelab-academy-001.webp
    ├── codelab-academy-002.webp
    ├── codelab-academy-003.webp
    └── ... (69 thumbnails)
```

---

## 4. Portfolio Page (`/[locale]/portfolio`)

### Layout
- Header: "Portfolio" title + description
- Category filter bar (segment buttons): All + 13 categories
- Grid: 23 project cards (3-col desktop, 2-col tablet, 1-col mobile)
- Each card shows: thumbnail (variant 001), project name, category badge

### Click → Modal
- Full-screen modal with backdrop blur
- Top: Project name + category badge
- Variant selector: 3 tabs (Design A / B / C) with small thumbnails
- Main area: iframe rendering selected variant's index.html
- Viewport toggle bar: Desktop (1280px) / Tablet (768px) / Mobile (375px)
- iframe is scrollable, showing the actual responsive site
- Close button (X) top-right

### Viewport Toggle Design
- Segment control bar above iframe
- Icons: Monitor / Tablet / Phone
- Clicking resizes iframe width with smooth animation
- iframe container has device-frame styling (rounded corners, shadow)

---

## 5. Home Page — PortfolioMarquee

- Replace dummy data with real 23 projects
- Randomly pick 10 for marquee display (shuffle on mount)
- Use variant 001 thumbnail for each
- Click → navigate to `/[locale]/portfolio` (with project pre-selected via query param)

---

## 6. Home Page — Process Section (DesignStepContent)

### Current State
- 3 stock images in a row, click → lightbox

### New Design
- **Segment buttons** at top: 6 representative categories
  - Education / Beauty / Medical / Business / F&B / Tech
- Clicking a category → smooth transition to that category's representative project
- Below segment: project name display
- **3 variant thumbnails** side by side (Design A / B / C)
- Click any thumbnail → modal with iframe (same as portfolio page modal)
- Viewport toggle included in modal

### Representative Projects per Category (for Process section)
| Category | Project | Reason |
|----------|---------|--------|
| Education | CodeLab Academy | Strong dark theme, technical feel |
| Beauty | Maison de Cher | Luxury, elegant |
| Medical | Lumere Clinic | Clean, professional |
| Business | Stratium Consulting | Premium corporate |
| F&B | Somu Dining | Sophisticated dining |
| Tech | Spectra AI | Modern, gradient |

---

## 7. Image Processing Pipeline

1. **Source**: `Created/portfolio/screenshots/*.png` (69 files, ~323MB)
2. **Process**: Resize to 800px width → Convert to WebP (quality 80)
3. **Output**: `public/portfolio-thumbnails/` (~10MB total)
4. **Naming**: `{project-id}-{variant}.webp` (e.g. `codelab-academy-001.webp`)

---

## 8. Design System Compliance

| Element | Spec |
|---------|------|
| Card bg | `bg-white/85 backdrop-blur-xl` |
| Border | `border-2 border-[#7fa8c9]/15` |
| Hover border | `border-[#7fa8c9]/30` |
| Shadow | `shadow-[0_8px_32px_rgba(127,168,201,0.08)]` |
| Accent color | `#7fa8c9` (signal use only) |
| Text primary | `#1a1a1a` |
| Background | `#f2f8fc` / `#FFFFFF` |
| Font | Pretendard (ko), Inter (en), Noto Sans SC/TC (zh) |
| Animation | Framer Motion |
| Icons | Lucide React only |
| Glass morphism | Consistent with existing components |

---

## 9. Technical Notes

- HTML files use Tailwind CDN (`cdn.tailwindcss.com`) — works in iframe
- Images use relative paths (`./images/`) — works when served from correct directory
- No CORS issues since iframe serves from same origin
- Viewport toggle changes iframe container width, not the iframe's internal viewport
  - Desktop: `max-w-[1280px] w-full`
  - Tablet: `max-w-[768px]`
  - Mobile: `max-w-[375px]`
- iframe height: `calc(80vh - header)` with internal scroll
