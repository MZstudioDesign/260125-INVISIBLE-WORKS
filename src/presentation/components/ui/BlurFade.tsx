'use client';

import { useRef } from 'react';
import {
  AnimatePresence,
  motion,
  MotionProps,
  useInView,
  Variants,
} from 'framer-motion';
import { cn } from '@/lib/utils';

type MarginType = `${number}${'px' | '%'}` | `${number}${'px' | '%'} ${number}${'px' | '%'}`;

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
}

/**
 * BlurFade - Magic UI 스타일 blur + fade 애니메이션 컴포넌트
 * 
 * @description 요소가 뷰포트에 진입할 때 블러와 함께 페이드인 되는 효과
 * @see https://magicui.design/docs/components/blur-fade
 */
export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = 'up',
  inView = true,
  inViewMargin = '-50px',
  blur = '6px',
  ...props
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin as any });
  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = {
    hidden: {
      [direction === 'left' || direction === 'right' ? 'x' : 'y']:
        direction === 'right' || direction === 'down' ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [direction === 'left' || direction === 'right' ? 'x' : 'y']: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
  };

  const combinedVariants = variant || defaultVariants;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: 'easeOut',
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * BlurFadeStagger - 자식 요소들에 stagger 효과를 적용하는 컨테이너
 */
interface BlurFadeStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  inView?: boolean;
}

export function BlurFadeStagger({
  children,
  className,
  staggerDelay = 0.15,
  inView = true,
}: BlurFadeStaggerProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: '-50px' });
  const isInView = !inView || inViewResult;

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

/**
 * BlurFadeItem - BlurFadeStagger 내부에서 사용하는 자식 요소
 */
interface BlurFadeItemProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function BlurFadeItem({
  children,
  className,
  direction = 'up',
}: BlurFadeItemProps) {
  const offset = 20;
  
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const offsetValue = direction === 'right' || direction === 'down' ? -offset : offset;

  const item: Variants = {
    hidden: {
      ...(axis === 'x' ? { x: offsetValue } : { y: offsetValue }),
      opacity: 0,
      filter: 'blur(6px)',
    },
    visible: {
      ...(axis === 'x' ? { x: 0 } : { y: 0 }),
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div className={cn(className)} variants={item}>
      {children}
    </motion.div>
  );
}
