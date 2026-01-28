'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fileToBase64, processSvgFile } from '@/lib/businessCard/generatePDF';

interface LogoDropzoneProps {
  value: string | null;
  onChange: (base64: string | null) => void;
  className?: string;
}

export function LogoDropzone({ value, onChange, className }: LogoDropzoneProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);
    setError(null);

    try {
      let base64: string;

      if (file.type === 'image/svg+xml') {
        // Process SVG to PNG
        base64 = await processSvgFile(file);
      } else {
        // Direct Base64 for PNG/JPG
        base64 = await fileToBase64(file);
      }

      onChange(base64);
    } catch (err) {
      setError('파일을 처리하는 중 오류가 발생했습니다.');
      console.error('Logo processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setError(null);
  };

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">
        로고 이미지
      </label>
      
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all cursor-pointer',
          'hover:border-[#7fa8c9]/60 hover:bg-[#7fa8c9]/5',
          isDragActive && 'border-[#7fa8c9] bg-[#7fa8c9]/10',
          value && 'border-[#7fa8c9]/40',
          !value && 'border-[#1a1a1a]/20',
          isProcessing && 'opacity-50 pointer-events-none'
        )}
      >
        <input {...getInputProps()} />
        
        {value ? (
          <div className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white border border-[#1a1a1a]/10 flex items-center justify-center overflow-hidden">
              <img
                src={value}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1a1a1a]">로고 업로드됨</p>
              <p className="text-xs text-[#1a1a1a]/50 mt-1">클릭하여 변경</p>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            {isProcessing ? (
              <div className="w-10 h-10 rounded-full border-2 border-[#7fa8c9] border-t-transparent animate-spin" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-[#7fa8c9]/10 flex items-center justify-center mb-3">
                  {isDragActive ? (
                    <ImageIcon className="w-6 h-6 text-[#7fa8c9]" />
                  ) : (
                    <Upload className="w-6 h-6 text-[#7fa8c9]" />
                  )}
                </div>
                <p className="text-sm font-medium text-[#1a1a1a]">
                  {isDragActive ? '여기에 놓으세요' : '로고 파일을 드래그하거나 클릭'}
                </p>
                <p className="text-xs text-[#1a1a1a]/50 mt-1">
                  PNG, SVG (권장), JPG (최대 5MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
