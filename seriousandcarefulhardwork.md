# Serious and Careful Hard Work Plan 🚀 (CORRECTED)

> **Goal**: Google Sheets를 CMS(관리자 페이지)로 사용하여 **현재 코드에 구현된 정교한 견적 로직을 그대로 보존**하면서, 다국어/페이지네이션을 구현합니다.

---

## 1. Google Sheets Admin Config (Sheet2) Configuration

**Critical**: 코드(`src/lib/quote/settings.ts`)에 정의된 `DEFAULT_SETTINGS` 값을 정확히 Google Sheet로 옮겨옵니다.

### 1.1 시트 구조 설계 (Sheet Name: `AdminConfig`)
Key-Value 형태로 관리하되, 복잡한 객체(Tiers)는 JSON 문자열로 저장하거나, 접두어를 사용하여 관리합니다.

| Key (A열) | Value (B열) | Description (C열 - 참고용) |
| :--- | :--- | :--- |
| **[Page Cost]** | | |
| `page_cost_tiers` | `[{"min":1,"max":15,"cost":400000},{"min":15,"max":30,"cost":500000},{"min":30,"max":45,"cost":600000}]` | 구간별 제작비 (JSON) |
| `page_cost_extra_per_two` | `30000` | 45블록 초과 시 2페이지당 추가 비용 |
| **[UI/UX]** | | |
| `uiux_normal` | `1.0` | 일반 스타일 배율 |
| `uiux_fancy` | `1.2` | 화려한 스타일 배율 |
| **[Features]** | | |
| `feat_board` | `100000` | 게시판 기능 |
| `feat_shopping_base` | `200000` | 쇼핑 기능 (기본) |
| `feat_shopping_product_base` | `20` | 쇼핑 기본 포함 상품 수 |
| `feat_shopping_product_extra` | `10000` | 상품 추가 1개당 비용 |
| **[Server]** | | |
| `server_year1` | `150000` | 서버 1년 유지비 |
| `server_year2` | `250000` | 서버 2년 유지비 |
| `server_year3` | `300000` | 서버 3년 유지비 |
| **[Domain]** | | |
| `domain_year` | `30000` | 도메인 1년 등록비 |
| `domain_transfer` | `30000` | 도메인 이전 비용 |
| **[Revision]** | | |
| `rev_content` | `50000` | 콘텐츠 수정 비용 |
| `rev_layout` | `100000` | 레이아웃/리디자인 비용 |
| **[Company Info]** | | |
| `info_name` | `Invisible Works` | 회사명 |
| `info_representative` | `오유택` | 대표자 |
| `info_biz_num` | `377-44-01126` | 사업자등록번호 |
| `info_email` | `invisibleworks.office@gmail.com` | 이메일 |
| `info_addr` | `대구광역시 중구 남산동 677-58, 명륜로21길 33-11` | 주소 |
| `info_website` | `invisibleworks.co` | 웹사이트 |
| **[Bank Info]** | | |
| `bank_name` | `카카오뱅크` | 은행명 |
| `bank_account` | `3333-14-9478697` | 계좌번호 |
| `bank_holder` | `오유택(엠지쓰studio)` | 예금주 |

### 1.2 Backend Integration (`AdminConfigService`)
- **Action**: `AdminConfigService.ts`에서 위 Key들을 읽어 `QuoteSettings` 인터페이스와 정확히 매핑되는 객체를 반환하도록 구현.
- **Cache**: 10분 TTL 캐싱 적용 (배포 후 빈번한 API 호출 방지).

### 1.3 Changes in `PricingService.ts` & `settings.ts`
- 현재 `DEFAULT_SETTINGS` 상수를 사용하는 부분을, 서버 사이드에서는 `AdminConfigService.getSettings()`를 호출하여 값을 덮어쓰도록 변경.
- 클라이언트(`useQuoteSettings`)는 초기 로드 시 `GET /api/config`를 통해 최신 설정을 받아오도록 수정 (localStorage보다 우선순위 높임).

---

## 2. Bilingual Quote Support (KR/EN)

### 2.1 Strategy
- `locales/ko.ts`, `locales/en.ts` 리소스 파일 생성.
- **대상 범위**:
    - 견적서 UI 라벨 ("견적서", "No.", "Description", "Unit Price" 등)
    - 약관 (`DEFAULT_TERMS` 내용 번역 필요)
    - 은행 정보 라벨 ("Bank Name", "Account Holder" 등)
    - 자동 생성 항목명 ("웹사이트 기획 및 디자인" -> "Website Planning & Design") **주의**: 동적 생성 문자열 처리 필요.

### 2.2 Implementation
- `QuoteData.language` 필드 추가 (기본값 'ko').
- `formatCurrency` 함수: KRW(원) 외에 USD($) 지원 여부 결정 필요 (우선은 라벨만 변경하고 통화는 KRW 유지).

---

## 3. Quote Pagination Logic

### 3.1 Current Constraint
- `html2canvas`는 긴 컨텐츠를 자동으로 자르지 못함.
- `items` 배열의 길이에 따라 수동으로 페이지를 나누어야 함.

### 3.2 Pagination Logic
`generateQuoteItems`의 결과(`items`)를 받아 렌더링할 때:
1.  **Page 1**:
    -   Header + Project Info + Items (최대 N개, 예: 8개) + (공간 남으면) Summary + Footer
2.  **Page 2 (Overflow)**:
    -   Header (간소화) + Remaining Items + Summary + Footer
3.  **Terms Page**:
    -   별도 페이지로 약관 및 서명란 배치.

### 3.3 New Component Structure
```tsx
// PDFGeneratorContext에 Pagination State 추가 필요
// DetailedQuote.tsx 리팩토링:

const PAGING_SIZE = 8; // 한 페이지당 최대 항목 수

{pages.map((pageItems, i) => (
  <div key={i} className="pdf-page" style={{ height: '297mm', position: 'relative' }}>
    <PageHeader pageNum={i+1} totalPages={totalPages} />
    <ItemsTable items={pageItems} />
    {isLastPage && <PriceSummary />}
    <PageFooter />
  </div>
))}
```

---

## 4. Execution Roadmap

1.  **Phase 1: Admin Config (Backend & Sheet)**
    -   Google Sheet에 `AdminConfig` 탭 생성 및 위 **정확한 값** 입력.
    -   `AdminConfigService` 구현 및 `settings.ts`와 연동.
2.  **Phase 2: Bilingual UI**
    -   Locale 파일 생성.
    -   Quote 컴포넌트에 `lang` prop 전달 및 텍스트 교체.
3.  **Phase 3: Pagination**
    -   `DetailedQuote.tsx`를 다중 페이지 렌더링 구조로 변경.
    -   PDF 생성 테스트.
