'use client';

import React, { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** 반짝이는 효과 색상 */
  shimmerColor?: string;
  /** 반짝임 크기 */
  shimmerSize?: string;
  /** 테두리 반경 */
  borderRadius?: string;
  /** 반짝임 애니메이션 지속 시간 */
  shimmerDuration?: string;
  /** 배경 색상 */
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * ShimmerButton - 반짝이는 테두리 효과 버튼
 * 
 * @description 테두리를 따라 빛이 회전하는 효과가 있는 버튼
 * @see https://magicui.design/docs/components/shimmer-button
 */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = 'rgba(127, 168, 201, 0.8)',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '16px',
      background = 'rgba(255, 255, 255, 0.8)',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={{
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
        } as CSSProperties}
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden',
          '[border-radius:var(--radius)] border border-[#7fa8c9]/20 px-6 py-3',
          'whitespace-nowrap text-[#1a1a1a] font-medium',
          '[background:var(--bg)] backdrop-blur-xl',
          'transform-gpu transition-all duration-300 ease-out',
          'hover:shadow-[0_8px_24px_rgba(127,168,201,0.2)]',
          'active:translate-y-px',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer container */}
        <div
          className={cn(
            '-z-30 blur-[2px]',
            '[container-type:size] absolute inset-0 overflow-visible'
          )}
        >
          {/* Shimmer spark */}
          <div className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
            <div 
              className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0"
              style={{
                background: `conic-gradient(from calc(270deg-(var(--spread)*0.5)),transparent 0,var(--shimmer-color) var(--spread),transparent var(--spread))`,
              }}
            />
          </div>
        </div>
        
        {/* Content */}
        {children}

        {/* Highlight overlay */}
        <div
          className={cn(
            'absolute inset-0 size-full',
            'rounded-[inherit] px-4 py-1.5',
            'shadow-[inset_0_-8px_10px_rgba(127,168,201,0.1)]',
            'transform-gpu transition-all duration-300',
            'group-hover:shadow-[inset_0_-6px_10px_rgba(127,168,201,0.15)]',
            'group-active:shadow-[inset_0_-10px_10px_rgba(127,168,201,0.2)]'
          )}
        />

        {/* Backdrop */}
        <div
          className={cn(
            'absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]'
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';

/**
 * GlowButton - 글로우 효과 버튼 (Liquid Glass 스타일)
 */
interface GlowButtonProps extends ComponentPropsWithoutRef<'button'> {
  glowColor?: string;
  variant?: 'default' | 'accent';
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ glowColor = '#7fa8c9', variant = 'default', className, children, ...props }, ref) => {
    const variants = {
      default: {
        bg: 'bg-white/70',
        text: 'text-[#1a1a1a]',
        border: 'border-white/60',
      },
      accent: {
        bg: 'bg-[#7fa8c9]/90',
        text: 'text-white',
        border: 'border-[#7fa8c9]',
      },
    };

    const v = variants[variant];

    return (
      <button
        ref={ref}
        className={cn(
          'relative px-6 py-3 rounded-xl font-medium',
          'backdrop-blur-xl border',
          v.bg, v.text, v.border,
          'transition-all duration-300',
          'hover:shadow-[0_0_30px_rgba(127,168,201,0.4)]',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        style={{
          '--glow-color': glowColor,
        } as CSSProperties}
        {...props}
      >
        {/* Glow effect */}
        <span
          className={cn(
            'absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300',
            'group-hover:opacity-100'
          )}
          style={{
            boxShadow: `0 0 20px var(--glow-color), inset 0 0 20px var(--glow-color)`,
          }}
        />
        <span className="relative">{children}</span>
      </button>
    );
  }
);

GlowButton.displayName = 'GlowButton';

/**
 * RippleButton - 클릭 시 물결 효과 버튼
 */
interface RippleButtonProps extends ComponentPropsWithoutRef<'button'> {
  rippleColor?: string;
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ rippleColor = 'rgba(127, 168, 201, 0.4)', className, children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative overflow-hidden px-6 py-3 rounded-xl font-medium',
          'bg-white/70 backdrop-blur-xl border border-white/60',
          'text-[#1a1a1a]',
          'transition-all duration-300',
          'hover:bg-white/80 hover:shadow-[0_8px_24px_rgba(127,168,201,0.15)]',
          'active:scale-[0.98]',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute animate-ripple rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '10px',
              height: '10px',
              transform: 'translate(-50%, -50%)',
              backgroundColor: rippleColor,
            }}
          />
        ))}
        <span className="relative">{children}</span>
      </button>
    );
  }
);

RippleButton.displayName = 'RippleButton';
