'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Loader2, FileText, FileSpreadsheet, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  QuoteData,
  QuoteState,
  QuoteType,
  QuoteLanguage,
  initialQuoteState,
} from '@/lib/quote/types';
import { generateQuotePDF } from '@/lib/quote/generatePDF';
import { QuoteForm } from './QuoteForm';
import { QuotePreview, HiddenQuotePreview } from './QuotePreview';
import { QuoteSettingsPanel } from './QuoteSettingsPanel';

export function QuoteGenerator() {
  const [state, setState] = useState<QuoteState>(initialQuoteState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const previewRef = useRef<HTMLDivElement>(null);

  const updateData = useCallback((updates: Partial<QuoteData>) => {
    setState((prev) => ({ ...prev, ...updates }));
    // 입력 시 해당 필드의 에러 제거
    const keys = Object.keys(updates);
    if (keys.length > 0) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        keys.forEach((key) => delete newErrors[key]);
        return newErrors;
      });
    }
  }, []);

  const setActiveTab = (tab: QuoteType) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  const setLanguage = (lang: QuoteLanguage) => {
    setState((prev) => ({ ...prev, language: lang }));
  };

  // 필수 필드 검증
  const validateRequiredFields = (): boolean => {
    const errors: Record<string, string> = {};

    if (!state.clientName.trim()) {
      errors.clientName = '고객명을 입력해주세요';
    }
    // 세부 견적서만 수동 항목 필수 (간단 견적서는 자동 항목 생성됨)
    if (state.activeTab === 'detailed') {
      if (state.items.length === 0 || state.items.every(item => !item.description.trim())) {
        errors.items = '최소 1개의 항목을 입력해주세요';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGeneratePDF = async () => {
    if (!previewRef.current) return;

    // 필수 필드 검증
    if (!validateRequiredFields()) {
      alert('필수 항목을 입력해주세요 (고객명, 항목 등)');
      return;
    }

    setIsGenerating(true);
    setSuccess(false);

    try {
      await generateQuotePDF({
        element: previewRef.current,
        data: state,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen bg-[#f8fafc] overflow-hidden flex flex-col lg:flex-row">
      {/* ════════════════════════════════════════════════════════════════
            Left Panel - Preview (Dark)
        ════════════════════════════════════════════════════════════════ */}
      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col bg-[#0f172a] relative overflow-y-auto h-full scrollbar-hide">

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-8 shrink-0">
          <Link
            href="/ko"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            메인으로
          </Link>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="기본 설정"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="relative z-10 mb-6 shrink-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            견적서 만들기
          </h1>
          <p className="text-white/50">
            정보를 입력하고 PDF로 다운로드하세요
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="relative z-10 flex gap-2 mb-4 shrink-0 p-1 bg-white/5 rounded-xl backdrop-blur-sm border border-white/5">
          <button
            onClick={() => setActiveTab('simple')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              state.activeTab === 'simple'
                ? 'bg-white/15 text-white shadow-lg shadow-white/5'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            <FileText className="w-4 h-4" />
            간단 견적서
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              state.activeTab === 'detailed'
                ? 'bg-white/15 text-white shadow-lg shadow-white/5'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            <FileSpreadsheet className="w-4 h-4" />
            세부 견적서
          </button>
        </div>

        {/* Language Toggle */}
        <div className="relative z-10 flex gap-2 mb-6 shrink-0">
          <button
            onClick={() => setLanguage('ko')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              state.language === 'ko'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            한글
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              state.language === 'en'
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            English
          </button>
        </div>

        {/* Preview - Centered */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-8">
          <QuotePreview data={state} type={state.activeTab} language={state.language} />
        </div>

        {/* Download Button */}
        <div className="relative z-10 mt-8 shrink-0 pb-8">
          <motion.button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className={cn(
              'w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300',
              'flex items-center justify-center gap-2.5',
              'shadow-[0_8px_30px_rgba(0,0,0,0.2)]',
              isGenerating
                ? 'bg-white/10 cursor-not-allowed shadow-none'
                : success
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#2563eb] shadow-blue-500/25'
            )}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                PDF 생성 중...
              </>
            ) : success ? (
              <>
                <Download className="w-5 h-5" />
                다운로드 완료!
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                PDF 다운로드
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
            Right Panel - Form (Light)
        ════════════════════════════════════════════════════════════════ */}
      <div className="lg:w-1/2 h-full overflow-y-auto p-8 lg:p-12">
        <QuoteForm
          data={state}
          onChange={updateData}
          activeTab={state.activeTab}
          validationErrors={validationErrors}
        />
      </div>


      <HiddenQuotePreview data={state} type={state.activeTab} language={state.language} previewRef={previewRef} />

      {/* Settings Panel */}
      <QuoteSettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
