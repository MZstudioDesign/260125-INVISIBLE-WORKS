'use client';

import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface GlassDividerProps {
  variant?: 'line' | 'gradient' | 'dots' | 'wave';
  className?: string;
}

export function GlassDivider({ variant = 'line', className }: GlassDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  if (variant === 'line') {
    return (
      <motion.div
        ref={ref}
        className={cn('w-full h-px bg-gradient-to-r from-transparent via-[#7fa8c9]/30 to-transparent', className)}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
    );
  }

  if (variant === 'gradient') {
    return (
      <motion.div
        ref={ref}
        className={cn('w-full h-24 relative', className)}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f2f8fc]/50 to-transparent" />
      </motion.div>
    );
  }

  if (variant === 'dots') {
    return (
      <motion.div
        ref={ref}
        className={cn('flex justify-center gap-2 py-8', className)}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#7fa8c9]/40"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          />
        ))}
      </motion.div>
    );
  }

  if (variant === 'wave') {
    return (
      <motion.div
        ref={ref}
        className={cn('w-full overflow-hidden py-12', className)}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="w-full h-8"
        >
          <motion.path
            d="M0,30 Q150,0 300,30 T600,30 T900,30 T1200,30"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(127,168,201,0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    );
  }

  return null;
}
