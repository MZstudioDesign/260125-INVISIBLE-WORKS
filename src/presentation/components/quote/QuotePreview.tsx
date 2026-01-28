'use client';

import { forwardRef, useState } from 'react';
import { QuoteData, QuoteType, A4_WIDTH_PX, A4_HEIGHT_PX } from '@/lib/quote/types';
import { getQuoteTemplate, getQuotePageCount } from './templates';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuotePreviewProps {
  data: QuoteData;
  type: QuoteType;
  className?: string;
}

export const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(
  function QuotePreview({ data, type, className }, ref) {
    const TemplateComponent = getQuoteTemplate(type);
    const pageCount = getQuotePageCount(type);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(0.65);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.3));

    return (
      <>
        <div className={cn('flex flex-col items-center w-full', className)}>
          {/* Controls Bar */}
          <div className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            {/* Page Nav */}
            {pageCount > 1 && (
              <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  className={cn(
                    'px-3 py-1 rounded text-xs font-medium transition-all',
                    currentPage === 1 ? 'bg-white text-[#0f172a]' : 'text-white/60 hover:text-white'
                  )}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={cn(
                    'px-3 py-1 rounded text-xs font-medium transition-all',
                    currentPage === 2 ? 'bg-white text-[#0f172a]' : 'text-white/60 hover:text-white'
                  )}
                >
                  2
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="축소"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-white/60 min-w-[3ch] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="확대"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-4 bg-white/10 mx-2" />

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="전체 화면"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* A4 Preview Container */}
          <div className="relative overflow-visible pb-20">
            {/* Shadow Effect */}
            <div
              className="absolute inset-0 bg-blue-500/20 blur-[100px] -z-10 rounded-full"
              style={{ transform: 'translateY(20px) scale(0.8)' }}
            />

            {/* Scalable Wrapper */}
            <div
              className="transition-transform duration-200 origin-top cursor-zoom-in"
              style={{ transform: `scale(${scale})` }}
              onClick={() => setIsLightboxOpen(true)}
            >
              <div
                ref={ref}
                className="bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  height: `${A4_HEIGHT_PX}px`,
                }}
              >
                <TemplateComponent data={data} pageNumber={currentPage} />
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 overflow-auto"
              onClick={() => setIsLightboxOpen(false)}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white shadow-2xl overflow-y-auto max-h-full no-scrollbar"
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  maxWidth: '100%',
                }}
              >
                <TemplateComponent data={data} pageNumber={currentPage} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

// Hidden component for PDF generation (모든 페이지 렌더링)
interface HiddenPreviewProps {
  data: QuoteData;
  type: QuoteType;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export function HiddenQuotePreview({ data, type, previewRef }: HiddenPreviewProps) {
  const TemplateComponent = getQuoteTemplate(type);
  const pageCount = getQuotePageCount(type);

  return (
    <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
      <div ref={previewRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 모든 페이지 렌더링 */}
        {Array.from({ length: pageCount }, (_, i) => (
          <div key={i + 1} data-page={i + 1}>
            <TemplateComponent data={data} pageNumber={i + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}
