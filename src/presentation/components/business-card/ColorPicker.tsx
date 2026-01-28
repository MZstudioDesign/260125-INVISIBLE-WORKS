'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  className?: string;
}

const DEFAULT_PRESETS = [
  '#1a1a1a', // Black
  '#7fa8c9', // Brand Blue
  '#2d5a7b', // Deep Blue
  '#9b6b9e', // Purple
  '#00ff88', // Neon Green
  '#e74c3c', // Red
  '#f39c12', // Orange
  '#27ae60', // Green
];

export function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  className,
}: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isCustomColor = !presets.includes(value);

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">
        키컬러
      </label>
      
      <div className="flex flex-wrap gap-2">
        {/* Preset Colors */}
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={cn(
              'w-8 h-8 rounded-lg transition-all border-2',
              value === color
                ? 'border-[#7fa8c9] scale-110 shadow-md'
                : 'border-transparent hover:scale-105'
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        
        {/* Custom Color Button */}
        <button
          onClick={() => {
            setShowCustom(true);
            setTimeout(() => inputRef.current?.click(), 100);
          }}
          className={cn(
            'w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all',
            isCustomColor
              ? 'border-[#7fa8c9] scale-110 shadow-md'
              : 'border-[#1a1a1a]/20 hover:border-[#7fa8c9]/50'
          )}
          style={isCustomColor ? { backgroundColor: value } : undefined}
          title="커스텀 컬러"
        >
          {!isCustomColor && <Palette className="w-4 h-4 text-[#1a1a1a]/40" />}
        </button>
        
        {/* Hidden Color Input */}
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </div>
      
      {/* Current Color Display */}
      <div className="mt-2 flex items-center gap-2">
        <div
          className="w-4 h-4 rounded border border-[#1a1a1a]/10"
          style={{ backgroundColor: value }}
        />
        <span className="text-xs text-[#1a1a1a]/50 font-mono">{value}</span>
      </div>
    </div>
  );
}
