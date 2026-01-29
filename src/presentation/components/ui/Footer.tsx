'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface FooterProps {
  className?: string;
  locale?: string;
}

/**
 * Footer - CTA + 3등분 레이아웃 푸터
 * 
 * - CTA: 흰색, full-width
 * - 하단: 좌측 텍스트 | 중앙 로고 | 우측 텍스트
 */
export function Footer({ className = '', locale = 'ko' }: FooterProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const t = useTranslations('Footer');

  // 언어별 줄바꿈 클래스
  const breakClass = locale === 'ko' ? 'break-keep' 
    : locale.startsWith('zh') ? '' 
    : 'hyphens-auto';

  // CTA 텍스트 (언어별)
  const ctaText: Record<string, { mobile: string[]; desktop: string }> = {
    ko: {
      mobile: ['내 웹사이트 디자인', '보러 가기'],
      desktop: '내 웹사이트 디자인 보러 가기',
    },
    en: {
      mobile: ['See your website', 'design'],
      desktop: 'See your website design',
    },
    'zh-CN': {
      mobile: ['查看您的', '网站设计'],
      desktop: '查看您的网站设计',
    },
    'zh-TW': {
      mobile: ['查看您的', '網站設計'],
      desktop: '查看您的網站設計',
    },
  };

  const currentCTA = ctaText[locale] || ctaText['ko'];

  return (
    <footer ref={ref} className={`relative flex flex-col ${className}`}>
      {/* CTA Section - 흰 배경, 검정 글씨 */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-32">
          <motion.a
            href={`/${locale}/contact`}
            className="group flex flex-col-reverse md:flex-row items-center justify-center gap-4 md:gap-8 w-full text-[#1a1a1a] hover:text-[#1a1a1a]/70 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Text - Full width, responsive */}
            <span className={`text-[7vw] sm:text-[6vw] md:text-[5vw] lg:text-[4.5vw] xl:text-[4vw] font-semibold leading-tight text-center ${breakClass}`}>
              {/* Mobile: two lines */}
              <span className="md:hidden">
                {currentCTA.mobile[0]}<br />{currentCTA.mobile[1]}
              </span>
              {/* Desktop: single line */}
              <span className="hidden md:inline">
                {currentCTA.desktop}
              </span>
            </span>

            {/* Arrow - 모바일에서 더 크게 & 위에 배치 */}
            <motion.span
              className="flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <ArrowUpRight className="w-12 h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.span>
          </motion.a>
        </div>
      </div>

      {/* Footer Content - 3등분 (좌측 텍스트 | 중앙 로고 | 우측 텍스트) */}
      <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-end">
          {/* Left - Company Info */}
          <motion.div
            className="space-y-2 text-sm text-white/60 text-center md:text-left order-1 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <p className="text-white/80 font-medium">
              {locale === 'ko' ? '엠지쓰스튜디오' : 'MZS STUDIO'}
            </p>
            <p>{locale === 'ko' ? '대표 오유택' : 'CEO Yutaek Oh'}</p>
            <p>{locale === 'ko' ? '사업자등록번호 377-44-01126' : 'Business No. 377-44-01126'}</p>
            <p className="pt-2">
              <a
                href="mailto:invisibleworks.office@gmail.com"
                className="text-white/80 hover:text-[#60a5fa] transition-colors"
              >
                invisibleworks.office@gmail.com
              </a>
            </p>
          </motion.div>

          {/* Center - Logo (모바일에서 맨 아래로) */}
          <motion.div
            className="flex justify-center items-end order-3 md:order-2 self-end pt-6 md:pt-0"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Logo */}
            <Image
              src="/user_source/logo/logo-white.png"
              alt="Invisible Works"
              width={280}
              height={70}
              className="h-16 md:h-20 lg:h-24 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </motion.div>

          {/* Right - Address & Legal */}
          <motion.div
            className="space-y-2 text-sm text-white/60 text-center md:text-right order-2 md:order-3"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p>{locale === 'ko' ? '대구광역시 중구 남산동 677-58' : 'Daegu, South Korea'}</p>
            <p>{locale === 'ko' ? '명륜로21길 33-11' : ''}</p>
            <p className="pt-2 text-white/50">{t('copyright')}</p>
            <div className="flex gap-4 justify-center md:justify-end pt-1">
              <a
                href={`/${locale}/privacy`}
                className="hover:text-[#60a5fa] transition-colors underline underline-offset-2"
              >
                {t('links.privacy')}
              </a>
              <a
                href={`/${locale}/terms`}
                className="hover:text-[#60a5fa] transition-colors underline underline-offset-2"
              >
                {t('links.terms')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      </div>

      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#60a5fa]/30 to-transparent" />
    </footer>
  );
}

/**
 * SimpleFooter - Minimal footer variant
 */
interface SimpleFooterProps {
  companyName: string;
  copyright?: string;
  links?: { label: string; href: string }[];
  className?: string;
  variant?: 'light' | 'dark';
}

export function SimpleFooter({
  companyName,
  copyright,
  links = [],
  className = '',
  variant = 'dark',
}: SimpleFooterProps) {
  const variants = {
    light: 'bg-[#fafbfc] text-[#1a1a1a] border-t border-[#7fa8c9]/10',
    dark: 'bg-black text-white',
  };

  return (
    <footer className={`py-8 px-6 ${variants[variant]} ${className}`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className={`text-sm ${variant === 'dark' ? 'text-white/70' : 'text-[#1a1a1a]/70'}`}>
            {companyName}
          </p>
          {copyright && (
            <p className={`text-xs mt-1 ${variant === 'dark' ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
              {copyright}
            </p>
          )}
        </div>

        {links.length > 0 && (
          <div className="flex gap-6">
            {links.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className={`text-xs hover:text-[#60a5fa] transition-colors underline underline-offset-2 ${
                  variant === 'dark' ? 'text-white/50' : 'text-[#1a1a1a]/50'
                }`}
                whileHover={{ y: -1 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

/**
 * FooterSection - Reusable footer section block
 */
interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FooterSection({ title, children, className = '' }: FooterSectionProps) {
  return (
    <div className={className}>
      <h4 className="text-sm font-medium text-white/70 mb-4">{title}</h4>
      {children}
    </div>
  );
}

export default Footer;
