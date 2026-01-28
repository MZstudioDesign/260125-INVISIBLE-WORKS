'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessCardData } from '@/lib/businessCard/types';
import { getTemplateComponent } from './templates';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';

interface BusinessCardPreviewProps {
  data: BusinessCardData;
  showBleed?: boolean;
  className?: string;
}

export const BusinessCardPreview = forwardRef<
  { frontRef: HTMLDivElement | null; backRef: HTMLDivElement | null },
  BusinessCardPreviewProps
>(function BusinessCardPreview({ data, showBleed = true, className }, ref) {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const TemplateComponent = getTemplateComponent(data.template);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Card Preview with Flip Animation */}
      <div className="relative perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={side}
            initial={{ rotateY: side === 'front' ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: side === 'front' ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Shadow */}
            <div
              className="absolute inset-0 rounded-xl bg-black/10 blur-xl -z-10"
              style={{ transform: 'translateY(8px)' }}
            />

            {/* Card */}
            <div
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{ transform: 'scale(0.9)' }}
            >
              <div
                ref={(el) => {
                  if (typeof ref === 'function') {
                    // Not used in this case
                  } else if (ref) {
                    if (side === 'front') {
                      ref.current = { ...ref.current, frontRef: el } as any;
                    } else {
                      ref.current = { ...ref.current, backRef: el } as any;
                    }
                  }
                }}
              >
                <TemplateComponent data={data} side={side} showBleed={showBleed} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side Toggle */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => setSide('front')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            side === 'front'
              ? 'bg-[#7fa8c9] text-white'
              : 'bg-white/50 text-[#1a1a1a]/60 hover:bg-white/80'
          )}
        >
          앞면
        </button>

        <button
          onClick={() => setSide(side === 'front' ? 'back' : 'front')}
          className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-all"
          title="뒤집기"
        >
          <RotateCw className="w-4 h-4 text-[#1a1a1a]/60" />
        </button>

        <button
          onClick={() => setSide('back')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            side === 'back'
              ? 'bg-[#7fa8c9] text-white'
              : 'bg-white/50 text-[#1a1a1a]/60 hover:bg-white/80'
          )}
        >
          뒷면
        </button>
      </div>

      {/* Size Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-white/40">
          90 × 50 mm {showBleed && '(도련 3mm 포함: 96 × 56 mm)'}
        </p>
      </div>
    </div>
  );
});

// Hidden component for PDF generation
interface HiddenPreviewProps {
  data: BusinessCardData;
  frontRef: React.RefObject<HTMLDivElement | null>;
  backRef: React.RefObject<HTMLDivElement | null>;
}

export function HiddenPreview({ data, frontRef, backRef }: HiddenPreviewProps) {
  const TemplateComponent = getTemplateComponent(data.template);

  return (
    <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
      <div ref={frontRef}>
        <TemplateComponent data={data} side="front" showBleed={true} />
      </div>
      <div ref={backRef}>
        <TemplateComponent data={data} side="back" showBleed={true} />
      </div>
    </div>
  );
}
