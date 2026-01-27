'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LargeQuoteProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}

/**
 * LargeQuote - 큰 타이포그래피 컨테이너
 */
export function LargeQuote({
  children,
  className = '',
  align = 'left',
}: LargeQuoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      className={`${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * QuoteParagraph - 단일 문단 리빌 애니메이션
 */
interface QuoteParagraphProps {
  children: React.ReactNode;
  delay?: number;
  size?: 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold';
  className?: string;
  muted?: boolean;
}

export function QuoteParagraph({
  children,
  delay = 0,
  size = 'xl',
  weight = 'light',
  className = '',
  muted = false,
}: QuoteParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  const sizeClasses = {
    base: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl lg:text-3xl',
    '2xl': 'text-2xl md:text-3xl lg:text-4xl',
    '3xl': 'text-3xl md:text-4xl lg:text-5xl',
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
  };

  return (
    <motion.p
      ref={ref}
      className={`
        ${sizeClasses[size]}
        ${weightClasses[weight]}
        ${muted ? 'text-[#1a1a1a]/50' : 'text-[#1a1a1a]'}
        leading-relaxed
        ${className}
      `}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.p>
  );
}

/**
 * StoryQuote - Apple 스타일 + Why We Work 타이틀 (최종 선택)
 * 
 * 특징: 타이틀 + 한 줄씩 순차 등장
 */
interface StoryQuoteProps {
  title?: string;
  lines: {
    text: string;
    highlight?: string;
    muted?: boolean;
  }[];
  className?: string;
}

export function StoryQuote({ title, lines, className = '' }: StoryQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-15%' });

  return (
    <div ref={containerRef} className={className}>
      {/* Title - Why We Work 스타일 */}
      {title && (
        <motion.p
          className="text-sm md:text-base text-[#7fa8c9] font-medium tracking-wider uppercase mb-10 md:mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.p>
      )}

      {/* Lines - Apple 스타일 순차 등장 */}
      <div className="space-y-6 md:space-y-8">
        {lines.map((line, lineIndex) => (
          <motion.div
            key={lineIndex}
            className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight tracking-tight ${
              line.muted ? 'text-[#1a1a1a]/40' : 'text-[#1a1a1a]'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 + lineIndex * 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {line.highlight ? (
              <>
                {line.text.split(line.highlight)[0]}
                <span className="text-[#7fa8c9] font-medium">{line.highlight}</span>
                {line.text.split(line.highlight)[1]}
              </>
            ) : (
              line.text
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * StorySection - 스토리텔링 섹션
 */
interface StorySectionProps {
  paragraphs: {
    text: string;
    emphasis?: boolean;
    highlight?: string;
  }[];
  className?: string;
}

export function StorySection({ paragraphs, className = '' }: StorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <section ref={containerRef} className={`relative py-32 md:py-48 ${className}`}>
      <div className="max-w-4xl mx-auto px-6 space-y-16 md:space-y-24">
        {paragraphs.map((para, index) => (
          <motion.p
            key={index}
            className={`
              text-xl md:text-2xl lg:text-3xl leading-relaxed
              ${para.emphasis ? 'font-medium text-[#1a1a1a]' : 'font-light text-[#1a1a1a]/80'}
            `}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
          >
            {para.highlight && para.text.includes(para.highlight) ? (
              <>
                {para.text.split(para.highlight)[0]}
                <span className="font-medium text-[#7fa8c9]">{para.highlight}</span>
                {para.text.split(para.highlight)[1]}
              </>
            ) : (
              para.text
            )}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

/**
 * QuoteBlock - 멀티 문단 블록
 */
interface QuoteBlockProps {
  paragraphs: string[];
  className?: string;
  spacing?: 'normal' | 'wide';
}

export function QuoteBlock({
  paragraphs,
  className = '',
  spacing = 'wide',
}: QuoteBlockProps) {
  const spacingClasses = {
    normal: 'space-y-4',
    wide: 'space-y-8 md:space-y-12',
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
      {paragraphs.map((text, index) => (
        <QuoteParagraph key={index} delay={index * 0.15}>
          {text}
        </QuoteParagraph>
      ))}
    </div>
  );
}

/**
 * HighlightQuote - 하이라이트 강조 인용
 */
interface HighlightQuoteProps {
  before?: string;
  highlight: string;
  after?: string;
  className?: string;
}

export function HighlightQuote({
  before = '',
  highlight,
  after = '',
  className = '',
}: HighlightQuoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      className={`text-xl md:text-2xl lg:text-3xl font-light leading-relaxed ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {before && <span className="text-[#1a1a1a]/70">{before}</span>}
      <motion.span
        className="font-medium text-[#7fa8c9]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {highlight}
      </motion.span>
      {after && <span className="text-[#1a1a1a]/70">{after}</span>}
    </motion.div>
  );
}

export default LargeQuote;
