# Quote System Implementation Plan

> **Status**: Planning
> **Created**: 2026-01-30
> **Goal**: 견적서 페이지네이션 + 다국어 지원 + Google Sheet2 Admin Config 구현

---

## 작업 지침

### 필수 사용 도구
1. **Skills**: `frontend-design`, `senior-backend` 스킬을 활용하여 작업
2. **Context7**: 라이브러리 문서 조회 시 반드시 Context7 MCP 서버 사용
3. **TDD**: 테스트 먼저 작성 후 구현

---

## 1. 현재 상태 분석

### 1.1 견적서 관련 파일 구조
```
src/
├── lib/quote/
│   ├── settings.ts          # DEFAULT_SETTINGS (하드코딩된 금액 설정)
│   ├── types.ts              # QuoteData, QuoteItem 등 타입 정의
│   └── generatePDF.ts        # PDF 생성 (data-page 속성으로 멀티페이지 지원)
│
├── presentation/components/quote/
│   ├── QuoteGenerator.tsx    # 메인 컴포넌트 (탭 전환, PDF 다운로드)
│   ├── QuoteForm.tsx         # 입력 폼
│   ├── QuotePreview.tsx      # 미리보기
│   ├── QuoteSettingsPanel.tsx # 설정 패널
│   └── templates/
│       ├── SimpleQuote.tsx   # 간단 견적서 (1페이지)
│       └── DetailedQuote.tsx # 세부 견적서 (2페이지: 본문+약관)
│
└── infrastructure/services/
    └── GoogleSheetsService.ts # 시트1 견적 문의 저장
```

### 1.2 현재 금액 설정 (settings.ts - DEFAULT_SETTINGS)
```typescript
pageCost: {
  tiers: [
    { min: 1, max: 15, cost: 400000 },   // 40만원
    { min: 15, max: 30, cost: 500000 },  // 50만원
    { min: 30, max: 45, cost: 600000 },  // 60만원
  ],
  extraPerTwo: 30000,  // 45 초과 시 2페이지당 3만원 추가
}

uiuxMultiplier: {
  normal: 1.0,
  fancy: 1.2,  // 화려한 스타일 20% 가산
}

featureCost: {
  board: 100000,        // 게시판 10만원
  shopping: 200000,     // 쇼핑 기본 20만원
  productExtra: 10000,  // 상품 20개 초과 시 1개당 1만원
  productBase: 20,      // 기본 포함 상품 20개
}

serverCost: {
  year1: 150000,  // 1년 15만원
  year2: 250000,  // 2년 25만원
  year3: 300000,  // 3년 30만원
}

domainCost: {
  perYear: 30000,   // 연 3만원
  transfer: 30000,  // 이전비 3만원
}

revisionCost: {
  contentRevision: 50000,   // 콘텐츠 수정 5만원
  layoutRevision: 100000,   // 레이아웃 수정 10만원
}

companyInfo: {
  name: 'Invisible Works',
  representative: '오유택',
  businessNumber: '377-44-01126',
  email: 'invisibleworks.office@gmail.com',
  address: '대구광역시 중구 남산동 677-58, 명륜로21길 33-11',
  website: 'invisibleworks.co',
}

bankInfo: {
  bankName: '카카오뱅크',
  accountNumber: '3333-14-9478697',
  accountHolder: '오유택(엠지쓰studio)',
}
```

### 1.3 현재 PDF 생성 로직 (generatePDF.ts)
- `data-page` 속성으로 멀티페이지 지원 (이미 구현됨)
- html2canvas + jsPDF 사용
- A4 크기 (210mm × 297mm)
- 3x 해상도

### 1.4 현재 템플릿 구조

**SimpleQuote.tsx (간단 견적서)**
- 단일 페이지
- 헤더: 로고 + 견적서 타이틀 + 번호
- 정보: 발행일, 유효기간, 수신/발신
- 테이블: 항목 리스트
- 합계: 소계, VAT, 합계
- 푸터 없음 (내용에 따라 가변)

**DetailedQuote.tsx (세부 견적서)**
- 2페이지 고정: 본문 (pageNumber=1) + 약관 (pageNumber=2)
- 약관: COMPACT_TERMS (압축형), DETAILED_TERMS (세부 약관)
- 푸터: 회사 정보 + 페이지 번호

---

## 2. 구현 작업 목록

### 2.1 PDF 페이지네이션 (Pagination)

**목표**: 내용이 길어지면 A4 용지 단위로 자동 페이지 분리, 각 페이지에 헤더/푸터 포함

**적용 대상**:
- SimpleQuote: 내용 많으면 2페이지 이상으로 분리
- DetailedQuote: 항목이 많으면 본문이 2페이지 이상, 약관은 마지막 페이지

**구현 방식**:
```
방식 1: 정적 높이 계산 (권장)
- A4 높이에서 헤더/푸터 높이를 뺀 컨텐츠 영역 계산
- 항목 높이를 미리 계산하여 페이지 분리 지점 결정
- 각 페이지를 별도 컴포넌트로 렌더링

방식 2: 동적 오버플로우 감지
- 렌더링 후 높이 측정
- 오버플로우 시 자동 분리
- 복잡도 높음, 비권장
```

