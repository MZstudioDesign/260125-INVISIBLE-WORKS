'use client';

import { useState } from 'react';
import { Settings, X, Plus, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuoteSettings } from '@/lib/quote/useQuoteSettings';
import { formatWon } from '@/lib/quote/settings';

interface QuoteSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'cost' | 'company' | 'bank' | 'custom';

export function QuoteSettingsPanel({ isOpen, onClose }: QuoteSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cost');
  const {
    settings,
    isLoaded,
    updatePageCost,
    updateUiuxMultiplier,
    updateFeatureCost,
    updateServerCost,
    updateDomainCost,
    updateRevisionCost,
    updateCompanyInfo,
    updateBankInfo,
    addCustomField,
    removeCustomField,
    updateCustomField,
    resetToDefaults,
  } = useQuoteSettings();

  if (!isOpen || !isLoaded) return null;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'cost', label: '비용 설정' },
    { id: 'company', label: '회사 정보' },
    { id: 'bank', label: '결제 정보' },
    { id: 'custom', label: '직접 입력' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">관리자 설정</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              기본값 복원
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'cost' && (
            <CostSettings
              settings={settings}
              onUpdatePageCost={updatePageCost}
              onUpdateUiux={updateUiuxMultiplier}
              onUpdateFeature={updateFeatureCost}
              onUpdateServer={updateServerCost}
              onUpdateDomain={updateDomainCost}
              onUpdateRevision={updateRevisionCost}
            />
          )}
          {activeTab === 'company' && (
            <CompanySettings
              settings={settings}
              onUpdate={updateCompanyInfo}
            />
          )}
          {activeTab === 'bank' && (
            <BankSettings
              settings={settings}
              onUpdate={updateBankInfo}
            />
          )}
          {activeTab === 'custom' && (
            <CustomFieldsSettings
              settings={settings}
              onAdd={addCustomField}
              onRemove={removeCustomField}
              onUpdate={updateCustomField}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            설정은 자동으로 저장됩니다 (localStorage)
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 비용 설정 탭
// ═══════════════════════════════════════════════════════════════
interface CostSettingsProps {
  settings: ReturnType<typeof useQuoteSettings>['settings'];
  onUpdatePageCost: ReturnType<typeof useQuoteSettings>['updatePageCost'];
  onUpdateUiux: ReturnType<typeof useQuoteSettings>['updateUiuxMultiplier'];
  onUpdateFeature: ReturnType<typeof useQuoteSettings>['updateFeatureCost'];
  onUpdateServer: ReturnType<typeof useQuoteSettings>['updateServerCost'];
  onUpdateDomain: ReturnType<typeof useQuoteSettings>['updateDomainCost'];
  onUpdateRevision: ReturnType<typeof useQuoteSettings>['updateRevisionCost'];
}

function CostSettings({
  settings,
  onUpdatePageCost,
  onUpdateUiux,
  onUpdateFeature,
  onUpdateServer,
  onUpdateDomain,
  onUpdateRevision,
}: CostSettingsProps) {
  return (
    <div className="space-y-6">
      {/* 페이지 제작비 */}
      <Section title="페이지 제작비">
        <div className="space-y-2">
          {settings.pageCost.tiers.map((tier, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-24">
                {tier.min}~{tier.max} 블록
              </span>
              <NumberInput
                value={tier.cost}
                onChange={(value) => {
                  const newTiers = [...settings.pageCost.tiers];
                  newTiers[index] = { ...tier, cost: value };
                  onUpdatePageCost({ tiers: newTiers });
                }}
                suffix="원"
              />
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 w-24">45 초과 2페이지당</span>
            <NumberInput
              value={settings.pageCost.extraPerTwo}
              onChange={(value) => onUpdatePageCost({ extraPerTwo: value })}
              suffix="원"
            />
          </div>
        </div>
      </Section>

      {/* UIUX 배율 */}
      <Section title="UIUX 배율">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">일반</span>
            <NumberInput
              value={settings.uiuxMultiplier.normal}
              onChange={(value) => onUpdateUiux({ normal: value })}
              step={0.1}
              suffix="배"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">화려</span>
            <NumberInput
              value={settings.uiuxMultiplier.fancy}
              onChange={(value) => onUpdateUiux({ fancy: value })}
              step={0.1}
              suffix="배"
            />
          </div>
        </div>
      </Section>

      {/* 기능 비용 */}
      <Section title="기능 비용">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-32">게시판</span>
            <NumberInput
              value={settings.featureCost.board}
              onChange={(value) => onUpdateFeature({ board: value })}
              suffix="원"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-32">쇼핑 기본</span>
            <NumberInput
              value={settings.featureCost.shopping}
              onChange={(value) => onUpdateFeature({ shopping: value })}
              suffix="원"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-32">상품 기본 포함</span>
            <NumberInput
              value={settings.featureCost.productBase}
              onChange={(value) => onUpdateFeature({ productBase: value })}
              suffix="개"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-32">초과 상품 1개당</span>
            <NumberInput
              value={settings.featureCost.productExtra}
              onChange={(value) => onUpdateFeature({ productExtra: value })}
              suffix="원"
            />
          </div>
        </div>
      </Section>

      {/* 서버 비용 */}
      <Section title="서버 유지관리비">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">1년</span>
            <NumberInput
              value={settings.serverCost.year1}
              onChange={(value) => onUpdateServer({ year1: value })}
              suffix="원"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">2년</span>
            <NumberInput
              value={settings.serverCost.year2}
              onChange={(value) => onUpdateServer({ year2: value })}
              suffix="원"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">3년</span>
            <NumberInput
              value={settings.serverCost.year3}
              onChange={(value) => onUpdateServer({ year3: value })}
              suffix="원"
            />
          </div>
        </div>
      </Section>

      {/* 도메인 비용 */}
      <Section title="도메인 비용">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">연간</span>
            <NumberInput
              value={settings.domainCost.perYear}
              onChange={(value) => onUpdateDomain({ perYear: value })}
              suffix="원"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-16">이전비</span>
            <NumberInput
              value={settings.domainCost.transfer}
              onChange={(value) => onUpdateDomain({ transfer: value })}
              suffix="원"
            />
          </div>
        </div>
      </Section>

      {/* 수정 비용 */}
      <Section title="수정 비용">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-40">콘텐츠 수정 1회</span>
            <NumberInput
              value={settings.revisionCost.contentRevision}
              onChange={(value) => onUpdateRevision({ contentRevision: value })}
              suffix="원"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-40">레이아웃/리디자인</span>
            <NumberInput
              value={settings.revisionCost.layoutRevision}
              onChange={(value) => onUpdateRevision({ layoutRevision: value })}
              suffix="원"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 회사 정보 탭
// ═══════════════════════════════════════════════════════════════
interface CompanySettingsProps {
  settings: ReturnType<typeof useQuoteSettings>['settings'];
  onUpdate: ReturnType<typeof useQuoteSettings>['updateCompanyInfo'];
}

function CompanySettings({ settings, onUpdate }: CompanySettingsProps) {
  return (
    <div className="space-y-4">
      <TextInput
        label="회사명"
        value={settings.companyInfo.name}
        onChange={(value) => onUpdate({ name: value })}
      />
      <TextInput
        label="대표자"
        value={settings.companyInfo.representative}
        onChange={(value) => onUpdate({ representative: value })}
      />
      <TextInput
        label="사업자등록번호"
        value={settings.companyInfo.businessNumber}
        onChange={(value) => onUpdate({ businessNumber: value })}
      />
      <TextInput
        label="이메일"
        value={settings.companyInfo.email}
        onChange={(value) => onUpdate({ email: value })}
      />
      <TextInput
        label="주소"
        value={settings.companyInfo.address}
        onChange={(value) => onUpdate({ address: value })}
      />
      <TextInput
        label="웹사이트"
        value={settings.companyInfo.website}
        onChange={(value) => onUpdate({ website: value })}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 결제 정보 탭
// ═══════════════════════════════════════════════════════════════
interface BankSettingsProps {
  settings: ReturnType<typeof useQuoteSettings>['settings'];
  onUpdate: ReturnType<typeof useQuoteSettings>['updateBankInfo'];
}

function BankSettings({ settings, onUpdate }: BankSettingsProps) {
  return (
    <div className="space-y-4">
      <TextInput
        label="은행명"
        value={settings.bankInfo.bankName}
        onChange={(value) => onUpdate({ bankName: value })}
      />
      <TextInput
        label="계좌번호"
        value={settings.bankInfo.accountNumber}
        onChange={(value) => onUpdate({ accountNumber: value })}
      />
      <TextInput
        label="예금주"
        value={settings.bankInfo.accountHolder}
        onChange={(value) => onUpdate({ accountHolder: value })}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 직접 입력 탭
// ═══════════════════════════════════════════════════════════════
interface CustomFieldsSettingsProps {
  settings: ReturnType<typeof useQuoteSettings>['settings'];
  onAdd: (label: string, value: string) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, label: string, value: string) => void;
}

function CustomFieldsSettings({
  settings,
  onAdd,
  onRemove,
  onUpdate,
}: CustomFieldsSettingsProps) {
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (newLabel.trim() && newValue.trim()) {
      onAdd(newLabel.trim(), newValue.trim());
      setNewLabel('');
      setNewValue('');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        견적서에 추가로 표시할 항목을 입력하세요.
      </p>

      {/* 기존 항목 */}
      {settings.customFields.map((field, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate(index, e.target.value, field.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            placeholder="항목명"
          />
          <input
            type="text"
            value={field.value}
            onChange={(e) => onUpdate(index, field.label, e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            placeholder="값"
          />
          <button
            onClick={() => onRemove(index)}
            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* 새 항목 추가 */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          placeholder="새 항목명"
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          placeholder="값"
        />
        <button
          onClick={handleAdd}
          disabled={!newLabel.trim() || !newValue.trim()}
          className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 공통 컴포넌트
// ═══════════════════════════════════════════════════════════════
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
}

function NumberInput({ value, onChange, suffix, step = 10000 }: NumberInputProps) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        className="w-28 px-2 py-1 text-sm text-right border border-gray-200 rounded focus:outline-none focus:border-gray-400"
      />
      {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
    </div>
  );
}

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function TextInput({ label, value, onChange }: TextInputProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 토글 버튼 컴포넌트
// ═══════════════════════════════════════════════════════════════
interface SettingsToggleButtonProps {
  onClick: () => void;
  className?: string;
}

export function SettingsToggleButton({ onClick, className }: SettingsToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-700',
        'hover:bg-gray-100 rounded-lg transition-colors',
        className
      )}
    >
      <Settings className="w-4 h-4" />
      설정
    </button>
  );
}
