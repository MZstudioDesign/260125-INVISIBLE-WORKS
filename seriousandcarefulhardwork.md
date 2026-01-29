# Serious and Careful Hard Work Plan 🚀 (METHODOLOGY & ARCHITECTURE)

> **CRITICAL INSTRUCTION**: This document is the **Absolute Rulebook**. You MUST follow the "Required Methodology" section below for every single step.

---

## 0. 🛠 Base Methodology (MANDATORY)

**모든 작업 단계에서 아래의 도구와 스킬을 강제적으로 사용해야 합니다.**

### 0.1 Required Tools
1.  **Context7**:
    *   **Before Coding**: 각 기능을 구현하기 전, 반드시 `Context7`을 사용하여 최신 Best Practice를 리서치하십시오.
    *   *Usage*: "Google Sheet caching pattern in Next.js", "React to PDF pagination optimized for html2canvas" 등의 쿼리를 수행하여 검증된 패턴만 적용할 것.
2.  **Sequential Thinking**:
    *   복잡한 로직(페이지네이션 알고리즘 등) 구현 시, `sequential-thinking` 툴을 먼저 사용하여 로직의 무결성을 검증한 후 코드를 작성할 것.

### 0.2 Required Skills (Persona)
1.  **Senior Backend Developer**:
    *   **Architecture**: 단순한 API 호출이 아닌, '시스템'을 설계하십시오. (Caching, Error Handling, Failover, Type Safety).
    *   **DB Design**: Google Sheet를 단순 시트가 아닌 **Relational Database**처럼 취급하여 설계하십시오. (Schema lock, Transaction-like stability).
2.  **Senior Frontend Designer**:
    *   **Component Design**: `DetailedQuote`와 `SimpleQuote`의 코드 중복을 최소화하고, '합성(Composition)' 패턴을 사용하여 재사용성을 극대화하십시오.
    *   **UX Detail**: PDF 생성 중 로딩 상태, 오류 처리, 다국어 전환 시 깜빡임 방지 등 디테일을 챙기십시오.

---

## 1. Phase 1: Admin Config (The Sheet DB)

### 1.1 Context7 Checklist
- [ ] *Query*: "Next.js server-side caching for Google Sheets API"
- [ ] *Query*: "Handling Google Sheets API rate limits in production"

### 1.2 Database Schema (Google Sheet: `AdminConfig`)
**Sheet Identity**: `Sheet2` (Tab Name: `AdminConfig`)
**Columns**: Key (A), Value_KO (B), Value_EN (C)

| Key | Value (Default) | Notes |
| :--- | :--- | :--- |
| `page_cost_tiers` | `[{"min":1,"max":15,"cost":400000},...]` | JSON String |
| `page_cost_extra_per_two` | `30000` | |
| `uiux_normal` | `1.0` | |
| `uiux_fancy` | `1.2` | |
| `backend_toggle` | `true` | **Context7** recommended toggle pattern |

### 1.3 Implementation (Senior Backend)
-   **Service Layer**: `AdminConfigService` with LRU Cache (Memory).
-   **Failover**: Sheet API 비정상 응답 시, 하드코딩된 `DEFAULT_SETTINGS`로 즉시 Fallback.

---

## 2. Phase 2: Bilingual PDF System

### 2.1 Context7 Checklist
- [ ] *Query*: "Next.js 14 i18n patterns for client-side components"
- [ ] *Query*: "Dynamic text resizing for multilingual PDF generation"

### 2.2 Mechanism
-   **Resource Bundle**: `src/lib/quote/locales/{ko,en}.ts`
-   **Toggle UI**: `QuoteGenerator.tsx` 상단에 `[KR/EN]` 스위치 구현.
-   **Data Flow**: 토글 변경 -> `QuoteData.language` 업데이트 -> PDF 리렌더링 -> 캡처.

---

## 3. Phase 3: Smart Pagination

### 3.1 Context7 Checklist
- [ ] *Query*: "html2canvas multi-page PDF generation best practices"
- [ ] *Query*: "Algorithmic layout splitting for dynamic content in React"

### 3.2 The Algorithm (Detailed & Simple)
**Requirement**: 내용이 많아지면 A4 용지에 맞춰 자동으로 페이지가 나뉘어야 함 (`div[data-page]`).

1.  **Measure**: 렌더링 전, 아이템 리스트의 예상 높이를 계산(Heuristic)하거나, 렌더링 후 DOM 높이를 측정.
2.  **Chunking**:
    -   `SimpleQuote`: 1페이지 한도 초과 시, 2페이지로 자연스럽게 오버플로우 허용 (푸터와 겹치지 않게 분리).
    -   `DetailedQuote`: 8개/14개 단위로 엄격하게 배열 분할 (Slice).
3.  **PDF Assembly**: `generatePDF.ts`는 `[data-page]` 속성이 있는 모든 요소를 순차적으로 캡처하여 `addPage()` 수행.

---

## 4. Execution Step Summary

1.  **Research**: `Context7` + `Sequential Thinking` (5 mins).
2.  **Backend**: `AdminConfigService` & API (20 mins).
3.  **Frontend**: Locale Setup & Quote Component Refactoring (30 mins).
4.  **Verification**: Test PDF generation with extreme cases (100 items).

> **End Goal**: `.env`에 시트 ID만 넣으면, 고객이 직접 엑셀(구글시트)에서 가격과 문구를 수정하고, 결과물은 완벽한 2개국어 PDF로 나오는 시스템.
