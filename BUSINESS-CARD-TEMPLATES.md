# 명함 PDF 생성기 - 템플릿 가이드

> **Last Updated**: 2026-01-27

## 📍 접근 경로

```
/ko/tools/business-card
```

---

## 🎨 템플릿 5종

### 1. 미니멀 코린티안 (Minimal Corinthian)
- **무드**: Luxury, Editorial, Clean
- **기본 컬러**: `#1a1a1a`
- **특징**: 극단의 여백, 타이포그래피 중심
- **앞면**: 좌측 상단 로고 + 중앙 이름
- **뒷면**: 좌측 정렬 연락처 + 우측 하단 QR코드

### 2. 다이나믹 블록 (Dynamic Block)
- **무드**: Bold, Modern, Energetic
- **기본 컬러**: `#7fa8c9`
- **특징**: 강렬한 색면 대비, 기하학적 파티션
- **앞면**: 키컬러 바탕 + 우측 화이트 블록에 정보
- **뒷면**: 전체 키컬러 배경 + 중앙 QR코드

### 3. 깔끔한 계층 (Clean Hierarchy)
- **무드**: Corporate, Professional, Organized
- **기본 컬러**: `#2d5a7b`
- **특징**: 명확한 정보 계층, 그리드 기반 레이아웃
- **앞면**: 상단 로고/이름 + 하단 그리드 연락처
- **뒷면**: 연한 키컬러 배경 + 중앙 로고/슬로건

### 4. 도트 매트릭스 (Dot Matrix)
- **무드**: Retro, Tech, Creative
- **기본 컬러**: `#00ff88`
- **특징**: 돈트 패턴, 레트로-퓨처리즘, 네온 글로우
- **앞면**: 어두운 배경 + 돈트 패턴 + 네온 텍스트
- **뒷면**: 모노스페이스 폰트 + 글로우 QR코드

### 5. 커브 엘레강스 (Curve Elegance)
- **무드**: Artistic, Premium, Sophisticated
- **기본 컬러**: `#9b6b9e`
- **특징**: 부드러운 곡선, 유려한 그라디언트
- **앞면**: 곡선 그래픽 배경 + 비대칭 정보 배치
- **뒷면**: 그라디언트 배경 + 곡선 장식

---

## 📏 명함 규격

| 항목 | 크기 |
|------|------|
| 실제 크기 | 90mm × 50mm |
| 도련 포함 | 96mm × 56mm (3mm 사방) |
| 안전 영역 | 84mm × 44mm (내부 3mm 여백) |

---

## 🛠️ 기술 스택

| 용도 | 라이브러리 | 버전 |
|------|----------|------|
| PDF 생성 | jsPDF | ^2.5.x |
| HTML → 이미지 | html2canvas | ^1.4.x |
| 파일 업로드 | react-dropzone | ^14.x |
| QR코드 생성 | react-qr-code | ^2.x |

---

## 📁 파일 구조

```
src/
├── lib/businessCard/
│   ├── types.ts              # 타입 및 상수 정의
│   └── generatePDF.ts        # PDF 생성 유틸리티
│
├── presentation/components/business-card/
│   ├── index.ts              # 컴포넌트 export
│   ├── BusinessCardGenerator.tsx  # 메인 페이지 레이아웃
│   ├── BusinessCardPreview.tsx    # 미리보기 컴포넌트
│   ├── BusinessCardForm.tsx       # 입력 폼
│   ├── TemplateSelector.tsx       # 템플릿 선택
│   ├── LogoDropzone.tsx           # 로고 업로드
│   ├── ColorPicker.tsx            # 키컬러 선택
│   └── templates/
│       ├── index.ts
│       ├── MinimalCorinthian.tsx
│       ├── DynamicBlock.tsx
│       ├── CleanHierarchy.tsx
│       ├── DotMatrix.tsx
│       └── CurveElegance.tsx
│
└── app/[locale]/tools/business-card/
    └── page.tsx              # 페이지 라우트
```

---

## 🔧 새 템플릿 추가 방법

### 1. 템플릿 컴포넌트 생성

```tsx
// src/presentation/components/business-card/templates/NewTemplate.tsx
'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import { QRCodeSVG } from 'react-qr-code';

interface TemplateProps {
  data: BusinessCardData;
  side: 'front' | 'back';
  showBleed?: boolean;
}

export function NewTemplate({ data, side, showBleed = true }: TemplateProps) {
  const bleedPx = showBleed ? 12 : 0;
  
  const containerStyle: React.CSSProperties = {
    width: `${360 + bleedPx * 2}px`,  // 90mm * 4 scale
    height: `${200 + bleedPx * 2}px`, // 50mm * 4 scale
    padding: `${bleedPx}px`,
    fontFamily: 'Pretendard, -apple-system, sans-serif',
    position: 'relative',
  };

  if (side === 'front') {
    return (
      <div style={containerStyle}>
        {/* 앞면 디자인 */}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* 뒷면 디자인 */}
    </div>
  );
}
```

### 2. 타입 정의 추가

```typescript
// src/lib/businessCard/types.ts

// TemplateId에 새 ID 추가
export type TemplateId = 
  | 'minimal-corinthian'
  | 'dynamic-block'
  | 'clean-hierarchy'
  | 'dot-matrix'
  | 'curve-elegance'
  | 'new-template';  // 추가

// TEMPLATES 배열에 새 템플릿 정보 추가
export const TEMPLATES: TemplateInfo[] = [
  // ... 기존 템플릿들
  {
    id: 'new-template',
    name: '새 템플릿',
    description: '새 템플릿 설명',
    mood: ['Mood1', 'Mood2'],
    defaultColor: '#000000',
  },
];
```

### 3. 템플릿 인덱스에 등록

```typescript
// src/presentation/components/business-card/templates/index.ts

export { NewTemplate } from './NewTemplate';

import { NewTemplate } from './NewTemplate';

export const TEMPLATE_COMPONENTS = {
  // ... 기존 템플릿들
  'new-template': NewTemplate,
} as const;
```

---

## 🎯 디자인 가이드라인

### 필수 고려사항

1. **도련 영역**: `bleedPx` 변수로 3mm 도련 처리
2. **안전 영역**: 중요 정보는 가장자리에서 6mm 이상 떨어뜨리기
3. **QR코드**: 최소 15mm 크기, Error Correction Level "H"
4. **폰트**: Pretendard 사용 (한글 지원)

### 색상 유틸리티

```typescript
// 대비색 계산
const getContrastColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
};

// 밝은 색상 생성
const getLighterShade = (hex: string, percent: number = 30) => {
  // RGB 값에 percent만큼 밝기 추가
};
```

---

## 🔗 참고 자료

### 라이브러리 문서
- [jsPDF Documentation](https://rawgit.com/MrRio/jsPDF/master/docs/)
- [react-dropzone](https://react-dropzone.js.org/)
- [react-qr-code](https://github.com/rosskhanas/react-qr-code)
- [html2canvas](https://html2canvas.hertzen.com/)

### 디자인 영감
- Dribbble "business card design"
- Behance "minimal business card"
- Pinterest "creative business card"

---

## 📝 향후 확장 계획

- [ ] QR코드 커스터마이징 (스타일, 색상, 로고 삽입)
- [ ] 추가 템플릿 (세로형, 정사각형 등)
- [ ] 명함첩 기능 (여러 명함 저장/관리)
- [ ] 인쇄소 연동 API
- [ ] 명함 공유 링크 생성
