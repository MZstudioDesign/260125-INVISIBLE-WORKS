'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavigationProps {
  logo?: React.ReactNode;
  items: NavItem[];
  cta?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * Navigation - Glass 스타일 상단 네비게이션
 * 
 * - 좌상단에 검정 로고 이미지
 */
export function Navigation({ logo, items, cta, className }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          className
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div
          className={cn(
            'mx-2 md:mx-4 mt-3 md:mt-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl',
            'transition-all duration-300',
            'bg-white/60 backdrop-blur-xl',
            'border border-white/40',
            isScrolled
              ? 'shadow-[0_8px_32px_rgba(127,168,201,0.15)] bg-white/70 border-[#7fa8c9]/20'
              : 'shadow-[0_4px_16px_rgba(127,168,201,0.08)]'
          )}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Logo - 가로 블랙 로고 */}
            <a href="/" className="flex items-center gap-2">
              {logo || (
                <Image
                  src="/user_source/logo/logo-horizontal-black.png"
                  alt="Invisible Works"
                  width={160}
                  height={24}
                  className="h-2.5 md:h-5 w-auto"
                  priority
                />
              )}
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    item.isActive
                      ? 'text-[#7fa8c9]'
                      : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Language Switcher & CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher variant="compact" />
              {cta && (
                <a
                  href={cta.href}
                  onClick={cta.onClick}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-sm font-medium',
                    'bg-[#7fa8c9] text-white',
                    'hover:bg-[#6a9bbf] transition-colors',
                    'shadow-[0_4px_16px_rgba(127,168,201,0.3)]'
                  )}
                >
                  {cta.label}
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#f2f8fc] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#1a1a1a]" />
              ) : (
                <Menu className="w-5 h-5 text-[#1a1a1a]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'md:hidden mx-2 mt-2 p-4 rounded-xl',
                'bg-white/90 backdrop-blur-xl',
                'border border-[#7fa8c9]/20',
                'shadow-[0_8px_32px_rgba(127,168,201,0.15)]'
              )}
            >
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      item.isActive
                        ? 'bg-[#f2f8fc] text-[#7fa8c9]'
                        : 'text-[#1a1a1a]/70 hover:bg-[#f2f8fc]'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {cta && (
                  <a
                    href={cta.href}
                    onClick={(e) => {
                      cta.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'mt-2 px-4 py-3 rounded-xl text-sm font-medium text-center',
                      'bg-[#7fa8c9] text-white',
                      'hover:bg-[#6a9bbf] transition-colors'
                    )}
                  >
                    {cta.label}
                  </a>
                )}
                {/* Mobile Language Switcher */}
                <div className="mt-4 pt-4 border-t border-[#7fa8c9]/20">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

/**
 * SideNavigation - 사이드 섹션 네비게이션
 */
interface SideNavigationProps {
  sections: Array<{ id: string; label: string }>;
  className?: string;
}

export function SideNavigation({ sections, className }: SideNavigationProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -60% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      className={cn(
        'fixed right-8 top-1/2 -translate-y-1/2 z-40',
        'hidden xl:block',
        className
      )}
    >
      <div
        className={cn(
          'px-4 py-6 rounded-2xl',
          'bg-white/85 backdrop-blur-xl',
          'border border-[#7fa8c9]/20',
          'shadow-[0_8px_32px_rgba(127,168,201,0.1)]'
        )}
      >
        <ul className="flex flex-col gap-3">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  'flex items-center gap-3 text-sm transition-all duration-300',
                  activeSection === section.id
                    ? 'text-[#7fa8c9] font-medium'
                    : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                    activeSection === section.id
                      ? 'bg-[#7fa8c9] scale-125'
                      : 'bg-[#1a1a1a]/30'
                  )}
                />
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
