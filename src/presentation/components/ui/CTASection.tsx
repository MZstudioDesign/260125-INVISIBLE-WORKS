'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CTASectionProps {
  text?: string;
  mobileText?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'dark' | 'light';
}

/**
 * CTASection - Full-width 텍스트 CTA
 * 
 * - 가로로 거의 화면 가득 차는 큰 텍스트
 * - 화면 크기에 맞춰 반응형
 * - 모바일에서 두 줄
 * - 가운데 정렬
 */
export function CTASection({
  text,
  mobileText,
  href = '#',
  onClick,
  className = '',
  variant = 'light',
}: CTASectionProps) {
  const t = useTranslations('Components.CTA');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const textColor = variant === 'dark' ? 'text-white' : 'text-[#7fa8c9]';
  const hoverColor = variant === 'dark' ? 'hover:text-white/80' : 'hover:text-[#5a8ab0]';
  
  const displayText = text || t('viewDesign');
  const displayMobileText = mobileText || t('viewDesignMobile');

  return (
    <div
      ref={ref}
      className={`py-12 md:py-16 text-center ${className}`}
    >
      <motion.a
        href={href}
        onClick={onClick}
        className={`group inline-flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full ${textColor} ${hoverColor} transition-colors`}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Text - Full width, responsive sizing */}
        <span className="text-[7vw] sm:text-[6vw] md:text-[5vw] lg:text-[4.5vw] xl:text-[4vw] font-semibold leading-tight text-center">
          {/* Mobile: break into two lines */}
          <span className="md:hidden whitespace-pre-line">
            {displayMobileText}
          </span>
          {/* Desktop: single line */}
          <span className="hidden md:inline">
            {displayText}
          </span>
        </span>

        {/* Arrow */}
        <motion.span
          className="flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </motion.span>
      </motion.a>
    </div>
  );
}

/**
 * CTAButton - Standalone CTA button
 */
interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'dark';
  className?: string;
}

export function CTAButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
}: CTAButtonProps) {
  const variants = {
    primary: 'bg-[#7fa8c9] text-white hover:bg-[#5a8ab0]',
    secondary: 'bg-white text-[#1a1a1a] hover:bg-[#f2f8fc]',
    dark: 'bg-[#1a1a1a] text-white hover:bg-black',
  };

  const baseStyles = `
    group inline-flex items-center gap-3
    px-8 py-4 rounded-full
    text-lg font-light
    transition-all duration-300
    hover:shadow-lg
    active:scale-[0.98]
  `;

  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}

/**
 * MinimalCTA - Text link style CTA
 */
interface MinimalCTAProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function MinimalCTA({
  children,
  href,
  onClick,
  className = '',
}: MinimalCTAProps) {
  const baseStyles = `
    group inline-flex items-center gap-2
    text-[#7fa8c9] hover:text-[#5a8ab0]
    text-lg font-medium
    transition-colors duration-300
  `;

  const content = (
    <>
      <span className="border-b-2 border-current pb-0.5">{children}</span>
      <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${className}`}>
      {content}
    </button>
  );
}

export default CTASection;
