'use client';

import { BusinessCardData, TemplateId, getTemplateById } from '@/lib/businessCard/types';
import { LogoDropzone } from './LogoDropzone';
import { TemplateSelector } from './TemplateSelector';
import { ColorPicker } from './ColorPicker';
import { cn } from '@/lib/utils';

interface BusinessCardFormProps {
  data: BusinessCardData;
  onChange: (data: Partial<BusinessCardData>) => void;
  className?: string;
}

export function BusinessCardForm({ data, onChange, className }: BusinessCardFormProps) {
  const handleTemplateChange = (templateId: TemplateId) => {
    const template = getTemplateById(templateId);
    onChange({
      template: templateId,
      primaryColor: template.defaultColor,
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Template Selection */}
      <TemplateSelector
        value={data.template}
        onChange={handleTemplateChange}
      />

      {/* Logo Upload */}
      <LogoDropzone
        value={data.logo}
        onChange={(logo) => onChange({ logo })}
      />

      {/* Color Picker */}
      <ColorPicker
        value={data.primaryColor}
        onChange={(primaryColor) => onChange({ primaryColor })}
      />

      {/* Divider */}
      <div className="border-t border-[#1a1a1a]/10" />

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#1a1a1a]/70">기본 정보</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="이름 *"
            value={data.name}
            onChange={(name) => onChange({ name })}
            placeholder="홍길동"
          />
          <InputField
            label="직함"
            value={data.title}
            onChange={(title) => onChange({ title })}
            placeholder="대표"
          />
        </div>

        <InputField
          label="회사/브랜드명"
          value={data.company}
          onChange={(company) => onChange({ company })}
          placeholder="인비저블웍스"
        />
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#1a1a1a]/70">연락처</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="전화번호"
            value={data.phone}
            onChange={(phone) => onChange({ phone })}
            placeholder="010-1234-5678"
            type="tel"
          />
          <InputField
            label="이메일"
            value={data.email}
            onChange={(email) => onChange({ email })}
            placeholder="hello@company.com"
            type="email"
          />
        </div>

        <InputField
          label="웹사이트"
          value={data.website}
          onChange={(website) => onChange({ website })}
          placeholder="www.company.com"
        />

        <InputField
          label="주소"
          value={data.address}
          onChange={(address) => onChange({ address })}
          placeholder="서울시 강남구 테헤란로 123"
        />
      </div>

      {/* Additional */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#1a1a1a]/70">추가 정보</h3>
        
        <InputField
          label="슬로건/태그라인"
          value={data.slogan}
          onChange={(slogan) => onChange({ slogan })}
          placeholder="우리는 다르게 만듭니다"
        />
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'tel' | 'email';
}

function InputField({ label, value, onChange, placeholder, type = 'text' }: InputFieldProps) {
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
          'w-full px-3 py-2.5 rounded-lg border border-[#1a1a1a]/10',
          'text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30',
          'focus:outline-none focus:border-[#7fa8c9] focus:ring-2 focus:ring-[#7fa8c9]/10',
          'transition-all'
        )}
      />
    </div>
  );
}
