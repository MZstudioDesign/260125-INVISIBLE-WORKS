'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import Image from 'next/image';
import type { PortfolioProject, DesignVariant } from '@/data/portfolio-projects';
import { useTranslations } from 'next-intl';

// ============================================
// Viewport Toggle
// ============================================

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportMode, string> = {
  desktop: 'max-w-[1280px]',
  tablet: 'max-w-[768px]',
  mobile: 'max-w-[375px]',
};

interface ViewportToggleProps {
  mode: ViewportMode;
  onChange: (mode: ViewportMode) => void;
}

function ViewportToggle({ mode, onChange }: ViewportToggleProps) {
  const buttons: { key: ViewportMode; icon: typeof Monitor; label: string }[] = [
    { key: 'desktop', icon: Monitor, label: 'Desktop' },
    { key: 'tablet', icon: Tablet, label: 'Tablet' },
    { key: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#f2f8fc] border border-[#7fa8c9]/20">
      {buttons.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
            mode === key
              ? 'bg-white text-[#1a1a1a] shadow-sm border border-[#7fa8c9]/20'
              : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60'
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden md:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// Variant Tab Selector
// ============================================

interface VariantTabsProps {
  designs: DesignVariant[];
  activeId: string;
  onChange: (id: string) => void;
}

function VariantTabs({ designs, activeId, onChange }: VariantTabsProps) {
  const t = useTranslations('PortfolioModal');

  return (
    <div className="flex gap-3">
      {designs.map((design, index) => (
        <button
          key={design.id}
          onClick={() => onChange(design.id)}
          className={cn(
            'group relative flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300',
            activeId === design.id
              ? 'bg-white shadow-lg border-2 border-[#7fa8c9]/30 scale-105'
              : 'bg-[#f2f8fc] border-2 border-transparent hover:border-[#7fa8c9]/15'
          )}
        >
          <div className="relative w-20 h-14 md:w-28 md:h-20 rounded-lg overflow-hidden">
            <Image
              src={design.thumbnail}
              alt={`Design ${index + 1}`}
              fill
              className="object-cover object-top"
              sizes="112px"
            />
            {activeId === design.id && (
              <motion.div
                layoutId="variant-indicator"
                className="absolute inset-0 border-2 border-[#7fa8c9] rounded-lg"
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
          <span className={cn(
            'text-xs font-medium transition-colors',
            activeId === design.id ? 'text-[#7fa8c9]' : 'text-[#1a1a1a]/40'
          )}>
            {t('designLabel', { number: index + 1 })}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// Portfolio Modal (Main Export)
// ============================================

interface PortfolioModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  categoryLabel?: string;
}

export function PortfolioModal({ project, onClose, categoryLabel }: PortfolioModalProps) {
  const [activeVariant, setActiveVariant] = useState('001');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const t = useTranslations('PortfolioModal');

  const handleClose = useCallback(() => {
    setActiveVariant('001');
    setViewport('desktop');
    onClose();
  }, [onClose]);

  const activeDesign = project?.designs.find(d => d.id === activeVariant) || project?.designs[0];

  return (
    <AnimatePresence>
      {project && activeDesign && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center p-3 md:p-6 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={cn(
                'relative w-full max-w-7xl h-full pointer-events-auto flex flex-col',
                'bg-white/95 backdrop-blur-2xl',
                'border-2 border-[#7fa8c9]/20',
                'rounded-2xl md:rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.3)]',
                'overflow-hidden'
              )}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#7fa8c9]/10 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg md:text-2xl font-bold text-[#1a1a1a]">
                        {project.name}
                      </h2>
                      {categoryLabel && (
                        <span className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          'bg-[#f2f8fc] text-[#7fa8c9] border border-[#7fa8c9]/20'
                        )}>
                          {categoryLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#1a1a1a]/50">{project.industry}</p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    'bg-[#f2f8fc] hover:bg-[#e8f0f6]',
                    'text-[#1a1a1a]/60 hover:text-[#1a1a1a]',
                    'transition-colors duration-200'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 py-4 bg-[#f2f8fc]/50 border-b border-[#7fa8c9]/10">
                <VariantTabs
                  designs={project.designs}
                  activeId={activeVariant}
                  onChange={setActiveVariant}
                />
                <ViewportToggle mode={viewport} onChange={setViewport} />
              </div>

              {/* iframe Area */}
              <div className="flex-1 flex items-start justify-center overflow-hidden bg-[#e8f0f6]/50 p-4 md:p-6">
                <motion.div
                  className={cn(
                    'w-full h-full rounded-xl overflow-hidden',
                    'bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
                    'border border-[#7fa8c9]/10',
                    'transition-all duration-500 ease-out',
                    VIEWPORT_WIDTHS[viewport],
                    viewport !== 'desktop' && 'mx-auto'
                  )}
                  layout
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <AnimatePresence mode="wait">
                    <motion.iframe
                      key={`${project.id}-${activeVariant}`}
                      src={activeDesign.htmlPath}
                      className="w-full h-full border-0"
                      title={`${project.name} - Design ${activeVariant}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// Hook for managing modal state
// ============================================

export function usePortfolioModal() {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const open = useCallback((project: PortfolioProject) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = '';
  }, []);

  return { selectedProject, open, close };
}
