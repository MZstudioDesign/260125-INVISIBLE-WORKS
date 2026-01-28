'use client';

import { Plus, Trash2, ChevronDown, Info, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  QuoteData,
  QuoteItem,
  QuoteItemType,
  QuoteType,
  PaymentSplitType,
  FeatureType,
  SpecialNoteType,
  FEATURE_LABELS,
  SPECIAL_NOTE_LABELS,
  DEFAULT_PAYMENT_SPLITS,
  createNewItem,
  formatCurrency,
  calculateSubtotal,
  calculateVAT,
  calculateTotal,
  calculateBalanceDue,
  calculateItemTotal,
} from '@/lib/quote/types';
import {
  getServerOptionsText,
  getDomainOptionsText,
  formatWon,
  calculateTotalEstimate,
} from '@/lib/quote/settings';

interface QuoteFormProps {
  data: QuoteData;
  onChange: (data: Partial<QuoteData>) => void;
  activeTab?: QuoteType;
  className?: string;
  validationErrors?: Record<string, string>;
}

export function QuoteForm({ data, onChange, activeTab = 'simple', className, validationErrors = {} }: QuoteFormProps) {
  const subtotal = calculateSubtotal(data.items);
  const vat = calculateVAT(subtotal, data.vatRate);
  const total = calculateTotal(subtotal, vat);
  const balanceDue = calculateBalanceDue(subtotal, vat, data.discount || 0);

  const isDetailed = activeTab === 'detailed';

  const handleItemChange = (id: string, field: keyof QuoteItem, value: string | number | string[] | undefined) => {
    const newItems = data.items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange({ items: newItems });
  };

  const handleAddItem = () => {
    onChange({ items: [...data.items, createNewItem()] });
  };

  const handleRemoveItem = (id: string) => {
    if (data.items.length <= 1) return;
    onChange({ items: data.items.filter((item) => item.id !== id) });
  };

  // 서브아이템 추가/제거/수정
  const handleAddSubItem = (itemId: string) => {
    const newItems = data.items.map((item) => {
      if (item.id === itemId) {
        return { ...item, subItems: [...(item.subItems || []), ''] };
      }
      return item;
    });
    onChange({ items: newItems });
  };

  const handleRemoveSubItem = (itemId: string, subIndex: number) => {
    const newItems = data.items.map((item) => {
      if (item.id === itemId && item.subItems) {
        const newSubItems = item.subItems.filter((_, i) => i !== subIndex);
        return { ...item, subItems: newSubItems };
      }
      return item;
    });
    onChange({ items: newItems });
  };

  const handleSubItemChange = (itemId: string, subIndex: number, value: string) => {
    const newItems = data.items.map((item) => {
      if (item.id === itemId && item.subItems) {
        const newSubItems = [...item.subItems];
        newSubItems[subIndex] = value;
        return { ...item, subItems: newSubItems };
      }
      return item;
    });
    onChange({ items: newItems });
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* 기본 정보 */}
      <div className="space-y-4">
        <SectionHeader title="기본 정보" />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="견적서 번호"
            value={data.quoteNumber}
            onChange={(v) => onChange({ quoteNumber: v })}
            placeholder="001"
          />
          <InputField
            label="발행일"
            type="date"
            value={data.date}
            onChange={(v) => onChange({ date: v })}
          />
        </div>

        {/* 세부 견적서: 견적서 제목 */}
        {isDetailed && (
          <InputField
            label="견적서 제목"
            value={data.invoiceSubject}
            onChange={(v) => onChange({ invoiceSubject: v })}
            placeholder="웹사이트 제작 프로젝트"
          />
        )}
      </div>

      {/* 구분선 */}
      <div className="border-t border-[#1a1a1a]/10" />

      {/* 수신인 정보 */}
      <div className="space-y-4">
        <SectionHeader title="수신인 (고객)" />

        <InputField
          label="고객명 *"
          value={data.clientName}
          onChange={(v) => onChange({ clientName: v })}
          placeholder="홍길동 / 회사명"
          error={validationErrors.clientName}
        />

        <TextareaField
          label="주소"
          value={data.clientAddress}
          onChange={(v) => onChange({ clientAddress: v })}
          placeholder="서울시 강남구..."
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="연락처"
            value={data.clientPhone}
            onChange={(v) => onChange({ clientPhone: v })}
            placeholder="010-0000-0000"
          />
          <InputField
            label="이메일"
            type="email"
            value={data.clientEmail}
            onChange={(v) => onChange({ clientEmail: v })}
            placeholder="client@email.com"
          />
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-[#1a1a1a]/10" />

      {/* 프로젝트 정보 (간단 견적서용) */}
      {!isDetailed && (
        <ProjectInfoSection
          data={data}
          onChange={onChange}
        />
      )}

      {/* 구분선 */}
      <div className="border-t border-[#1a1a1a]/10" />

      {/* 항목 */}
      <div className="space-y-4">
        <SectionHeader
          title="항목"
          action={
            <button
              onClick={handleAddItem}
              className="text-xs text-[#1e3a8a] hover:text-[#1e40af] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e3a8a]/5 hover:bg-[#1e3a8a]/10 transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              항목 추가
            </button>
          }
        />

        {validationErrors.items && (
          <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
            {validationErrors.items}
          </p>
        )}

        <div className="space-y-3">
          {data.items.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              index={index}
              isDetailed={isDetailed}
              canRemove={data.items.length > 1}
              onItemChange={handleItemChange}
              onRemoveItem={handleRemoveItem}
              onAddSubItem={handleAddSubItem}
              onRemoveSubItem={handleRemoveSubItem}
              onSubItemChange={handleSubItemChange}
            />
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-[#1a1a1a]/10" />

      {/* 서버/도메인 옵션 */}
      <ServerDomainSection
        data={data}
        onChange={onChange}
      />

      {/* 구분선 */}
      <div className="border-t border-[#1a1a1a]/10" />

      {/* 금액 설정 */}
      <div className="space-y-4">
        <SectionHeader title="금액 설정" />

        <div className={cn('grid gap-4', isDetailed ? 'grid-cols-2' : 'grid-cols-1')}>
          <InputField
            label="부가세율 (%)"
            type="number"
            value={data.vatRate.toString()}
            onChange={(v) => onChange({ vatRate: parseInt(v) || 0 })}
            placeholder="10"
          />
          {/* 세부 견적서: 전체 할인 금액 */}
          {isDetailed && (
            <InputField
              label="할인 금액 (원)"
              type="number"
              value={(data.discount || 0).toString()}
              onChange={(v) => onChange({ discount: parseInt(v) || 0 })}
              placeholder="0"
            />
          )}
        </div>

        {/* 합계 표시 */}
        <div className="p-4 rounded-lg bg-[#1e3a8a]/5 border border-[#1e3a8a]/10">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#1a1a1a]/60">
              <span>소계</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#1a1a1a]/60">
              <span>부가세 ({data.vatRate}%)</span>
              <span>{formatCurrency(vat)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#1e3a8a] pt-2 border-t border-[#1e3a8a]/20">
              <span>합계</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {/* 세부 견적서: 할인 및 최종 금액 */}
            {isDetailed && (data.discount || 0) > 0 && (
              <>
                <div className="flex justify-between text-red-500">
                  <span>할인</span>
                  <span>-{formatCurrency(data.discount || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#1e3a8a] pt-2 border-t border-[#1e3a8a]/20">
                  <span>최종 금액</span>
                  <span>{formatCurrency(balanceDue)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 세부 견적서: 결제 정보 */}
      {isDetailed && (
        <>
          <div className="border-t border-[#1a1a1a]/10" />
          <div className="space-y-4">
            <SectionHeader title="결제 정보" />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="은행명"
                value={data.bankName}
                onChange={(v) => onChange({ bankName: v })}
                placeholder="국민은행"
              />
              <InputField
                label="예금주"
                value={data.bankAccountName}
                onChange={(v) => onChange({ bankAccountName: v })}
                placeholder="홍길동"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="계좌번호"
                value={data.bankAccountNumber}
                onChange={(v) => onChange({ bankAccountNumber: v })}
                placeholder="123-456-789012"
              />
              <InputField
                label="결제 조건"
                value={data.paymentTerms}
                onChange={(v) => onChange({ paymentTerms: v })}
                placeholder="발행일로부터 7일 이내"
              />
            </div>

            {/* 결제 분할 옵션 */}
            <PaymentSplitSection
              data={data}
              onChange={onChange}
            />
          </div>
        </>
      )}

      {/* 구분선 */}
      <div className="border-t border-[#1a1a1a]/10" />

      {/* 비고 */}
      <div className="space-y-4">
        <SectionHeader title="추가 정보" />

        <TextareaField
          label="비고"
          value={data.notes}
          onChange={(v) => onChange({ notes: v })}
          placeholder="추가 안내사항이 있으면 입력하세요"
          rows={3}
        />

        <InputField
          label="견적 유효기간"
          type="date"
          value={data.validUntil}
          onChange={(v) => onChange({ validUntil: v })}
        />
      </div>
    </div>
  );
}

// 섹션 헤더 컴포넌트
interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]/5">
      <h3 className="text-sm font-semibold text-[#1a1a1a]/80 tracking-tight flex items-center gap-2">
        <span className="w-1 h-4 bg-[#1e3a8a] rounded-full" />
        {title}
      </h3>
      {action}
    </div>
  );
}

// 입력 필드 컴포넌트
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'date';
  error?: string;
}

function InputField({ label, value, onChange, placeholder, type = 'text', error }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
            : 'border-[#1a1a1a]/10 focus:border-[#7fa8c9] focus:ring-[#7fa8c9]/10',
          'text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30',
          'focus:outline-none focus:ring-2',
          'transition-all'
        )}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: TextareaFieldProps) {
  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border border-[#1a1a1a]/10',
          'text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30',
          'focus:outline-none focus:border-[#7fa8c9] focus:ring-2 focus:ring-[#7fa8c9]/10',
          'transition-all resize-none'
        )}
      />
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-[#1a1a1a]/10 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#1a1a1a]/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7fa8c9] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

// 항목 카드 컴포넌트
interface ItemCardProps {
  item: QuoteItem;
  index: number;
  isDetailed: boolean;
  canRemove: boolean;
  onItemChange: (id: string, field: keyof QuoteItem, value: string | number | string[] | undefined) => void;
  onRemoveItem: (id: string) => void;
  onAddSubItem: (itemId: string) => void;
  onRemoveSubItem: (itemId: string, subIndex: number) => void;
  onSubItemChange: (itemId: string, subIndex: number, value: string) => void;
}

function ItemCard({
  item,
  index,
  isDetailed,
  canRemove,
  onItemChange,
  onRemoveItem,
  onAddSubItem,
  onRemoveSubItem,
  onSubItemChange,
}: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const itemTotal = calculateItemTotal(item);

  // 입력 타입 옵션
  const INPUT_TYPES: { value: QuoteItemType; label: string }[] = [
    { value: 'fixed', label: '고정 금액' },
    { value: 'range', label: '범위 금액' },
    { value: 'text', label: '텍스트 (별도상담)' },
    { value: 'percent', label: '비율 가산 (%)' },
  ];

  return (
    <div className="rounded-xl border border-[#1a1a1a]/8 bg-white overflow-hidden transition-all duration-200 hover:border-[#1e3a8a]/20 hover:shadow-[0_4px_20px_rgba(30,58,138,0.08)]">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#1a1a1a]/5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 hover:bg-white rounded-lg transition-all duration-150 group"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#1a1a1a]/40 group-hover:text-[#1e3a8a] transition-colors" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#1a1a1a]/40 group-hover:text-[#1e3a8a] transition-colors" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-xs font-semibold text-[#1e3a8a]">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-[#1a1a1a]/70">항목</span>
        </div>

        {/* Type Selector */}
        <select
          value={item.inputType || 'fixed'}
          onChange={(e) => onItemChange(item.id, 'inputType', e.target.value as QuoteItemType)}
          className="ml-auto text-xs border border-[#1a1a1a]/10 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#1e3a8a]/30 focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          {INPUT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {canRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveItem(item.id);
            }}
            className="p-1.5 hover:bg-red-50 text-[#1a1a1a]/30 hover:text-red-500 rounded-lg transition-all duration-150 ml-1"
            title="항목 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 본문 */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-3 border-t border-[#1a1a1a]/5 mt-3">
          <Input
            value={item.description}
            onChange={(e) => onItemChange(item.id, 'description', e.target.value)}
            placeholder="항목명 (예: 메인 페이지 기획 및 디자인)"
            className="font-medium"
          />

          <div className={cn('grid gap-3', isDetailed ? 'grid-cols-4' : 'grid-cols-3')}>
            {/* Common Quantity Field */}
            <InputField
              label="수량"
              type="number"
              value={item.quantity.toString()}
              onChange={(v) => onItemChange(item.id, 'quantity', parseInt(v) || 0)}
              placeholder="1"
            />

            {/* Dynamic Inputs based on Type */}
            {(item.inputType === 'fixed' || !item.inputType) && (
              <div className="col-span-2">
                <InputField
                  label="단가"
                  type="number"
                  value={item.unitPrice.toString()}
                  onChange={(v) => onItemChange(item.id, 'unitPrice', parseInt(v) || 0)}
                  placeholder="0"
                />
              </div>
            )}

            {item.inputType === 'range' && (
              <>
                <InputField
                  label="최소 금액"
                  type="number"
                  value={item.unitPrice.toString()}
                  onChange={(v) => onItemChange(item.id, 'unitPrice', parseInt(v) || 0)}
                  placeholder="Min"
                />
                <InputField
                  label="최대 금액"
                  type="number"
                  value={item.maxPrice?.toString() || ''}
                  onChange={(v) => onItemChange(item.id, 'maxPrice', parseInt(v) || 0)}
                  placeholder="Max"
                />
              </>
            )}

            {item.inputType === 'text' && (
              <div className="col-span-2">
                <InputField
                  label="표시 텍스트"
                  value={item.textValue || ''}
                  onChange={(v) => onItemChange(item.id, 'textValue', v)}
                  placeholder="예: 별도 상담, 착수 후 협의"
                />
              </div>
            )}

            {item.inputType === 'percent' && (
              <div className="col-span-2">
                <InputField
                  label="비율 (%)"
                  type="number"
                  value={item.ratio?.toString() || ''}
                  onChange={(v) => onItemChange(item.id, 'ratio', parseFloat(v) || 0)}
                  placeholder="10"
                />
              </div>
            )}

            {/* 세부 견적서: 항목별 할인 (여기서만 보임) */}
            {isDetailed && item.inputType !== 'text' && (
              <InputField
                label="할인율 (%)"
                type="number"
                value={(item.discount || 0).toString()}
                onChange={(v) => onItemChange(item.id, 'discount', parseInt(v) || 0)}
                placeholder="0"
              />
            )}
          </div>

          {/* 서브 아이템 (공통) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#1a1a1a]/50">
                세부 항목
              </label>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubItem(item.id);
                }}
                className="text-xs text-[#7fa8c9] hover:text-[#5a8ab0] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                추가
              </button>
            </div>
            {item.subItems?.map((sub, sIdx) => (
              <div key={sIdx} className="flex gap-2">
                <Input
                  value={sub}
                  onChange={(e) => onSubItemChange(item.id, sIdx, e.target.value)}
                  placeholder="세부 항목 내용을 입력하세요"
                  className="text-sm bg-white/50"
                />
                <button
                  onClick={() => onRemoveSubItem(item.id, sIdx)}
                  className="p-2 hover:bg-red-50 text-red-400 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* 소계 표시 (Text/Percent 제외) */}
          {item.inputType !== 'text' && item.inputType !== 'percent' && (
            <div className="text-right text-sm text-[#1a1a1a]/60">
              소계: {formatCurrency(itemTotal)}
              {isDetailed && (item.discount || 0) > 0 && (
                <span className="text-xs text-red-400 ml-2">
                  (-{item.discount}%)
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 서버/도메인 옵션 섹션
// ═══════════════════════════════════════════════════════════════
interface ServerDomainSectionProps {
  data: QuoteData;
  onChange: (data: Partial<QuoteData>) => void;
}

function ServerDomainSection({ data, onChange }: ServerDomainSectionProps) {
  return (
    <div className="space-y-4">
      <SectionHeader title="서버 / 도메인" />

      {/* 서버 옵션 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#1a1a1a]/50">서버 호스팅</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ serverOption: { status: 'pending' } })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              data.serverOption.status === 'pending'
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
            )}
          >
            미정
          </button>
          <button
            type="button"
            onClick={() => onChange({ serverOption: { status: 'confirmed', years: 1 } })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              data.serverOption.status === 'confirmed'
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
            )}
          >
            확정
          </button>
        </div>

        {data.serverOption.status === 'confirmed' && (
          <div className="flex gap-2 mt-2">
            {([1, 2, 3] as const).map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => onChange({ serverOption: { status: 'confirmed', years: year } })}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  data.serverOption.years === year
                    ? 'bg-[#7fa8c9] text-white'
                    : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
                )}
              >
                {year}년
              </button>
            ))}
          </div>
        )}

        {data.serverOption.status === 'pending' && (
          <div className="flex items-start gap-1.5 p-2 rounded bg-amber-50 border border-amber-200">
            <Info className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              견적서에 옵션 가격으로 표시됩니다: {getServerOptionsText()}
            </p>
          </div>
        )}
      </div>

      {/* 도메인 옵션 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#1a1a1a]/50">도메인</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ domainOption: { status: 'pending' } })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              data.domainOption.status === 'pending'
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
            )}
          >
            미정
          </button>
          <button
            type="button"
            onClick={() => onChange({ domainOption: { status: 'confirmed', type: 'new', years: 1 } })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              data.domainOption.status === 'confirmed'
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
            )}
          >
            확정
          </button>
        </div>

        {data.domainOption.status === 'confirmed' && (
          <div className="space-y-2 mt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ domainOption: { ...data.domainOption, type: 'new' } })}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  data.domainOption.type === 'new'
                    ? 'bg-[#7fa8c9] text-white'
                    : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
                )}
              >
                신규 등록
              </button>
              <button
                type="button"
                onClick={() => onChange({ domainOption: { ...data.domainOption, type: 'transfer' } })}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  data.domainOption.type === 'transfer'
                    ? 'bg-[#7fa8c9] text-white'
                    : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
                )}
              >
                이전
              </button>
            </div>
            <InputField
              label="도메인 사용 연수"
              type="number"
              value={(data.domainOption.years || 1).toString()}
              onChange={(v) => onChange({ domainOption: { ...data.domainOption, years: parseInt(v) || 1 } })}
              placeholder="1"
            />
          </div>
        )}

        {data.domainOption.status === 'pending' && (
          <div className="flex items-start gap-1.5 p-2 rounded bg-amber-50 border border-amber-200">
            <Info className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              견적서에 옵션 가격으로 표시됩니다: {getDomainOptionsText()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 결제 분할 옵션 섹션
// ═══════════════════════════════════════════════════════════════
interface PaymentSplitSectionProps {
  data: QuoteData;
  onChange: (data: Partial<QuoteData>) => void;
}

function PaymentSplitSection({ data, onChange }: PaymentSplitSectionProps) {
  const [customRatios, setCustomRatios] = useState<number[]>(data.paymentSplit.ratios);

  const handleSplitTypeChange = (type: PaymentSplitType) => {
    const preset = DEFAULT_PAYMENT_SPLITS[type];
    setCustomRatios(preset.ratios);
    onChange({ paymentSplit: { ...preset } });
  };

  const handleRatioChange = (index: number, value: number) => {
    const newRatios = [...customRatios];
    newRatios[index] = Math.max(0, Math.min(100, value));

    // Normalize to 100%
    const total = newRatios.reduce((sum, r) => sum + r, 0);
    if (total !== 100 && index === newRatios.length - 1) {
      // Auto-adjust last ratio
      const remaining = 100 - newRatios.slice(0, -1).reduce((sum, r) => sum + r, 0);
      newRatios[newRatios.length - 1] = Math.max(0, remaining);
    }

    setCustomRatios(newRatios);
    onChange({
      paymentSplit: {
        ...data.paymentSplit,
        ratios: newRatios,
      },
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-[#1a1a1a]/5">
      <label className="text-xs font-medium text-[#1a1a1a]/50">결제 분할</label>

      <div className="flex gap-2">
        {(['full', 'two', 'three'] as PaymentSplitType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleSplitTypeChange(type)}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              data.paymentSplit.type === type
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
            )}
          >
            {type === 'full' ? '일시불' : type === 'two' ? '2분할' : '3분할'}
          </button>
        ))}
      </div>

      {/* 비율 조정 */}
      {data.paymentSplit.type !== 'full' && (
        <div className="space-y-2 p-3 rounded-lg bg-[#f8fafc]">
          {data.paymentSplit.labels.map((label, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-[#1a1a1a]/60 w-16">{label}</span>
              <input
                type="number"
                value={customRatios[index] || 0}
                onChange={(e) => handleRatioChange(index, parseInt(e.target.value) || 0)}
                min={0}
                max={100}
                className={cn(
                  'w-16 px-2 py-1 text-center rounded border border-[#1a1a1a]/10',
                  'text-xs focus:outline-none focus:border-[#7fa8c9]'
                )}
              />
              <span className="text-xs text-[#1a1a1a]/40">%</span>
            </div>
          ))}
          <div className="text-xs text-[#1a1a1a]/40 pt-1 border-t border-[#1a1a1a]/10">
            합계: {customRatios.reduce((sum, r) => sum + r, 0)}%
            {customRatios.reduce((sum, r) => sum + r, 0) !== 100 && (
              <span className="text-red-400 ml-2">(100%가 되어야 합니다)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 프로젝트 정보 섹션 (간단 견적서용)
// ═══════════════════════════════════════════════════════════════
interface ProjectInfoSectionProps {
  data: QuoteData;
  onChange: (data: Partial<QuoteData>) => void;
}

function ProjectInfoSection({ data, onChange }: ProjectInfoSectionProps) {
  // 예상 견적 계산
  const estimate = calculateTotalEstimate(
    data.screenBlocks,
    data.uiuxStyle,
    data.featureSelection
  );

  // 스크린 블록 변경
  const handleBlocksChange = (field: 'min' | 'max', value: number) => {
    const newBlocks = { ...data.screenBlocks, [field]: value };
    if (field === 'min' && value > newBlocks.max) {
      newBlocks.max = value;
    } else if (field === 'max' && value < newBlocks.min) {
      newBlocks.min = value;
    }
    onChange({ screenBlocks: newBlocks });
  };

  // 기능 토글
  const handleFeatureToggle = (feature: FeatureType) => {
    const current = data.featureSelection.features;
    const isSelected = current.includes(feature);
    const newFeatures = isSelected
      ? current.filter(f => f !== feature)
      : [...current, feature];

    const newProductCount = newFeatures.includes('shopping')
      ? data.featureSelection.productCount || { min: 20, max: 50 }
      : undefined;

    onChange({
      featureSelection: {
        features: newFeatures,
        productCount: newProductCount,
      },
    });
  };

  // 상품 개수 변경
  const handleProductCountChange = (field: 'min' | 'max', value: number) => {
    const current = data.featureSelection.productCount || { min: 20, max: 50 };
    const newCount = { ...current, [field]: value };
    if (field === 'min' && value > newCount.max) {
      newCount.max = value;
    } else if (field === 'max' && value < newCount.min) {
      newCount.min = value;
    }
    onChange({
      featureSelection: {
        ...data.featureSelection,
        productCount: newCount,
      },
    });
  };

  // 특이사항 토글
  const handleSpecialNoteToggle = (note: SpecialNoteType) => {
    const current = data.specialNotes;
    const isSelected = current.includes(note);
    const newNotes = isSelected
      ? current.filter(n => n !== note)
      : [...current, note];
    onChange({ specialNotes: newNotes });
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="프로젝트 정보" />

      {/* 스크린 블록 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#1a1a1a]/50">
          스크린 블록 (페이지 분량)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={data.screenBlocks.min}
            onChange={(e) => handleBlocksChange('min', parseInt(e.target.value) || 1)}
            min={1}
            className={cn(
              'w-20 px-3 py-2 rounded-lg border border-[#1a1a1a]/10',
              'text-sm text-center focus:outline-none focus:border-[#7fa8c9]'
            )}
          />
          <span className="text-sm text-[#1a1a1a]/40">~</span>
          <input
            type="number"
            value={data.screenBlocks.max}
            onChange={(e) => handleBlocksChange('max', parseInt(e.target.value) || 1)}
            min={1}
            className={cn(
              'w-20 px-3 py-2 rounded-lg border border-[#1a1a1a]/10',
              'text-sm text-center focus:outline-none focus:border-[#7fa8c9]'
            )}
          />
          <span className="text-xs text-[#1a1a1a]/40">블록</span>
        </div>
        <p className="text-xs text-[#1a1a1a]/40">
          브라우저 67% 배율 기준 한 화면 단위
        </p>
      </div>

      {/* UIUX 스타일 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#1a1a1a]/50">UIUX 스타일</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ uiuxStyle: 'normal' })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              data.uiuxStyle === 'normal'
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
            )}
          >
            일반 (×1.0)
          </button>
          <button
            type="button"
            onClick={() => onChange({ uiuxStyle: 'fancy' })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              data.uiuxStyle === 'fancy'
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#f1f5f9] text-[#1a1a1a]/60 hover:bg-[#e2e8f0]'
            )}
          >
            화려 (×1.2)
          </button>
        </div>
      </div>

      {/* 기능 선택 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#1a1a1a]/50">기능 선택 (복수 선택)</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(FEATURE_LABELS) as FeatureType[]).map((feature) => (
            <div
              key={feature}
              onClick={() => handleFeatureToggle(feature)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all',
                data.featureSelection.features.includes(feature)
                  ? 'bg-[#1e3a8a]/10 border border-[#1e3a8a]/20'
                  : 'bg-[#f8fafc] border border-transparent hover:bg-[#f1f5f9]'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded border flex items-center justify-center',
                data.featureSelection.features.includes(feature)
                  ? 'bg-[#1e3a8a] border-[#1e3a8a]'
                  : 'border-[#1a1a1a]/20'
              )}>
                {data.featureSelection.features.includes(feature) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-[#1a1a1a]/70">{FEATURE_LABELS[feature]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 쇼핑 선택 시 상품 개수 */}
      {data.featureSelection.features.includes('shopping') && (
        <div className="space-y-2 p-3 rounded-lg bg-[#f8fafc] border border-[#1a1a1a]/5">
          <label className="text-xs font-medium text-[#1a1a1a]/50">상품 개수</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={data.featureSelection.productCount?.min || 20}
              onChange={(e) => handleProductCountChange('min', parseInt(e.target.value) || 1)}
              min={1}
              className={cn(
                'w-20 px-3 py-2 rounded-lg border border-[#1a1a1a]/10',
                'text-sm text-center focus:outline-none focus:border-[#7fa8c9]'
              )}
            />
            <span className="text-sm text-[#1a1a1a]/40">~</span>
            <input
              type="number"
              value={data.featureSelection.productCount?.max || 50}
              onChange={(e) => handleProductCountChange('max', parseInt(e.target.value) || 1)}
              min={1}
              className={cn(
                'w-20 px-3 py-2 rounded-lg border border-[#1a1a1a]/10',
                'text-sm text-center focus:outline-none focus:border-[#7fa8c9]'
              )}
            />
            <span className="text-xs text-[#1a1a1a]/40">개</span>
          </div>
          <p className="text-xs text-[#1a1a1a]/40">
            20개 초과 시 1개당 1만원 추가 (5만원 단위 반올림)
          </p>
        </div>
      )}

      {/* 특이사항 */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#1a1a1a]/50">특이사항 (복수 선택)</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SPECIAL_NOTE_LABELS) as SpecialNoteType[]).map((note) => (
            <button
              key={note}
              type="button"
              onClick={() => handleSpecialNoteToggle(note)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                data.specialNotes.includes(note)
                  ? 'bg-[#f59e0b]/10 text-[#d97706] border border-[#f59e0b]/20'
                  : 'bg-[#f8fafc] text-[#1a1a1a]/50 hover:bg-[#f1f5f9]'
              )}
            >
              {SPECIAL_NOTE_LABELS[note]}
            </button>
          ))}
        </div>
        {data.specialNotes.length > 0 && (
          <p className="text-xs text-[#f59e0b]">
            ※ 특이사항은 상담 이후 확정됩니다
          </p>
        )}
      </div>

      {/* 예상 견적 표시 */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/10 border border-[#1e3a8a]/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#1a1a1a]/70">예상 제작비</span>
          <span className="text-lg font-bold text-[#1e3a8a]">
            {formatWon(estimate.min)} ~ {formatWon(estimate.max)}
          </span>
        </div>
        <p className="text-xs text-[#1a1a1a]/40 mt-1">
          페이지비 + UIUX + 기능비 (서버/도메인 별도)
        </p>
      </div>
    </div>
  );
}
