'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
import { Navigation, GlassCard, GlassButton } from '@/presentation/components/ui';
import { ArrowLeft, Send, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

// ============================================
// Types
// ============================================

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  budget: string;
  message: string;
}

// ============================================
// Contact Page
// ============================================

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
  ];

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
      newErrors.message = '문의 내용을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = cn(
    'w-full px-5 py-4',
    'bg-white/60 backdrop-blur-xl',
    'border-2 border-[#7fa8c9]/20 rounded-2xl',
    'text-[#1a1a1a] placeholder:text-[#1a1a1a]/40',
    'shadow-[0_4px_20px_rgba(127,168,201,0.08)]',
    'transition-all duration-300',
    'focus:outline-none focus:bg-white/80 focus:border-[#7fa8c9]/50',
    'focus:shadow-[0_0_0_4px_rgba(127,168,201,0.15)]',
    'hover:bg-white/70'
  );

  const errorInputClass = 'border-red-300 focus:border-red-400';

  return (
    <div className="min-h-screen bg-white">
      <AmbientBackground variant="lido" />

      <Navigation items={navItems} />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-8 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              메인으로 돌아가기
            </Link>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] mb-6">
              문의하기
            </h1>
            <p className="text-xl text-[#1a1a1a]/60 max-w-2xl">
              프로젝트에 대해 알려주세요. 24시간 내에 답변 드리겠습니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-1 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#7fa8c9]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#7fa8c9]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">이메일</h3>
                    <a
                      href="mailto:mzstudio104@gmail.com"
                      className="text-[#1a1a1a]/60 hover:text-[#7fa8c9] transition-colors"
                    >
                      mzstudio104@gmail.com
                    </a>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" hover={false}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#7fa8c9]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#7fa8c9]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">전화</h3>
                    <a
                      href="tel:010-5150-7858"
                      className="text-[#1a1a1a]/60 hover:text-[#7fa8c9] transition-colors"
                    >
                      010-5150-7858
                    </a>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6" hover={false}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#7fa8c9]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#7fa8c9]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">주소</h3>
                    <p className="text-[#1a1a1a]/60">
                      대구광역시 중구 남산동 677-58
                      <br />
                      명륜로21길 33-11
                    </p>
                  </div>
                </div>
              </GlassCard>

              <div className="p-6 rounded-2xl bg-[#f2f8fc] border border-[#7fa8c9]/10">
                <h3 className="font-semibold text-[#1a1a1a] mb-3">응답 시간</h3>
                <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
                  평일 오전 10시 ~ 오후 6시 사이에 문의 주시면 당일 내로 답변 드립니다.
                  주말 및 공휴일에는 다음 영업일에 답변 드립니다.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {isSubmitted ? (
                <GlassCard className="p-12 text-center" hover={false}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="w-20 h-20 text-[#7fa8c9] mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
                    문의가 접수되었습니다
                  </h2>
                  <p className="text-lg text-[#1a1a1a]/60 mb-8">
                    빠른 시일 내에 연락 드리겠습니다.
                    <br />
                    감사합니다!
                  </p>
                  <Link href="/">
                    <GlassButton variant="accent">메인으로 돌아가기</GlassButton>
                  </Link>
                </GlassCard>
              ) : (
                <GlassCard className="p-8 md:p-10" hover={false}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">
                          이름 <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="홍길동"
                          value={formData.name}
                          onChange={handleChange}
                          className={cn(inputClass, errors.name && errorInputClass)}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-2">{errors.name}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">
                          연락처
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="010-1234-5678"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">
                        이메일 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="hello@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={cn(inputClass, errors.email && errorInputClass)}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-2">{errors.email}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Company */}
                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">
                          회사/브랜드명
                        </label>
                        <input
                          type="text"
                          name="company"
                          placeholder="회사명 또는 브랜드명"
                          value={formData.company}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>

                      {/* Budget */}
                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">
                          예산 범위
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className={cn(inputClass, 'appearance-none cursor-pointer')}
                        >
                          <option value="">선택해주세요</option>
                          <option value="~100만원">~100만원</option>
                          <option value="100~300만원">100~300만원</option>
                          <option value="300~500만원">300~500만원</option>
                          <option value="500만원~">500만원 이상</option>
                          <option value="미정">아직 미정</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">
                        문의 내용 <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="message"
                        placeholder="프로젝트에 대해 자세히 알려주세요. 원하시는 스타일, 참고 사이트, 일정 등을 적어주시면 더욱 정확한 상담이 가능합니다."
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={cn(
                          inputClass,
                          'resize-none',
                          errors.message && errorInputClass
                        )}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500 mt-2">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <GlassButton
                        type="submit"
                        variant="accent"
                        className="w-full justify-center text-lg py-5"
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
                            <Send className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </GlassButton>
                    </div>
                  </form>
                </GlassCard>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
