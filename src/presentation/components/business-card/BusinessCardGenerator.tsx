'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BusinessCardData,
  BusinessCardState,
  initialBusinessCardState,
} from '@/lib/businessCard/types';
import { generateBusinessCardPDF } from '@/lib/businessCard/generatePDF';
import { BusinessCardForm } from './BusinessCardForm';
import { BusinessCardPreview, HiddenPreview } from './BusinessCardPreview';

export function BusinessCardGenerator() {
  const [state, setState] = useState<BusinessCardState>(initialBusinessCardState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const updateData = useCallback((updates: Partial<BusinessCardData>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleGeneratePDF = async () => {
    if (!frontRef.current || !backRef.current) return;
    
    if (!state.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setSuccess(false);

    try {
      await generateBusinessCardPDF({
        frontElement: frontRef.current,
        backElement: backRef.current,
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Preview (Dark) */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col bg-[#1a1a1a] relative overflow-hidden min-h-[50vh] lg:min-h-screen">
          {/* Background Glow */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute top-20 left-10 w-80 h-80 rounded-full blur-[100px]"
              style={{ backgroundColor: state.primaryColor }}
            />
            <div
              className="absolute bottom-20 right-10 w-60 h-60 rounded-full blur-[80px]"
              style={{ backgroundColor: state.primaryColor }}
            />
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <Link
              href="/ko"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              메인으로
            </Link>
          </div>

          {/* Title */}
          <div className="relative z-10 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              명함 만들기
            </h1>
            <p className="text-white/50">
              정보를 입력하고 PDF로 다운로드하세요
            </p>
          </div>

          {/* Preview - Centered */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <BusinessCardPreview data={state} showBleed={true} />
          </div>

          {/* Download Button */}
          <div className="relative z-10 mt-8">
            <motion.button
              onClick={handleGeneratePDF}
              disabled={isGenerating || !state.name.trim()}
              className={cn(
                'w-full py-4 rounded-xl font-medium text-white transition-all',
                'flex items-center justify-center gap-2',
                isGenerating || !state.name.trim()
                  ? 'bg-white/10 cursor-not-allowed'
                  : success
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-[#7fa8c9] hover:bg-[#6a93b4]'
              )}
              whileTap={{ scale: 0.98 }}
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
            
            {!state.name.trim() && (
              <p className="text-center text-white/40 text-xs mt-2">
                이름을 입력하면 다운로드할 수 있습니다
              </p>
            )}
          </div>
        </div>

        {/* Right Panel - Form (Light) */}
        <div className="lg:w-1/2 p-8 lg:p-12 lg:overflow-y-auto lg:max-h-screen">
          <BusinessCardForm
            data={state}
            onChange={updateData}
          />
        </div>
      </div>

      {/* Hidden Preview for PDF Generation */}
      <HiddenPreview data={state} frontRef={frontRef} backRef={backRef} />
    </div>
  );
}