**파일 수정**:
1. `src/lib/quote/types.ts` - 페이지 계산 유틸리티 추가
2. `src/presentation/components/quote/templates/SimpleQuote.tsx` - 페이지네이션 로직 추가
3. `src/presentation/components/quote/templates/DetailedQuote.tsx` - 동적 페이지 분리
4. `src/presentation/components/quote/QuotePreview.tsx` - 멀티페이지 렌더링
5. `src/lib/quote/generatePDF.ts` - 이미 멀티페이지 지원됨 (수정 불필요)

**페이지 구조**:
```
[Page 1]
┌─────────────────────────────────┐
│ HEADER (로고, 타이틀, 번호)     │
│ INFO (날짜, 수신/발신)          │
│ TABLE HEADER                    │
│ ─────────────────────────────── │
│ 항목 1                          │
│ 항목 2                          │
│ ...                             │
│ 항목 N (페이지 용량까지)        │
│                                 │
│ FOOTER (회사정보, 1/3)          │
└─────────────────────────────────┘

[Page 2] (내용 계속)
┌─────────────────────────────────┐
│ HEADER (간소화: 로고 + 번호)    │
│ TABLE HEADER                    │
│ ─────────────────────────────── │
│ 항목 N+1                        │
│ ...                             │
│ 항목 M                          │
│ ─────────────────────────────── │
│ TOTALS (마지막 페이지만)        │
│                                 │
│ FOOTER (회사정보, 2/3)          │
└─────────────────────────────────┘
```

---

### 2.2 다국어 지원 (한글/영어)

**목표**: PDF 결과물을 한글/영어로 전환하는 버튼 제공

**적용 대상**:
- SimpleQuote
- DetailedQuote

**UI 변경**:
- QuoteGenerator.tsx에 언어 전환 버튼 추가 (한글 | English)
- 선택된 언어를 state로 관리
- 템플릿에 언어 prop 전달

**번역 필요 항목**:

| 한글 | English |
|------|---------|
| 견적서 | QUOTATION |
| 발행일 | Issue Date |
| 유효기간 | Valid Until |
| 수신 | To |
| 발신 | From |
| 항목 | Description |
| 수량 | Qty |
| 단가 | Unit Price |
| 금액 | Amount |
| 소계 | Subtotal |
| 부가세 | VAT |
| 합계 | Total |
| 비고 | Notes |
| 서버 | Server |
| 도메인 | Domain |
| 별도 상담 | TBD |
| 미정 | Pending |
| 착수금 | Deposit |
| 잔금 | Balance |
| 입금 계좌 | Bank Account |

**약관 번역**:
- COMPACT_TERMS 영문 버전 추가
- DETAILED_TERMS 영문 버전 추가

**파일 수정**:
1. `src/lib/quote/types.ts` - QuoteLanguage 타입 추가
2. `src/lib/quote/translations.ts` - 새 파일, 번역 데이터
3. `src/presentation/components/quote/templates/SimpleQuote.tsx` - 다국어 적용
4. `src/presentation/components/quote/templates/DetailedQuote.tsx` - 다국어 적용
5. `src/presentation/components/quote/QuoteGenerator.tsx` - 언어 전환 UI

---

### 2.3 Google Sheet2 Admin Config

**목표**: 하드코딩된 금액 설정을 Google Sheet2에서 동적으로 로드

**아키텍처**:
```
Google Sheet2 (Admin Config)
        ↓
GET /api/config/quote-settings
        ↓
서버 측 캐싱 (5분 TTL)
        ↓
클라이언트에서 사용
```

**Sheet2 구조** (탭명: `설정`):
```
| A (키)              | B (값)           | C (설명)                    |
|---------------------|------------------|-----------------------------|
| page_cost_1_15      | 400000           | 1~15블록 페이지 비용        |
| page_cost_15_30     | 500000           | 15~30블록 페이지 비용       |
| page_cost_30_45     | 600000           | 30~45블록 페이지 비용       |
| page_cost_extra     | 30000            | 45 초과 시 2페이지당 추가   |
| uiux_normal         | 1.0              | 일반 스타일 배율            |
| uiux_fancy          | 1.2              | 화려한 스타일 배율          |
| feature_board       | 100000           | 게시판 비용                 |
| feature_shopping    | 200000           | 쇼핑 기본 비용              |
| feature_product_ext | 10000            | 상품 추가 비용 (1개당)      |
| feature_product_base| 20               | 기본 포함 상품 수           |
| server_1year        | 150000           | 서버 1년                    |
| server_2year        | 250000           | 서버 2년                    |
| server_3year        | 300000           | 서버 3년                    |
| domain_per_year     | 30000            | 도메인 연 비용              |
| domain_transfer     | 30000            | 도메인 이전비               |
| revision_content    | 50000            | 콘텐츠 수정 비용            |
| revision_layout     | 100000           | 레이아웃 수정 비용          |
| company_name        | Invisible Works  | 회사명                      |
| company_rep         | 오유택           | 대표자                      |
| company_biznum      | 377-44-01126     | 사업자등록번호              |
| company_email       | invisibleworks.office@gmail.com | 이메일     |
| company_address     | 대구광역시 ...   | 주소                        |
| company_website     | invisibleworks.co| 웹사이트                    |
| bank_name           | 카카오뱅크       | 은행명                      |
| bank_account        | 3333-14-9478697  | 계좌번호                    |
| bank_holder         | 오유택(엠지쓰studio) | 예금주                  |
```

