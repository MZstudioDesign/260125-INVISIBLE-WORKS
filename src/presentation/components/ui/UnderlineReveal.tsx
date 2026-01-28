'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface UnderlineRevealProps {
  children: React.ReactNode;
  /** 밑줄 색상 */
  color?: string;
  /** 밑줄 두께 */
  thickness?: number;
  /** 애니메이션 지연 (초) */
  delay?: number;
  /** 애니메이션 지속 시간 (초) */
  duration?: number;
  /** 밑줄 위치 (bottom에서의 offset) */
  offsetY?: number;
  className?: string;
}

/**
 * UnderlineReveal - 뷰포트 진입 시 밑줄이 그려지는 효과
 * 
 * Features:
 * - 스크롤 시 밑줄이 좌→우로 그려짐
 * - 커스터마이징 가능한 색상, 두께, 지연 시간
 * - 부드러운 ease-out 애니메이션
 * 
 * @example
 * <UnderlineReveal color="#7fa8c9" thickness={3}>
 *   여기까지 무료
 * </UnderlineReveal>
 */
export function UnderlineReveal({
  children,
  color = '#7fa8c9',
  thickness = 3,
  delay = 0,
  duration = 0.6,
  offsetY = 0,
  className = '',
}: UnderlineRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      {/* 밑줄 */}
      <motion.span
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: offsetY,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
          originX: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
    </span>
  );
}

/**
 * HighlightReveal - 뷰포트 진입 시 형광펜 하이라이트 효과
 */
interface HighlightRevealProps {
  children: React.ReactNode;
  /** 하이라이트 색상 */
  color?: string;
  /** 투명도 */
  opacity?: number;
  /** 애니메이션 지연 (초) */
  delay?: number;
  /** 애니메이션 지속 시간 (초) */
  duration?: number;
  className?: string;
}

export function HighlightReveal({
  children,
  color = '#7fa8c9',
  opacity = 0.2,
  delay = 0,
  duration = 0.5,
  className = '',
}: HighlightRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {/* 하이라이트 배경 */}
      <motion.span
        className="absolute inset-0 -mx-1 -my-0.5 pointer-events-none rounded"
        style={{
          backgroundColor: color,
          opacity: 0,
          originX: 0,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity } : { scaleX: 0, opacity: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

/**
 * StrikethroughReveal - 뷰포트 진입 시 취소선 효과
 */
interface StrikethroughRevealProps {
  children: React.ReactNode;
  /** 취소선 색상 */
  color?: string;
  /** 취소선 두께 */
  thickness?: number;
  /** 애니메이션 지연 (초) */
  delay?: number;
  /** 애니메이션 지속 시간 (초) */
  duration?: number;
  className?: string;
}

export function StrikethroughReveal({
  children,
  color = 'currentColor',
  thickness = 2,
  delay = 0,
  duration = 0.4,
  className = '',
}: StrikethroughRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      {/* 취소선 */}
      <motion.span
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          height: thickness,
          backgroundColor: color,
          originX: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
    </span>
  );
}

export default UnderlineReveal;
