'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, ZoomIn, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HighlightReveal } from './UnderlineReveal';

interface StepItem {
  id: string;
  number: string;
  title: string;
  content: ReactNode;
}

interface AccordionStepProps {
  items: StepItem[];
  className?: string;
  defaultOpenAll?: boolean;
}

/**
 * AccordionStep - Accordion-style step component
 *
 * Features:
 * - All items open by default (optional)
 * - Multiple items can be open simultaneously
 * - Click to toggle individual items
 * - Smooth height animation
 * - Step numbers with visual indicator
 * - Mobile responsive
 */
export function AccordionStep({
  items,
  className = '',
  defaultOpenAll = true,
}: AccordionStepProps) {
  // 기본값: 모든 아이템 열기
  const [openItems, setOpenItems] = useState<Set<string>>(
    defaultOpenAll ? new Set(items.map((item) => item.id)) : new Set()
  );

  const toggleItem = (id: string) => {
    // 클릭 시 해당 아이템만 토글 (다른 아이템에 영향 없음)
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <AccordionStepItem
          key={item.id}
          item={item}
          index={index}
          isOpen={openItems.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
}

interface AccordionStepItemProps {
  item: StepItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionStepItem({
  item,
  index,
  isOpen,
  onToggle,
}: AccordionStepItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-[#7fa8c9]/10 last:border-b-0"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 md:gap-6 py-6 text-left group"
      >
        {/* Step number */}
        <div className="flex-shrink-0">
          <motion.div
            className={`
              w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
              text-base md:text-lg font-medium transition-colors duration-300
              ${isOpen
                ? 'bg-[#7fa8c9] text-white'
                : 'bg-[#f2f8fc] text-[#7fa8c9] group-hover:bg-[#7fa8c9]/20'
              }
            `}
          >
            {item.number}
          </motion.div>
        </div>

        {/* Title */}
        <div className="flex-grow">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#1a1a1a]">
            {item.title}
          </h3>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 text-[#7fa8c9]"
        >
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-14 md:pl-[72px]">
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * DesignStepContent - Content for Step 02 with images and "무료" emphasis
 */
interface DesignStepContentProps {
  description: string;
  images: { src: string; alt: string }[];
  freeEmphasis: string;
}

export function DesignStepContent({
  description,
  images,
}: DesignStepContentProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const t = useTranslations('Components.Accordion');

  return (
    <div className="space-y-8">
      <p className="text-[#1a1a1a]/60 text-base md:text-lg">
        {description}
      </p>

      {/* 3 Tall images in a row */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setLightboxImage(image.src)}
            className="relative aspect-[3/5] overflow-hidden rounded-lg md:rounded-xl group cursor-zoom-in"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-[#1a1a1a]" />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* FREE emphasis - 단색 파랑, 가독성 개선 */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xl md:text-2xl lg:text-3xl text-[#1a1a1a] leading-relaxed">
          {t('prefix')}{' '}
          <HighlightReveal color="#7fa8c9" delay={0.3}>
            <span className="font-semibold text-[#1a1a1a]">
              {t('freeText')}
            </span>
          </HighlightReveal>
          {' '}{t('suffix')}
        </p>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <button
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * SimpleStep - Non-accordion step list
 */
interface SimpleStepProps {
  items: { number: string; title: string; description?: string }[];
  className?: string;
}

export function SimpleStep({ items, className = '' }: SimpleStepProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
          className="flex items-start gap-4 md:gap-6"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f2f8fc] flex items-center justify-center text-[#7fa8c9] font-medium flex-shrink-0">
            {item.number}
          </div>
          <div className="pt-2">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#1a1a1a] mb-1">
            {item.title}
          </h3>
            {item.description && (
              <p className="text-[#1a1a1a]/60 text-sm md:text-base">{item.description}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default AccordionStep;
