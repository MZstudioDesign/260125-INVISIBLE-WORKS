'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, useState } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-[#1a1a1a]/70">{label}</label>
        )}
        <div
          className="relative transition-shadow duration-200"
          style={{
            boxShadow: isFocused ? '0 0 0 3px rgba(127,168,201,0.2)' : 'none',
            borderRadius: '0.75rem',
          }}
        >
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3',
              'bg-white/50 backdrop-blur-xl',
              'border border-white/60 rounded-xl',
              'text-[#1a1a1a] placeholder:text-[#1a1a1a]/40',
              'shadow-[0_4px_16px_rgba(127,168,201,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]',
              'transition-all duration-300',
              'focus:outline-none focus:bg-white/70 focus:border-[#7fa8c9]/40',
              'hover:bg-white/60',
              error && 'border-red-300 focus:border-red-400',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

interface GlassTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ label, error, className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-[#1a1a1a]/70">{label}</label>
        )}
        <div
          className="relative transition-shadow duration-200"
          style={{
            boxShadow: isFocused ? '0 0 0 3px rgba(127,168,201,0.2)' : 'none',
            borderRadius: '0.75rem',
          }}
        >
          <textarea
            ref={ref}
            className={cn(
              'w-full px-4 py-3 min-h-[120px] resize-none',
              'bg-white/50 backdrop-blur-xl',
              'border border-white/60 rounded-xl',
              'text-[#1a1a1a] placeholder:text-[#1a1a1a]/40',
              'shadow-[0_4px_16px_rgba(127,168,201,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]',
              'transition-all duration-300',
              'focus:outline-none focus:bg-white/70 focus:border-[#7fa8c9]/40',
              'hover:bg-white/60',
              error && 'border-red-300 focus:border-red-400',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

GlassTextarea.displayName = 'GlassTextarea';
