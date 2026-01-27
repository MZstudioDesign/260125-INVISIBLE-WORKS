'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MessageCircle, X, ArrowUp, Phone, Mail, Calendar } from 'lucide-react';

interface FloatingCTAProps {
  /** 메인 버튼 라벨 */
  label?: string;
  /** 메인 버튼 아이콘 */
  icon?: React.ReactNode;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 확장 메뉴 아이템 */
  expandItems?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }>;
  /** 위치 */
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

/**
 * FloatingCTA - 우측 하단 플로팅 CTA 버튼
 */
export function FloatingCTA({
  label = '문의하기',
  icon = <MessageCircle className="w-5 h-5" />,
  onClick,
  expandItems,
  position = 'bottom-right',
  className,
}: FloatingCTAProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향에 따라 표시/숨김
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed z-50',
            positionClasses[position],
            className
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Expand Menu */}
          <AnimatePresence>
            {isExpanded && expandItems && (
              <motion.div
                className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {expandItems.map((item, index) => (
                  <motion.button
                    key={index}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl',
                      'bg-white/90 backdrop-blur-xl',
                      'border border-[#7fa8c9]/20',
                      'shadow-[0_4px_16px_rgba(127,168,201,0.15)]',
                      'text-[#1a1a1a] text-sm font-medium',
                      'hover:bg-white transition-colors',
                      'whitespace-nowrap'
                    )}
                    onClick={item.onClick}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.icon}
                    {item.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            className={cn(
              'flex items-center gap-2 px-5 py-4 rounded-2xl',
              'bg-[#7fa8c9] text-white font-medium',
              'shadow-[0_8px_32px_rgba(127,168,201,0.4)]',
              'hover:bg-[#6a9bbf] transition-colors',
              'hover:shadow-[0_12px_40px_rgba(127,168,201,0.5)]'
            )}
            onClick={() => {
              if (expandItems) {
                setIsExpanded(!isExpanded);
              } else {
                onClick?.();
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? <X className="w-5 h-5" /> : icon}
            <span className="hidden sm:inline">{isExpanded ? '닫기' : label}</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * ScrollToTop - 맨 위로 스크롤 버튼
 */
interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export function ScrollToTop({ threshold = 400, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={cn(
            'fixed bottom-8 left-8 z-40',
            'p-4 rounded-full',
            'bg-white/85 backdrop-blur-xl',
            'border border-[#7fa8c9]/20',
            'shadow-[0_8px_32px_rgba(127,168,201,0.15)]',
            'text-[#7fa8c9]',
            'hover:bg-white hover:shadow-[0_12px_40px_rgba(127,168,201,0.2)]',
            'transition-all',
            className
          )}
          onClick={scrollToTop}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * ContactFAB - 연락처 플로팅 버튼 (확장형)
 */
export function ContactFAB() {
  return (
    <FloatingCTA
      label="문의하기"
      icon={<MessageCircle className="w-5 h-5" />}
      expandItems={[
        {
          icon: <Phone className="w-4 h-4 text-[#7fa8c9]" />,
          label: '전화 상담',
          onClick: () => window.open('tel:+821012345678'),
        },
        {
          icon: <Mail className="w-4 h-4 text-[#7fa8c9]" />,
          label: '이메일 문의',
          onClick: () => window.open('mailto:hello@invisible.works'),
        },
        {
          icon: <Calendar className="w-4 h-4 text-[#7fa8c9]" />,
          label: '미팅 예약',
          onClick: () => window.open('/contact'),
        },
      ]}
    />
  );
}
