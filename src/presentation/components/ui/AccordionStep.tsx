'use client';

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, ZoomIn, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { HighlightReveal } from './UnderlineReveal';
import { PortfolioModal } from './PortfolioModal';
import {
  REPRESENTATIVE_CATEGORIES,
  REPRESENTATIVE_PROJECTS,
  getProjectById,
  type PortfolioProject,
  type CategoryKey,
} from '@/data/portfolio-projects';

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
 * DesignStepContent - Content for Step 02 with category segment buttons,
 * real portfolio examples, and iframe modal with viewport toggle
 */
interface DesignStepContentProps {
  description: string;
  images?: { src: string; alt: string }[];
  freeEmphasis?: string;
}

export function DesignStepContent({
  description,
}: DesignStepContentProps) {
  const t = useTranslations('Components.Accordion');
  const tCategories = useTranslations('PortfolioCategories');
  const tModal = useTranslations('PortfolioModal');

  const [activeCategory, setActiveCategory] = useState<string>('education');
  const [activeDesignIndex, setActiveDesignIndex] = useState(0);
  const [modalProject, setModalProject] = useState<PortfolioProject | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const categoryButtons: { key: CategoryKey; label: string }[] = REPRESENTATIVE_CATEGORIES.map(key => ({
    key,
    label: tCategories(key),
  }));

  const currentProjectId = REPRESENTATIVE_PROJECTS[activeCategory];
  const currentProject = getProjectById(currentProjectId);

  // Reset design index when category changes
  useEffect(() => {
    setActiveDesignIndex(0);
  }, [activeCategory]);

  // Auto-rotate designs every 5 seconds
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveDesignIndex(prev => (prev + 1) % 3);
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeCategory, startAutoPlay]);

  const handleDesignClick = (index: number) => {
    setActiveDesignIndex(index);
    // Reset auto-play timer on manual selection
    startAutoPlay();
  };

  const activeDesign = currentProject?.designs[activeDesignIndex];

  return (
    <div className="space-y-6">
      <p className="text-[#1a1a1a]/60 text-base md:text-lg">
        {description}
      </p>

      {/* Category Segment Buttons */}
      <div className="flex flex-wrap gap-2">
        {categoryButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
              activeCategory === key
                ? 'bg-[#1a1a1a] text-white shadow-md'
                : 'bg-[#f2f8fc] text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#e8f0f6] border border-[#7fa8c9]/10'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Project Name */}
      <AnimatePresence mode="wait">
        {currentProject && (
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-[#7fa8c9] font-medium mb-1">{tCategories(currentProject.category)}</p>
            <h4 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">{currentProject.name}</h4>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A-Plan: Large Preview + Small Thumbnails */}
      <AnimatePresence mode="wait">
        {currentProject && activeDesign && (
          <motion.div
            key={currentProject.id + '-showcase'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4"
          >
            {/* Large Preview — tall frame to show full-page content */}
            <motion.button
              onClick={() => setModalProject(currentProject)}
              className={cn(
                'relative w-full overflow-hidden rounded-xl md:rounded-2xl group cursor-pointer',
                'bg-[#f2f8fc] border-2 border-[#7fa8c9]/15',
                'hover:border-[#7fa8c9]/30 transition-all duration-300'
              )}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDesign.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeDesign.thumbnail}
                      alt={`${currentProject.name} Design ${activeDesignIndex + 1}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 700px"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom fade — implies more content below */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

                {/* Click-to-explore overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg">
                        <ZoomIn className="w-6 h-6 text-[#1a1a1a]" />
                      </div>
                      <span className="text-white text-sm font-medium drop-shadow-lg">
                        {t('clickToExplore')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Design label */}
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium',
                    'bg-white/90 backdrop-blur-md text-[#1a1a1a]',
                    'border border-[#7fa8c9]/20 shadow-sm'
                  )}>
                    {tModal('designLabel', { number: activeDesignIndex + 1 })}
                  </span>
                </div>

                {/* Scroll hint at bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/80 drop-shadow-lg" />
                  </motion.div>
                </div>
              </div>
            </motion.button>

            {/* Small Thumbnail Selector (3 side by side) */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {currentProject.designs.map((design, index) => (
                <button
                  key={design.id}
                  onClick={() => handleDesignClick(index)}
                  className={cn(
                    'relative aspect-[16/10] overflow-hidden rounded-lg transition-all duration-300',
                    activeDesignIndex === index
                      ? 'ring-2 ring-[#7fa8c9] ring-offset-2 scale-[1.02]'
                      : 'opacity-60 hover:opacity-90 border border-[#7fa8c9]/10'
                  )}
                >
                  <Image
                    src={design.thumbnail}
                    alt={`${currentProject.name} Design ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 33vw, 200px"
                  />
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-medium',
                      activeDesignIndex === index
                        ? 'bg-[#7fa8c9] text-white'
                        : 'bg-white/80 text-[#1a1a1a]/70'
                    )}>
                      {tModal('designLabel', { number: index + 1 })}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Auto-play progress dots */}
            <div className="flex justify-center gap-2">
              {currentProject.designs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDesignClick(index)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500',
                    activeDesignIndex === index
                      ? 'w-8 bg-[#7fa8c9]'
                      : 'w-1.5 bg-[#7fa8c9]/20 hover:bg-[#7fa8c9]/40'
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FREE emphasis */}
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

      {/* Portfolio Modal (iframe + viewport toggle) */}
      <PortfolioModal
        project={modalProject}
        onClose={() => {
          setModalProject(null);
          document.body.style.overflow = '';
        }}
        categoryLabel={modalProject ? tCategories(modalProject.category) : undefined}
      />
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
