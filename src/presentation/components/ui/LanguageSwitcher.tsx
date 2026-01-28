'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
}

const locales = [
  { code: 'ko', label: '한국어', short: 'KO' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh-CN', label: '简体中文', short: '简' },
  { code: 'zh-TW', label: '繁體中文', short: '繁' },
];

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // 현재 locale 추출
  const currentLocale = pathname.split('/')[1] || 'ko';
  const currentLocaleInfo = locales.find(l => l.code === currentLocale) || locales[0];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 언어 변경
  const handleLocaleChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(ko|en|zh-CN|zh-TW)/, '');
    router.push(`/${newLocale}${pathWithoutLocale || '/'}`);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'text-sm font-medium text-[#1a1a1a]/70',
          'hover:bg-[#f2f8fc] hover:text-[#1a1a1a]',
          'transition-colors duration-200',
          isOpen && 'bg-[#f2f8fc] text-[#1a1a1a]'
        )}
      >
        <Globe className="w-4 h-4" />
        <span>{variant === 'compact' ? currentLocaleInfo.short : currentLocaleInfo.label}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full right-0 mt-2 min-w-[140px]',
              'bg-white/95 backdrop-blur-xl',
              'border border-[#7fa8c9]/20',
              'rounded-xl shadow-[0_8px_32px_rgba(127,168,201,0.15)]',
              'overflow-hidden z-50'
            )}
          >
            {locales.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleLocaleChange(locale.code)}
                className={cn(
                  'w-full px-4 py-3 text-left text-sm',
                  'transition-colors duration-200',
                  currentLocale === locale.code
                    ? 'bg-[#f2f8fc] text-[#7fa8c9] font-medium'
                    : 'text-[#1a1a1a]/70 hover:bg-[#f2f8fc] hover:text-[#1a1a1a]'
                )}
              >
                <span className="mr-2">{locale.short}</span>
                {locale.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSwitcher;
