'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagicCardProps {
  children?: React.ReactNode;
  className?: string;
  /** 그라데이션 크기 (px) */
  gradientSize?: number;
  /** 호버 시 배경 그라데이션 색상 */
  gradientColor?: string;
  /** 그라데이션 투명도 */
  gradientOpacity?: number;
  /** 테두리 그라데이션 시작 색상 */
  gradientFrom?: string;
  /** 테두리 그라데이션 종료 색상 */
  gradientTo?: string;
}

/**
 * MagicCard - 마우스 추적 스포트라이트 효과가 있는 카드
 * 
 * @description 마우스 커서를 따라다니는 그라데이션 테두리와 배경 효과
 * @see https://magicui.design/docs/components/magic-card
 */
export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = 'rgba(127, 168, 201, 0.15)',
  gradientOpacity = 0.8,
  gradientFrom = '#7fa8c9',
  gradientTo = '#f2f8fc',
}: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const reset = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [gradientSize, mouseX, mouseY]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset();
    };

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') reset();
    };

    window.addEventListener('pointerout', handleGlobalPointerOut);
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pointerout', handleGlobalPointerOut);
      window.removeEventListener('blur', reset);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [reset]);

  return (
    <div
      className={cn(
        'group relative rounded-2xl overflow-hidden',
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerEnter={reset}
    >
      {/* 테두리 그라데이션 효과 */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            transparent 100%
          )`,
        }}
      />
      
      {/* 카드 배경 */}
      <div className="absolute inset-px rounded-[inherit] bg-white/60 backdrop-blur-xl" />
      
      {/* 스포트라이트 효과 */}
      <motion.div
        className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      
      {/* 콘텐츠 */}
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * GlassSpotlightCard - Liquid Glass + Spotlight 결합 카드
 */
interface GlassSpotlightCardProps {
  children?: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function GlassSpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(127, 168, 201, 0.2)',
}: GlassSpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white/50 backdrop-blur-xl',
        'border border-white/60',
        'shadow-[0_8px_32px_rgba(127,168,201,0.08)]',
        'transition-shadow duration-300',
        'hover:shadow-[0_16px_64px_rgba(127,168,201,0.15)]',
        className
      )}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * NeonCard - 네온 글로우 테두리 카드
 */
interface NeonCardProps {
  children?: React.ReactNode;
  className?: string;
  neonColors?: { firstColor: string; secondColor: string };
  borderSize?: number;
  borderRadius?: number;
}

export function NeonCard({
  children,
  className,
  neonColors = { firstColor: '#7fa8c9', secondColor: '#f2f8fc' },
  borderSize = 2,
  borderRadius = 20,
}: NeonCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [children]);

  return (
    <div
      ref={containerRef}
      style={{
        '--border-size': `${borderSize}px`,
        '--border-radius': `${borderRadius}px`,
        '--neon-first-color': neonColors.firstColor,
        '--neon-second-color': neonColors.secondColor,
        '--card-content-radius': `${borderRadius - borderSize}px`,
        '--after-blur': `${dimensions.width / 4}px`,
      } as React.CSSProperties}
      className={cn(
        'relative z-10 size-full rounded-[var(--border-radius)]',
        className
      )}
    >
      <div
        className={cn(
          'relative size-full min-h-[inherit] rounded-[var(--card-content-radius)] bg-white/80 backdrop-blur-xl p-6',
          // Border gradient
          'before:absolute before:-top-[var(--border-size)] before:-left-[var(--border-size)] before:-z-10 before:block',
          'before:h-[calc(100%+var(--border-size)*2)] before:w-[calc(100%+var(--border-size)*2)] before:rounded-[var(--border-radius)]',
          'before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] before:bg-[length:100%_200%]',
          'before:animate-gradient-spin',
          // Glow effect
          'after:absolute after:-top-[var(--border-size)] after:-left-[var(--border-size)] after:-z-10 after:block',
          'after:h-[calc(100%+var(--border-size)*2)] after:w-[calc(100%+var(--border-size)*2)] after:rounded-[var(--border-radius)]',
          'after:blur-[var(--after-blur)] after:opacity-50',
          'after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:bg-[length:100%_200%]',
          'after:animate-gradient-spin'
        )}
      >
        {children}
      </div>
    </div>
  );
}
