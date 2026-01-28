# INVISIBLE WORKS Quote System - Improvement Plan

> Created: 2026-01-29
> Author: Claude Opus 4.5
> Status: Ready for Implementation

---

## Executive Summary

The Quote System is approximately **85% complete**. Core functionality works correctly, but several improvements are needed based on the original `plan.md` requirements and code quality analysis.

### Key Findings

| Category | Status | Priority |
|----------|--------|----------|
| Shipping Cost Field | Still exists (should be REMOVED) | HIGH |
| Special Notes → Items | Not implemented | HIGH |
| Scroll Separation | Working correctly | DONE |
| Zoom/Lightbox | Working correctly | DONE |
| PDF Multi-page | Working correctly | DONE |
| Validation (Red Border) | Working correctly | DONE |
| Code Style Issues | Minor JSX spacing | LOW |

---

## Phase 1: Shipping Cost Removal

### Problem
The `plan.md` explicitly states: **"Shipping: REMOVE entirely"**
However, `shippingCost` still exists throughout the codebase.

### Files to Modify

#### 1. `src/lib/quote/types.ts`

```diff
// Line 126: Remove from QuoteData interface
- shippingCost: number;

// Line 212-220: Modify calculateTotal()
export const calculateTotal = (
  subtotal: { min: number; max: number },
  vat: { min: number; max: number },
- shipping: number
): { min: number; max: number } => {
  return {
-   min: subtotal.min + vat.min + shipping,
-   max: subtotal.max + vat.max + shipping
+   min: subtotal.min + vat.min,
+   max: subtotal.max + vat.max
  };
};

// Line 223-235: Modify calculateBalanceDue()
export const calculateBalanceDue = (
  subtotal: { min: number; max: number },
  vat: { min: number; max: number },
- shipping: number,
  discount: number
): { min: number; max: number } => {
- const totalMin = subtotal.min + vat.min + shipping;
- const totalMax = subtotal.max + vat.max + shipping;
+ const totalMin = subtotal.min + vat.min;
+ const totalMax = subtotal.max + vat.max;
  return {
    min: Math.max(0, totalMin - discount),
    max: Math.max(0, totalMax - discount)
  };
};

// Line 296: Remove from initialQuoteState
- shippingCost: 0,
```

#### 2. `src/presentation/components/quote/QuoteForm.tsx`

```diff
// Line 49-50: Update calculation calls
- const total = calculateTotal(subtotal, vat, data.shippingCost);
- const balanceDue = calculateBalanceDue(subtotal, vat, data.shippingCost, data.discount || 0);
+ const total = calculateTotal(subtotal, vat);
+ const balanceDue = calculateBalanceDue(subtotal, vat, data.discount || 0);

// Line 254-260: REMOVE shipping cost input field entirely
- <InputField
-   label="배송비 (원)"
-   type="number"
-   value={data.shippingCost.toString()}
-   onChange={(v) => onChange({ shippingCost: parseInt(v) || 0 })}
-   placeholder="0"
- />

// Line 284-289: REMOVE shipping display in totals
- {data.shippingCost > 0 && (
-   <div className="flex justify-between text-[#1a1a1a]/60">
-     <span>배송비</span>
-     <span>{formatCurrency(data.shippingCost)}</span>
-   </div>
- )}
```

#### 3. `src/presentation/components/quote/templates/SimpleQuote.tsx`

```diff
// Line 53: Update calculation call
- const total = calculateTotal(subtotal, vat, data.shippingCost);
+ const total = calculateTotal(subtotal, vat);

// Line 386-400: REMOVE shipping display
- {data.shippingCost > 0 && (
-   <div style={{ ... }}>
-     <span>배송비</span>
-     <span>{formatCurrency(data.shippingCost)}</span>
-   </div>
- )}
```

#### 4. `src/presentation/components/quote/templates/DetailedQuote.tsx`

```diff
// Line 187-188: Update calculation calls
- const total = calculateTotal(subtotal, vat, data.shippingCost);
- const balanceDue = calculateBalanceDue(subtotal, vat, data.shippingCost, data.discount || 0);
+ const total = calculateTotal(subtotal, vat);
+ const balanceDue = calculateBalanceDue(subtotal, vat, data.discount || 0);
```

---

## Phase 2: Special Notes → Quote Items Conversion

### Problem
The `plan.md` states: **"Special Notes = Items"** - selecting a special note should add it as a Quote Item.
Currently, special notes are only displayed as text, not converted to items.

### Implementation Plan

#### 1. Add Constants to `src/lib/quote/settings.ts`

```typescript
// Add after line 130

/**
 * Special Note Item Generation Configuration
 * Each note generates a 'text' type item with "별도 상담" value
 */
export const SPECIAL_NOTE_ITEM_CONFIG: Record<SpecialNoteType, {
  description: string;
  subItems: string[];
}> = {
  multilingual: {
    description: '다국어 사이트 구축',
    subItems: ['번역 및 다국어 라우팅 설정', '언어별 콘텐츠 관리 시스템'],
  },
  renewal: {
    description: '기존 사이트 이전/리뉴얼',
    subItems: ['기존 콘텐츠 마이그레이션', '도메인 및 서버 이전 작업'],
  },
  external: {
    description: '외부 서비스 연동',
    subItems: ['API 연동 개발', '인증 및 데이터 동기화'],
  },
  urgent: {
    description: '긴급 일정 가산',
    subItems: ['우선 작업 배정', '초과 근무 비용 포함'],
  },
  security: {
    description: '내부 보안 규정 대응',
    subItems: ['보안 감사 대응', '특수 접근 제한 설정'],
  },
};
```

