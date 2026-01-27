'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassBadgeProps {
  children: ReactNode;
  variant?: 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

/**
 * GlassBadge - Glass 스타일 배지
 * 
 * @variant accent - 아쿠아 배경 (강조용)
 * @variant outline - 투명 배경 + 테두리
 */
export function GlassBadge({
  children,
  variant = 'accent',
  size = 'md',
  className,
  animated = false,
}: GlassBadgeProps) {
  const variants = {
    accent: cn(
      'bg-[#7fa8c9]/15 backdrop-blur-md',
      'border border-[#7fa8c9]/30',
      'text-[#7fa8c9]'
    ),
    outline: cn(
      'bg-transparent',
      'border border-[#1a1a1a]/20',
      'text-[#1a1a1a]/70'
    ),
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs rounded-md',
    md: 'px-3 py-1.5 text-sm rounded-lg',
    lg: 'px-4 py-2 text-base rounded-xl',
  };

  const Wrapper = animated ? motion.span : 'span';

  return (
    <Wrapper
      className={cn(
        'inline-flex items-center gap-1.5 font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...(animated && {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
      })}
    >
      {children}
    </Wrapper>
  );
}