**환경변수 추가** (.env):
```bash
# Google Sheet2 (Admin Config)
GOOGLE_SHEET_CONFIG_TAB=설정
```

**파일 생성/수정**:
1. `src/infrastructure/services/GoogleSheetsService.ts` - Sheet2 읽기 함수 추가
2. `src/app/api/config/quote-settings/route.ts` - 새 API 엔드포인트
3. `src/lib/quote/settings.ts` - 동적 로드 + 캐싱 로직
4. `src/presentation/hooks/useQuoteSettings.ts` - 새 파일, 클라이언트 훅

**API 응답 형식**:
```typescript
interface QuoteSettingsResponse {
  success: boolean;
  data: QuoteSettings;
  cachedAt: string;  // ISO timestamp
}
```

**캐싱 전략**:
- 서버: 메모리 캐싱 (5분 TTL)
- 클라이언트: React Query 또는 SWR (1분 stale time)
- Fallback: DEFAULT_SETTINGS (Sheet 조회 실패 시)

---

## 3. 구현 순서

### Phase 1: Google Sheet2 Admin Config (Backend First)
1. GoogleSheetsService.ts에 `getQuoteSettings()` 함수 추가
2. `/api/config/quote-settings` API 생성
3. settings.ts에 동적 로드 함수 추가
4. useQuoteSettings 훅 생성
5. 테스트 작성 및 검증

### Phase 2: 다국어 지원
1. translations.ts 생성 (한글/영어 번역 데이터)
2. QuoteLanguage 타입 추가
3. SimpleQuote.tsx 다국어 적용
4. DetailedQuote.tsx 다국어 적용
5. QuoteGenerator.tsx 언어 전환 UI 추가
6. 테스트 작성 및 검증

### Phase 3: PDF 페이지네이션
1. 페이지 높이 계산 유틸리티 작성
2. SimpleQuote 페이지네이션 구현
3. DetailedQuote 동적 페이지 분리 구현
4. QuotePreview 멀티페이지 렌더링 수정
5. 테스트 작성 및 검증

### Phase 4: 통합 테스트 및 마무리
1. E2E 테스트
2. BACKEND-PLAN.md 업데이트
3. 코드 정리

---

## 4. 기술 참고사항

### Context7 조회 필요 항목
- `googleapis` - Google Sheets API v4 사용법
- `jspdf` - 멀티페이지 PDF 생성
- `html2canvas-pro` - HTML to Canvas 최적화
- `next.js` - API Route 캐싱 전략

### 주의사항
- PDF 생성 시 oklch/lab CSS 색상 함수 호환성 (이미 처리됨)
- A4 크기: 210mm × 297mm (595px × 842px @72dpi)
- 서버 컴포넌트에서 Google Sheets API 호출 (클라이언트 X)

---

## 5. 완료 후 BACKEND-PLAN.md 업데이트 내용

```markdown
### 2.10 견적서 다국어 지원 (간단/세부) - **[✅ DONE]**
- **내용**: 견적서(Simple/Detailed) PDF를 국문/영문으로 전환 가능
- **구현**: 언어 전환 버튼, translations.ts 번역 데이터

### 2.11 견적서 페이지 분리 - **[✅ DONE]**
- **내용**: 견적서 내용이 길어질 경우 A4 단위로 자동 페이지 분리
- **구현**: 정적 높이 계산, 각 페이지 헤더/푸터 포함

### 2.12 Google Sheet2 Admin Config - **[✅ DONE]**
- **내용**: 금액 설정을 Google Sheet2에서 동적 로드
- **API**: GET /api/config/quote-settings
- **캐싱**: 서버 5분 TTL, 클라이언트 1분 stale time
```

---

## 6. 예상 작업 파일 목록

### 새로 생성
- `src/lib/quote/translations.ts`
- `src/app/api/config/quote-settings/route.ts`
- `src/presentation/hooks/useQuoteSettings.ts`
- `src/__tests__/quote/settings.test.ts`
- `src/__tests__/quote/translations.test.ts`
- `src/__tests__/quote/pagination.test.ts`

### 수정
- `src/lib/quote/types.ts`
- `src/lib/quote/settings.ts`
- `src/infrastructure/services/GoogleSheetsService.ts`
- `src/presentation/components/quote/templates/SimpleQuote.tsx`
- `src/presentation/components/quote/templates/DetailedQuote.tsx`
- `src/presentation/components/quote/QuoteGenerator.tsx`
- `src/presentation/components/quote/QuotePreview.tsx`
- `.env` (GOOGLE_SHEET_CONFIG_TAB 추가)
- `BACKEND-PLAN.md`

---

**End of Plan**