#### 2. Extend `generateEstimateQuoteItems()` in `src/lib/quote/settings.ts`

```typescript
// Modify the function starting at line 351

export function generateEstimateQuoteItems(
  data: QuoteData,
  settings: QuoteSettings = DEFAULT_SETTINGS
): QuoteItem[] {
  const items: QuoteItem[] = [];
  const { screenBlocks, uiuxStyle, featureSelection, specialNotes } = data;

  // ... existing page cost and feature cost logic ...

  // 3. Special Notes → Items (NEW)
  specialNotes.forEach((note) => {
    const config = SPECIAL_NOTE_ITEM_CONFIG[note];
    if (config) {
      items.push({
        ...createNewItem(),
        id: `auto-special-${note}`,
        description: config.description,
        subItems: config.subItems,
        quantity: 1,
        unitPrice: 0,
        inputType: 'text',
        textValue: '별도 상담',
      });
    }
  });

  return items;
}
```

---

## Phase 3: Code Quality Fixes

### JSX Spacing Issues

#### 1. `src/presentation/components/quote/QuoteGenerator.tsx`

```diff
// Line 208: Remove extra space
- </div >
+ </div>
```

#### 2. `src/presentation/components/quote/templates/DetailedQuote.tsx`

```diff
// Line 627: Remove extra space
- </div >
+ </div>
```

### Grid Layout Fix in QuoteForm.tsx

```diff
// Line 246: Change grid columns when shipping is removed
- <div className={cn('grid gap-4', isDetailed ? 'grid-cols-3' : 'grid-cols-2')}>
+ <div className={cn('grid gap-4', isDetailed ? 'grid-cols-2' : 'grid-cols-1')}>
```

---

## Phase 4: Frontend Design Enhancements

### Design Goals
Following the `/frontend-design` skill guidelines:
- **Tone**: Professional, minimal, functional
- **Typography**: Pretendard (already in use)
- **Color**: Monochrome with strategic accent colors

### Specific Improvements

#### 1. Section Headers in QuoteForm

```tsx
// Enhanced section header component
function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1a1a1a]/5">
      <h3 className="text-sm font-semibold text-[#1a1a1a]/80 tracking-tight">
        {title}
      </h3>
      {action}
    </div>
  );
}
```

#### 2. Item Card Hover Effect

```tsx
// Add to ItemCard className
className="rounded-lg border border-[#1a1a1a]/10 bg-[#f8fafc] overflow-hidden
  transition-all duration-200
  hover:border-[#1e3a8a]/20 hover:shadow-sm"
```

#### 3. Preview Control Bar Enhancement

```tsx
// Enhanced control bar with backdrop blur
<div className="flex items-center gap-4 mb-6
  bg-white/5 backdrop-blur-xl
  px-5 py-2.5 rounded-2xl
  border border-white/10
  shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
>
```

#### 4. Download Button Animation

```tsx
// Enhanced button with micro-interactions
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
  className="..."
>
```

---

## Verification Checklist

After implementing all changes, verify:

- [ ] Simple Quote renders correctly without shipping cost
- [ ] Detailed Quote (both pages) renders correctly
- [ ] Special notes selected in form appear as items in preview
- [ ] PDF generation works for both quote types
- [ ] Range amounts display correctly (min~max)
- [ ] Server/Domain options work (pending/confirmed states)
- [ ] Payment split calculations are accurate
- [ ] Validation errors display with red borders
- [ ] Zoom controls work in preview
- [ ] Lightbox opens and closes correctly

---

## File Change Summary

| File | Changes |
|------|---------|
| `types.ts` | Remove shippingCost, update calculations |
| `QuoteForm.tsx` | Remove shipping input, update totals |
| `SimpleQuote.tsx` | Remove shipping display |
| `DetailedQuote.tsx` | Remove shipping, fix JSX spacing |
| `QuoteGenerator.tsx` | Fix JSX spacing |
| `settings.ts` | Add special note → item conversion |

---

## Estimated Time

| Phase | Task | Time |
|-------|------|------|
| 1 | Shipping Cost Removal | 15 min |
| 2 | Special Notes Logic | 30 min |
| 3 | Code Quality Fixes | 5 min |
| 4 | Design Enhancements | 45 min |
| **Total** | | **~1.5 hours** |

---

## Notes

1. **No Database Migration Needed**: All state is local (useState), no persistent storage affected
2. **TypeScript Strict Mode**: All changes must maintain type safety
3. **Tailwind CSS v4**: Verify class compatibility after changes
4. **Testing**: Manual testing recommended for PDF generation
