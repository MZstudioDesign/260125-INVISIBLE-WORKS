'use client';

import { TEMPLATES, TemplateId, TemplateInfo } from '@/lib/businessCard/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
  className?: string;
}

export function TemplateSelector({ value, onChange, className }: TemplateSelectorProps) {
  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-3">
        템플릿 선택
      </label>
      
      <div className="grid grid-cols-1 gap-3">
        {TEMPLATES.map((template) => (
          <TemplateOption
            key={template.id}
            template={template}
            isSelected={value === template.id}
            onSelect={() => onChange(template.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface TemplateOptionProps {
  template: TemplateInfo;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateOption({ template, isSelected, onSelect }: TemplateOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden',
        'hover:border-[#7fa8c9]/60 hover:shadow-sm',
        isSelected
          ? 'border-[#7fa8c9] bg-[#7fa8c9]/5'
          : 'border-[#1a1a1a]/10 bg-white'
      )}
    >
      {/* Color Indicator */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: template.defaultColor }}
      />
      
      <div className="pl-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-[#1a1a1a]">{template.name}</h3>
          {isSelected && (
            <div className="w-5 h-5 rounded-full bg-[#7fa8c9] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <p className="text-xs text-[#1a1a1a]/50 mb-2">{template.description}</p>
        
        <div className="flex gap-1.5">
          {template.mood.map((mood) => (
            <span
              key={mood}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a]/5 text-[#1a1a1a]/60"
            >
              {mood}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
