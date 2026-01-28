'use client';

import { cn } from '@/lib/utils';
import React from 'react';

// ============================================
// Types
// ============================================

interface MarqueeProps {
  children: React.ReactNode;
  /** 역방향 스크롤 */
  reverse?: boolean;
  /** 호버 시 일시정지 */
  pauseOnHover?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** 스크롤 속도 */
  speed?: 'slow' | 'normal' | 'fast';
  /** 아이템 간 간격 (기본: 1.5rem) */
  gap?: string;
}

// ============================================
// Marquee Component
// ============================================

/**
 * Marquee - 무한 스크롤 컴포넌트
 * 
 * 사용법:
 * ```tsx
 * <Marquee speed="normal" pauseOnHover>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </Marquee>
 * ```
 * 
 * Props:
 * - `reverse`: 역방향 스크롤 (기본: false)
 * - `pauseOnHover`: 호버 시 일시정지 (기본: true)
 * - `speed`: 스크롤 속도 ('slow' | 'normal' | 'fast')
 * - `gap`: 아이템 간 간격 (기본: '1.5rem')
 * 
 * CSS 요구사항 (globals.css):
 * ```css
 * @keyframes marquee {
 *   from { transform: translateX(0); }
 *   to { transform: translateX(-100%); }
 * }
 * @keyframes marquee-reverse {
 *   from { transform: translateX(-100%); }
 *   to { transform: translateX(0); }
 * }
 * .animate-marquee {
 *   animation: marquee var(--duration, 40s) linear infinite;
 * }
 * .animate-marquee-reverse {
 *   animation: marquee-reverse var(--duration, 40s) linear infinite;
 * }
 * ```
 */
export function Marquee({
  children,
  reverse = false,
  pauseOnHover = true,
  className,
  speed = 'normal',
  gap = '1.5rem',
}: MarqueeProps) {
  const speedMap = {
    slow: '60s',
    normal: '40s',
    fast: '25s',
  };

  return (
    <div
      className={cn(
        'group flex overflow-hidden',
        pauseOnHover && '[&:hover>div]:animation-play-state-paused',
        className
      )}
      style={{ 
        '--duration': speedMap[speed],
        '--gap': gap,
      } as React.CSSProperties}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 gap-[var(--gap)] pr-[var(--gap)]',
            'animate-marquee',
            reverse && 'animate-marquee-reverse',
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
          style={{
            animationDuration: 'var(--duration)',
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

// ============================================
// MarqueeSection - 섹션 래퍼 컴포넌트
// ============================================

interface MarqueeSectionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function MarqueeSection({
  title,
  subtitle,
  badge,
  children,
  className,
}: MarqueeSectionProps) {
  return (
    <section className={cn('relative py-16 md:py-24 overflow-hidden', className)}>
      {/* Header */}
      {(title || subtitle || badge) && (
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          {badge && (
            <span className={cn(
              'inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium',
              'bg-[#f2f8fc] text-[#7fa8c9]',
              'border border-[#7fa8c9]/20'
            )}>
              {badge}
            </span>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-[#1a1a1a]/60 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Marquee Content */}
      {children}
    </section>
  );
}
