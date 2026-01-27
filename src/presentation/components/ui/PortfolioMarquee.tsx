'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// ============================================
// Types
// ============================================

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  href?: string;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  className?: string;
}

interface MarqueeProps {
  children: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

interface PortfolioMarqueeProps {
  items?: PortfolioItem[];
  pauseOnHover?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

// ============================================
// Default Portfolio Items (Stock Images)
// ============================================

const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modern E-Commerce',
    category: '웹사이트',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&q=80',
    href: '/portfolio/1',
  },
  {
    id: '2',
    title: 'Creative Agency',
    category: '랜딩페이지',
    imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop&q=80',
    href: '/portfolio/2',
  },
  {
    id: '3',
    title: 'SaaS Dashboard',
    category: '웹앱',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&q=80',
    href: '/portfolio/3',
  },
  {
    id: '4',
    title: 'Restaurant Branding',
    category: '웹사이트',
    imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop&q=80',
    href: '/portfolio/4',
  },
  {
    id: '5',
    title: 'Fitness Platform',
    category: '웹앱',
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop&q=80',
    href: '/portfolio/5',
  },
  {
    id: '6',
    title: 'Tech Startup',
    category: '랜딩페이지',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop&q=80',
    href: '/portfolio/6',
  },
  {
    id: '7',
    title: 'Portfolio Site',
    category: '웹사이트',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=500&fit=crop&q=80',
    href: '/portfolio/7',
  },
  {
    id: '8',
    title: 'Education Platform',
    category: '웹앱',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop&q=80',
    href: '/portfolio/8',
  },
];

// ============================================
// PortfolioCard Component
// ============================================

export function PortfolioCard({ item, className }: PortfolioCardProps) {
  const CardContent = (
    <motion.div
      className={cn(
        'relative group overflow-hidden rounded-2xl',
        'bg-white/85 backdrop-blur-xl',
        'border-2 border-[#7fa8c9]/20',
        'shadow-[0_8px_32px_rgba(127,168,201,0.1)]',
        'transition-all duration-500 ease-out',
        'hover:border-[#7fa8c9]/40',
        'hover:shadow-[0_16px_48px_rgba(127,168,201,0.2)]',
        'w-[320px] md:w-[380px] flex-shrink-0',
        className
      )}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 320px, 380px"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium',
            'bg-white/90 backdrop-blur-md text-[#1a1a1a]',
            'border border-[#7fa8c9]/20',
            'shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
          )}>
            {item.category}
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
          {item.title}
        </h3>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7fa8c9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
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
        'group flex overflow-hidden [--gap:1.5rem]',
        pauseOnHover && '[&:hover>div]:animation-play-state-paused',
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
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
          style={{
            animationDuration: 'var(--duration)',
          }}
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
  items = defaultPortfolioItems,
  pauseOnHover = true,
  speed = 'normal',
  className,
}: PortfolioMarqueeProps) {
  // Split items for two rows
  const firstRowItems = items.slice(0, Math.ceil(items.length / 2));
  const secondRowItems = items.slice(Math.ceil(items.length / 2));

  return (
    <section
      id="portfolio"
      className={cn(
        'relative py-24 md:py-32 overflow-hidden',
        className
      )}
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6">
            우리가 만든 것들
          </h2>
          <p className="text-lg text-[#1a1a1a]/60 max-w-2xl mx-auto">
            신뢰를 쌓아온 결과물들입니다
          </p>
        </motion.div>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-8">
        {/* First Row - Normal Direction */}
        <Marquee pauseOnHover={pauseOnHover} speed={speed}>
          {firstRowItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </Marquee>

        {/* Second Row - Reverse Direction */}
        <Marquee pauseOnHover={pauseOnHover} speed={speed} reverse>
          {secondRowItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </Marquee>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-16"
      >
        <Link
          href="/portfolio"
          className={cn(
            'inline-flex items-center gap-3 px-8 py-4 rounded-2xl',
            'bg-white/85 backdrop-blur-xl',
            'border-2 border-[#7fa8c9]/25',
            'text-[#1a1a1a] font-medium text-lg',
            'shadow-[0_8px_32px_rgba(127,168,201,0.12)]',
            'hover:border-[#7fa8c9]/50 hover:shadow-[0_12px_40px_rgba(127,168,201,0.2)]',
            'transition-all duration-300',
            'group'
          )}
        >
          더 많은 작업물 보러가기
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
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
