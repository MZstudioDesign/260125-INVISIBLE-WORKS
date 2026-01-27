'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

/**
 * Skeleton - 블루 기 도는 로딩 플레이스홀더
 */
export function Skeleton({
  className,
  width,
  height,
  rounded = 'md',
  animate = true,
}: SkeletonProps) {
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-[#7fa8c9]/20',
        roundedStyles[rounded],
        animate && 'animate-pulse',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {animate && (
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r from-transparent via-[#7fa8c9]/30 to-transparent',
            'animate-shimmer'
          )}
        />
      )}
    </div>
  );
}

/**
 * SkeletonText - 텍스트 스켈레톤
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}

export function SkeletonText({
  lines = 3,
  className,
  lastLineWidth = '70%',
}: SkeletonTextProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            height={16}
            width={i === lines - 1 ? lastLineWidth : '100%'}
            rounded="sm"
          />
        ))}
    </div>
  );
}

/**
 * SkeletonCard - 카드 스켈레톤
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden',
        'bg-white/85 backdrop-blur-xl',
        'border-2 border-[#7fa8c9]/25',
        'shadow-[0_12px_40px_rgba(127,168,201,0.12)]',
        className
      )}
    >
      <Skeleton height={160} width="100%" rounded="none" />
      <div className="p-6 space-y-4">
        <Skeleton width="70%" height={20} />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}
