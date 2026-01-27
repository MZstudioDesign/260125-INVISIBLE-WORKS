'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
}

interface GlassNavigationProps {
  logo?: ReactNode;
  items: NavItem[];
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function GlassNavigation({
  logo,
  items,
  cta,
  className,
}: GlassNavigationProps) {
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.3, 0.8]);
  const blur = useTransform(scrollY, [0, 100], [8, 16]);

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'px-6 py-4',
        className
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.nav
        className={cn(
          'max-w-6xl mx-auto',
          'flex items-center justify-between',
          'px-6 py-3',
          'border border-white/60 rounded-2xl',
          'shadow-[0_4px_24px_rgba(127,168,201,0.08)]'
        )}
        style={{
          backgroundColor: useTransform(
            backgroundOpacity,
            (v) => `rgba(255, 255, 255, ${v})`
          ),
          backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {logo || (
            <span className="text-xl font-semibold text-[#1a1a1a] tracking-tight">
              Invisible<span className="text-[#7fa8c9]">.</span>
            </span>
          )}
        </Link>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 rounded-lg',
                'text-sm font-medium text-[#1a1a1a]/70',
                'transition-all duration-300',
                'hover:text-[#1a1a1a] hover:bg-[#f2f8fc]/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        {cta && (
          <Link
            href={cta.href}
            className={cn(
              'px-5 py-2.5 rounded-xl',
              'text-sm font-medium',
              'bg-[#1a1a1a] text-white',
              'shadow-[0_4px_12px_rgba(26,26,26,0.15)]',
              'transition-all duration-300',
              'hover:shadow-[0_6px_20px_rgba(26,26,26,0.25)]',
              'hover:scale-[1.02]'
            )}
          >
            {cta.label}
          </Link>
        )}
      </motion.nav>
    </motion.header>
  );
}
