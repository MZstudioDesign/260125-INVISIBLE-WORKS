'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { GlassButton } from './GlassButton';
import { useTranslations } from 'next-intl';
import {
  portfolioProjects,
  getRandomProjects,
  type PortfolioProject,
  type CategoryKey,
} from '@/data/portfolio-projects';

// ============================================
// Types
// ============================================

export type { CategoryKey };
export type PortfolioItem = PortfolioProject;

interface PortfolioCardProps {
  project: PortfolioProject;
  className?: string;
  categoryLabel?: string;
  locale?: string;
}

interface MarqueeProps {
  children: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

interface PortfolioMarqueeProps {
  items?: PortfolioProject[];
  pauseOnHover?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  locale?: string;
}

// ============================================
// PortfolioCard Component
// ============================================

export function PortfolioCard({ project, className, categoryLabel, locale = 'ko' }: PortfolioCardProps) {
  return (
    <Link href={`/${locale}/portfolio?open=${project.id}`} className="block">
      <motion.div
        className={cn(
          'relative group overflow-hidden rounded-2xl',
          'bg-white/85 backdrop-blur-xl',
          'border-2 border-[#7fa8c9]/20',
          'shadow-[0_8px_32px_rgba(127,168,201,0.1)]',
          'transition-all duration-500 ease-out',
          'hover:border-[#7fa8c9]/40',
          'hover:shadow-[0_16px_48px_rgba(127,168,201,0.2)]',
          'w-[260px] md:w-[350px] flex-shrink-0',
          className
        )}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 320px, 380px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium',
              'bg-white/90 backdrop-blur-md text-[#1a1a1a]',
              'border border-[#7fa8c9]/20',
              'shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
            )}>
              {categoryLabel || project.category}
            </span>
          </div>

          {/* Hover Arrow */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              'bg-[#7fa8c9] text-white',
              'shadow-[0_4px_16px_rgba(127,168,201,0.4)]'
            )}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-[#1a1a1a] group-hover:text-[#7fa8c9] transition-colors duration-300">
            {project.name}
          </h3>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7fa8c9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </Link>
  );
}

// ============================================
// Marquee Component
// ============================================

function Marquee({
  children,
  reverse = false,
  pauseOnHover = true,
  className,
  speed = 'normal',
}: MarqueeProps) {
  const speedMap = {
    slow: '60s',
    normal: '40s',
    fast: '25s',
  };

  return (
    <div
      className={cn(
        'flex overflow-hidden [--gap:1.5rem]',
        className
      )}
      style={{ '--duration': speedMap[speed] } as React.CSSProperties}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 gap-[var(--gap)] pr-[var(--gap)]',
            'animate-marquee',
            reverse && 'animate-marquee-reverse',
          )}
          style={{ animationDuration: 'var(--duration)' }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

// ============================================
// PortfolioMarquee Section Component
// ============================================

export function PortfolioMarquee({
  pauseOnHover = true,
  speed = 'normal',
  className,
  locale = 'ko',
}: PortfolioMarqueeProps) {
  const t = useTranslations('Portfolio');
  const tCategories = useTranslations('PortfolioCategories');

  const breakClass = locale === 'ko' ? 'break-keep'
    : locale.startsWith('zh') ? ''
    : 'hyphens-auto';

  // Pick 10 random projects, stable per mount
  const randomProjects = useMemo(() => getRandomProjects(10), []);
  const firstRow = randomProjects.slice(0, 5);
  const secondRow = randomProjects.slice(5);

  return (
    <section
      id="portfolio"
      className={cn('relative py-24 md:py-32 overflow-hidden', className)}
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <span className={cn(
            'inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium',
            'bg-[#f2f8fc] text-[#7fa8c9]',
            'border border-[#7fa8c9]/20'
          )}>
            Portfolio
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6 ${breakClass}`}>
            <span className="md:hidden whitespace-pre-line">{t('titleMobile')}</span>
            <span className="hidden md:inline">{t('title')}</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-8">
        <Marquee pauseOnHover={pauseOnHover} speed={speed}>
          {firstRow.map((project) => (
            <PortfolioCard
              key={project.id}
              project={project}
              categoryLabel={tCategories(project.category)}
              locale={locale}
            />
          ))}
        </Marquee>

        <Marquee pauseOnHover={pauseOnHover} speed={speed} reverse>
          {secondRow.map((project) => (
            <PortfolioCard
              key={project.id}
              project={project}
              categoryLabel={tCategories(project.category)}
              locale={locale}
            />
          ))}
        </Marquee>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-16"
      >
        <Link href={`/${locale}/portfolio`}>
          <GlassButton variant="outline" size="lg" className="gap-3 text-lg">
            {t('cta')}
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </GlassButton>
        </Link>
      </motion.div>

      {/* Background Decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#7fa8c9]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#7fa8c9]/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}

// ============================================
// PortfolioSection - Full Section with Background
// ============================================

export function PortfolioSection(props: PortfolioMarqueeProps) {
  return (
    <div className="relative bg-gradient-to-b from-white via-[#f2f8fc]/30 to-white">
      <PortfolioMarquee {...props} />
    </div>
  );
}
