'use client';

import { motion, useInView, Variants, useAnimation } from 'framer-motion';
import { useRef, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'fade' | 'slide' | 'mask' | 'blur';
  /** 호버 시 애니메이션 재실행 */
  replayOnHover?: boolean;
}

export function RevealText({
  children,
  className,
  delay = 0,
  duration = 0.8,
  variant = 'fade',
  replayOnHover = false,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: !replayOnHover, margin: '-100px' });
  const controls = useAnimation();

  const variants: Record<string, Variants> = {
    fade: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    },
    slide: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0 },
    },
    mask: {
      hidden: { clipPath: 'inset(0 100% 0 0)' },
      visible: { clipPath: 'inset(0 0% 0 0)' },
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const handleHoverStart = () => {
    if (replayOnHover) {
      controls.set('hidden');
      controls.start('visible');
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn('cursor-default', className)}
      initial="hidden"
      animate={controls}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onHoverStart={handleHoverStart}
    >
      {children}
    </motion.div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  staggerDelay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** 호버 시 애니메이션 재실행 */
  replayOnHover?: boolean;
}

export function SplitText({
  text,
  className,
  wordClassName,
  staggerDelay = 0.08,
  as: Component = 'p',
  replayOnHover = false,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: !replayOnHover, margin: '-50px' });
  const controls = useAnimation();

  const words = text.split(' ');

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const handleHoverStart = () => {
    if (replayOnHover) {
      controls.set('hidden');
      controls.start('visible');
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn('flex flex-wrap cursor-default', className)}
      variants={container}
      initial="hidden"
      animate={controls}
      onHoverStart={handleHoverStart}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={cn('mr-[0.25em]', wordClassName)}
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

interface CharacterRevealProps {
  text: string;
  className?: string;
  charClassName?: string;
  staggerDelay?: number;
  /** 호버 시 애니메이션 재실행 */
  replayOnHover?: boolean;
}

export function CharacterReveal({
  text,
  className,
  charClassName,
  staggerDelay = 0.03,
  replayOnHover = false,
}: CharacterRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: !replayOnHover, margin: '-50px' });
  const controls = useAnimation();

  const characters = text.split('');

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const handleHoverStart = () => {
    if (replayOnHover) {
      controls.set('hidden');
      controls.start('visible');
    }
  };

  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex cursor-default', className)}
      variants={container}
      initial="hidden"
      animate={controls}
      onHoverStart={handleHoverStart}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className={cn(char === ' ' ? 'w-[0.25em]' : '', charClassName)}
          variants={child}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
