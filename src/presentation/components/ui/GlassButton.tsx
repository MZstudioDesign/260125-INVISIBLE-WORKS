'use client';

import React, { CSSProperties } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * GlassButton - 리플 효과가 내장된 Glass 버튼
 * 
 * @variant outline - 투명 배경 + 아쿠아 보더
 * @variant accent - 아쿠아 배경 (강조용)
 */
export function GlassButton({
  children,
  variant = 'outline',
  size = 'md',
  className,
  onClick,
  ...props
}: GlassButtonProps) {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const baseStyles = cn(
    'relative inline-flex items-center justify-center font-medium',
    'transition-all duration-300 ease-out',
    'disabled:opacity-50 disabled:pointer-events-none',
    'overflow-hidden'
  );

  const variants = {
    outline: cn(
      'bg-white/60 backdrop-blur-xl',
      'border-2 border-[#7fa8c9]/30',
      'text-[#1a1a1a]',
      'hover:bg-white/80 hover:border-[#7fa8c9]/50 hover:shadow-[0_8px_24px_rgba(127,168,201,0.15)]'
    ),
    accent: cn(
      'bg-[#7fa8c9]/90 backdrop-blur-xl',
      'border border-[#7fa8c9]',
      'text-white',
      'shadow-[0_4px_16px_rgba(127,168,201,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]',
      'hover:bg-[#7fa8c9] hover:shadow-[0_8px_24px_rgba(127,168,201,0.4)]'
    ),
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
    md: 'px-6 py-3 text-base rounded-xl gap-2',
    lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
  };

  const rippleColor = variant === 'accent' 
    ? 'rgba(255, 255, 255, 0.4)' 
    : 'rgba(127, 168, 201, 0.4)';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    if (onClick) {
      (onClick as React.MouseEventHandler<HTMLButtonElement>)(e);
    }
  };

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute animate-ripple rounded-full pointer-events-none"
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
      
      {/* Shine effect on hover */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full pointer-events-none"
        whileHover={{ translateX: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
