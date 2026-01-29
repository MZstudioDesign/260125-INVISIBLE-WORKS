# Serious and Careful Hard Work Plan 🚀 (COMPREHENSIVE & STRICT)

> **CRITICAL GUIDELINE**:
> 1.  Existing Code Logic & Values in `src/lib/quote/settings.ts` must be **PRESERVED 100%**. Use exact values.
> 2.  **Simple Quote** and **Detailed Quote** must BOTH be upgraded (Admin Config, Bilingual).
> 3.  **Detailed Quote** specifically requires **Pagination** (Page Splitting) while maintaining its exact Brutalist design.

---

## 1. Admin Config (Google Sheets Integration)

### 1.1 Objective
Move the hardcoded `DEFAULT_SETTINGS` from `src/lib/quote/settings.ts` to Google Sheets (Sheet2: `AdminConfig`), allowing dynamic updates without redeployment.

### 1.2 Google Sheet Structure (Target: `AdminConfig`)
**Exact Mapping of `src/lib/quote/settings.ts` Constants**:

| Section | Key (A열) | Value (B열) | Description (Not for code, just context) |
| :--- | :--- | :--- | :--- |
| **Page Cost** | `page_cost_tiers` | `[{"min":1,"max":15,"cost":400000},{"min":15,"max":30,"cost":500000},{"min":30,"max":45,"cost":600000}]` | JSON Array for Tiers |
| | `page_cost_extra_per_two` | `30000` | Extra cost per 2 blocks > 45 |
| **UI/UX** | `uiux_normal` | `1.0` | Normal multiplier |
| | `uiux_fancy` | `1.2` | Fancy multiplier |
| **Features** | `feat_board` | `100000` | Board feature cost |
| | `feat_shopping_base` | `200000` | Shopping base cost |
| | `feat_shopping_product_base` | `20` | Base product count |
| | `feat_shopping_product_extra` | `10000` | Extra cost per product |
| **Server** | `server_year1` | `150000` | 1 Year |
| | `server_year2` | `250000` | 2 Years |
| | `server_year3` | `300000` | 3 Years |
| **Domain** | `domain_year` | `30000` | Per year |
| | `domain_transfer` | `30000` | Transfer fee |
| **Revision** | `rev_content` | `50000` | Content revision |
| | `rev_layout` | `100000` | Layout revision |
| **Company** | `info_name` | `Invisible Works` | |
| | `info_representative` | `오유택` | |
| | `info_biz_num` | `377-44-01126` | |
| | `info_email` | `invisibleworks.office@gmail.com` | |
| | `info_addr` | `대구광역시 중구 남산동 677-58, 명륜로21길 33-11` | |
| | `info_website` | `invisibleworks.co` | |
| **Bank** | `bank_name` | `카카오뱅크` | |
| | `bank_account` | `3333-14-9478697` | |
| | `bank_holder` | `오유택(엠지쓰studio)` | |

### 1.3 Implementation Strategy
1.  **Backend (`AdminConfigService`)**: Reads these keys and constructs a `QuoteSettings` object that perfectly matches the interface in `settings.ts`.
2.  **Frontend Hook (`useQuoteSettings`)**: Currently uses localStorage. We will add an initial `fetch('/api/config')` to seed the state.
3.  **Calculations**: `calculatePageCost`, `calculateFeatureCost` etc. in `settings.ts` will accept the settings object from the hook, ensuring dynamic pricing applies to **BOTH** Simple and Detailed quotes.

---

## 2. Bilingual Support (Simple & Detailed)

### 2.1 Strategy
Extract all Korean text strings from `SimpleQuote.tsx` and `DetailedQuote.tsx` into a Resource Bundle.

### 2.2 Resource Files
- `src/lib/quote/locales/ko.ts`: Original text (Source of Truth).
- `src/lib/quote/locales/en.ts`: English translation.

### 2.3 Scope of Translation
#### A. Simple Quote (`SimpleQuote.tsx`)
- Headers: "견적서" -> "QUOTE" or "ESTIMATE", "NO.", "발행일" -> "DATE", "유효기간" -> "VALID UNTIL".
- Info: "수신" -> "TO", "발신" -> "FROM".
- Table: "항목" -> "ITEM", "수량" -> "QTY", "단가" -> "UNIT PRICE", "금액" -> "AMOUNT".
- Footer: "비고" -> "NOTES", "소계" -> "SUBTOTAL", "부가세" -> "VAT", "합계" -> "TOTAL".
- **Dynamic Items**: Automated items like "웹사이트 기획 및 디자인" must be translated dynamically or provided in English via the Locale map inside `settings.ts` logic.

#### B. Detailed Quote (`DetailedQuote.tsx`)
- Same headers/table keys as above.
- **Terms (Critical)**: `COMPACT_TERMS` (Page 1 footer) and `DETAILED_TERMS` (Page 2) must be fully translated and swapped based on `data.language`.

### 2.4 Data Update
- Add `language: 'ko' | 'en'` to `QuoteData`.
- Add simple toggle in `QuoteSettingsPanel`.

---

## 3. Pagination & Layout (Detailed Quote Focus)

### 3.1 The Challenge
`DetailedQuote.tsx` is currently hardcoded for Page 1 (Main) and Page 2 (Terms).
User wants **"Quote Page Pagination"** (splitting long lists of items).

### 3.2 Solution: Chunking for Detailed Quote
We will refactor `DetailedQuote` to accept `chunkIndex` (conceptually) or handle splitting internally.

1.  **Item Splitting**:
    -   Page 1 Capacity: ~8 items (due to large header/project info).
    -   Page 2+ Capacity: ~12 items (simplified header).
    -   Logic: `const chunks = splitItems(items, 8, 12);`
2.  **Rendering**:
    -   Render `numberOfChunks` pages for the Items.
    -   Last Item Page contains the "Total Summary" section.
    -   **After** all item pages, append the **Terms Page** (which itself might be 1-2 pages, currently fixed to 1 page for Detailed terms usually, but code shows `DetailedQuotePage2` is the terms page).
3.  **Structure**:
    ```tsx
    // HiddenQuotePreview.tsx
    // ...
    {chunks.map((chunk, i) => (
       <DetailedQuoteItemPage key={i} items={chunk} pageNum={i+1} totalPages={totalWithTerms} isLastItemPage={i===chunks.length-1} />
    ))}
    <DetailedQuoteTermsPage pageNum={chunks.length+1} ... />
    ```

### 3.3 Simple Quote Strategy
- `SimpleQuote` is designed as a one-page summary.
- **Decision**: Keep it simple. If items overflow, it will naturally extend vertically in HTML. `generatePDF` handles auto-paging for generic elements, but for perfect A4 control, we should ideally restrict Simple Quote usage to single page OR applying basic splitting if absolutely necessary. **Plan**: Focus strictly on **Detailed Quote Pagination** first as requested ("Detailed Quote Page Pagination" usually implies the contract-like document). `SimpleQuote` text translation is the priority there.

---

## 4. Execution Plan
1.  **Google Sheet Setup**: Create `AdminConfig` tab and enter exact values.
2.  **Locales**: Create `ko.ts`/`en.ts`.
3.  **Code - Config**: Implement backend service and frontend hook integration.
4.  **Code - Bilingual**: Replace text literals with `{t('key')}` in `SimpleQuote.tsx` and `DetailedQuote.tsx`.
5.  **Code - Pagination**: Refactor `DetailedQuote.tsx` into `DetailedQuotePage1` (dynamic), `DetailedQuotePageN` (overflow), and `DetailedTerms`.
