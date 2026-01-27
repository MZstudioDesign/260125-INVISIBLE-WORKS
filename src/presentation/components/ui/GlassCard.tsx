'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

/**
 * GlassCard - Bordered Glass 카드 컴포넌트
 * 
 * 흰색 배경에 아쿠아 컬러 보더로 브랜드 아이덴티티를 강조하는 카드
 */
export function GlassCard({
  children,
  hover = true,
  className,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white/85 backdrop-blur-xl',
        'border-2 border-[#7fa8c9]/25',
        'shadow-[0_12px_40px_rgba(127,168,201,0.12),inset_0_2px_0_rgba(255,255,255,0.95)]',
        'rounded-2xl',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: '0 16px 64px rgba(127,168,201,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
              transition: { duration: 0.3 },
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
