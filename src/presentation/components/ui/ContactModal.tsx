'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassInput, GlassTextarea } from './GlassInput';
import { GlassButton } from './GlassButton';
import { X, Send, CheckCircle } from 'lucide-react';

// ============================================
// Types
// ============================================

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// ============================================
// ContactModal Component
// ============================================

export function ContactModal({ isOpen, onClose, className }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.message.trim()) {
      newErrors.message = '메시지를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      onClose();
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center p-4',
              'pointer-events-none'
            )}
          >
            <motion.div
              className={cn(
                'relative w-full max-w-lg pointer-events-auto',
                'bg-white/90 backdrop-blur-2xl',
                'border-2 border-[#7fa8c9]/20',
                'rounded-3xl shadow-[0_32px_64px_rgba(127,168,201,0.2)]',
                'overflow-hidden',
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Header */}
              <div className="relative px-8 pt-8 pb-4">
                <button
                  onClick={onClose}
                  className={cn(
                    'absolute top-6 right-6',
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-[#f2f8fc] hover:bg-[#7fa8c9]/20',
                    'text-[#1a1a1a]/60 hover:text-[#1a1a1a]',
                    'transition-colors duration-200'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-[#1a1a1a]">문의하기</h2>
                <p className="mt-2 text-[#1a1a1a]/60">
                  프로젝트에 대해 알려주세요. 빠르게 답변 드리겠습니다.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 pb-8">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="py-12 flex flex-col items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle className="w-16 h-16 text-[#7fa8c9]" />
                      </motion.div>
                      <h3 className="mt-4 text-xl font-semibold text-[#1a1a1a]">
                        문의가 접수되었습니다
                      </h3>
                      <p className="mt-2 text-[#1a1a1a]/60">
                        빠른 시일 내에 답변 드리겠습니다
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassInput
                          label="이름"
                          name="name"
                          placeholder="홍길동"
                          value={formData.name}
                          onChange={handleChange}
                          error={errors.name}
                          required
                        />
                        <GlassInput
                          label="연락처"
                          name="phone"
                          type="tel"
                          placeholder="010-1234-5678"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <GlassInput
                        label="이메일"
                        name="email"
                        type="email"
                        placeholder="hello@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                      />

                      <GlassTextarea
                        label="문의 내용"
                        name="message"
                        placeholder="프로젝트에 대해 알려주세요. 원하시는 스타일, 참고 사이트, 예산 등을 적어주시면 더욱 정확한 답변을 드릴 수 있습니다."
                        value={formData.message}
                        onChange={handleChange}
                        error={errors.message}
                        required
                        className="min-h-[140px]"
                      />

                      <div className="pt-2">
                        <GlassButton
                          type="submit"
                          variant="accent"
                          className="w-full justify-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              />
                              전송 중...
                            </>
                          ) : (
                            <>
                              문의 보내기
                              <Send className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </GlassButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7fa8c9] to-transparent" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// useContactModal Hook
// ============================================

export function useContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
