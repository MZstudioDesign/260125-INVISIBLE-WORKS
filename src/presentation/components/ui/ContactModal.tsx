'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, ArrowLeft, ArrowRight, Check, Plus, RotateCcw, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

// ============================================
// Types
// ============================================

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface LinkItem {
  type: string;
  customType?: string;
  url: string;
}

interface FormData {
  industry: string;
  industryCustom: string;
  purpose: string;
  currentAssets: string[];
  hasQuote: string;
  contactMethod: string;
  contactValue: string;
  additionalLinks: LinkItem[];
  additionalNote: string;
  _gotcha: string; // Honeypot field for bot prevention
}

const STORAGE_KEY = 'invisible-works-contact-form';

// ============================================
// Data Keys (for translations)
// ============================================

const industryKeys = ['food', 'beauty', 'fitness', 'education', 'medical', 'brand', 'office', 'other'] as const;
const purposeKeys = ['trust', 'inquiry', 'reservation', 'sales', 'unknown'] as const;
const assetKeys = ['sns', 'logo', 'photos', 'content', 'website', 'none'] as const;
const quoteKeys = ['yes', 'no'] as const;
const contactMethodKeys = ['kakao', 'sms', 'email'] as const;
const linkTypeKeys = ['own', 'competitor', 'style', 'other'] as const;

// Recommended items
const recommendedPurposes = ['unknown'];
const recommendedAssets = ['none'];
const recommendedQuote = ['no'];
const recommendedContactMethods = ['kakao'];

// ============================================
// Validation
// ============================================

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

const formatPhone = (value: string): string => {
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
};

// ============================================
// ContactModal Component
// ============================================

export function ContactModal({ isOpen, onClose, className }: ContactModalProps) {
  const t = useTranslations('ContactForm');
  const locale = useLocale();

  // Determine if this is a Korean locale
  const isKorean = locale === 'ko';

  // Filter contact methods based on locale
  // KR: kakao (default), sms, email
  // Global: email only
  const availableContactMethods = isKorean
    ? contactMethodKeys
    : (['email'] as const);

  // Get default contact method based on locale
  const defaultContactMethod = isKorean ? 'kakao' : 'email';
  const defaultContactValue = isKorean ? '010' : '';

  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [contactError, setContactError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    industry: '',
    industryCustom: '',
    purpose: 'unknown',
    currentAssets: ['none'],
    hasQuote: 'no',
    contactMethod: defaultContactMethod,
    contactValue: defaultContactValue,
    additionalLinks: [{ type: 'style', url: '' }],
    additionalNote: '',
    _gotcha: '', // Honeypot - should remain empty
  });

  const totalSteps = 5;
  
  // Step titles from translations
  const stepTitles = [
    { title: t('steps.step1.title'), sub: t('steps.step1.sub') },
    { title: t('steps.step2.title'), sub: t('steps.step2.sub') },
    { title: t('steps.step3.title'), sub: t('steps.step3.sub') },
    { title: t('steps.step4.title'), sub: t('steps.step4.sub') },
    { title: t('steps.step5.title'), sub: t('steps.step5.sub') },
  ];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          // Migrate old format
          if (Array.isArray(parsed.formData.additionalLinks) && typeof parsed.formData.additionalLinks[0] === 'string') {
            parsed.formData.additionalLinks = parsed.formData.additionalLinks.map((url: string) => ({ type: 'style', url }));
          }
          setFormData(parsed.formData);
        }
        setCurrentStep(parsed.currentStep || 1);
      } catch {
        // ignore
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isComplete && isOpen) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    }
  }, [formData, currentStep, isComplete, isOpen]);

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

  const validateContactValue = useCallback(() => {
    const { contactMethod, contactValue } = formData;
    
    if (!contactValue.trim()) {
      return { valid: false, error: '' };
    }

    if (contactMethod === 'email') {
      if (!validateEmail(contactValue)) {
        return { valid: false, error: t('errors.invalidEmail') };
      }
    } else {
      if (!validatePhone(contactValue)) {
        return { valid: false, error: t('errors.invalidPhone') };
      }
    }
    
    return { valid: true, error: '' };
  }, [formData, t]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.industry !== '' && (formData.industry !== 'other' || formData.industryCustom.trim() !== '');
      case 2:
        return formData.purpose !== '';
      case 3:
        return formData.currentAssets.length > 0;
      case 4:
        return formData.hasQuote !== '';
      case 5:
        const validation = validateContactValue();
        return formData.contactValue.trim() !== '' && validation.valid;
      default:
        return false;
    }
  }, [currentStep, formData, validateContactValue]);

  const handleNext = useCallback(() => {
    if (currentStep === 5) {
      const validation = validateContactValue();
      if (!validation.valid) {
        setContactError(validation.error);
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setContactError('');
    } else if (currentStep === totalSteps && canProceed()) {
      handleSubmit();
    }
  }, [currentStep, canProceed, validateContactValue]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setContactError('');
    }
  }, [currentStep]);

  const handleGoBackFromComplete = () => {
    setIsComplete(false);
    setCurrentStep(totalSteps);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Enter' && !e.shiftKey && canProceed() && !isComplete) {
        e.preventDefault();
        handleNext();
      }
      if (e.key === 'Escape') {
        if (isComplete) {
          handleGoBackFromComplete();
        } else if (currentStep > 1) {
          handleBack();
        } else {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, canProceed, handleNext, handleBack, isComplete]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare request body
      const requestBody = {
        clientName: formData.industryCustom || formData.industry,
        clientPhone: formData.contactMethod !== 'email' ? formData.contactValue : undefined,
        clientEmail: formData.contactMethod === 'email' ? formData.contactValue : undefined,
        contactMethod: formData.contactMethod,
        screenBlocks: { min: 1, max: 15 }, // Default estimate
        uiuxStyle: 'normal' as const,
        features: [],
        specialNotes: [],
        // Additional form data
        industry: formData.industry,
        industryCustom: formData.industryCustom,
        purpose: formData.purpose,
        currentAssets: formData.currentAssets,
        hasQuote: formData.hasQuote,
        additionalLinks: formData.additionalLinks.filter((l) => l.url.trim()),
        additionalNote: formData.additionalNote,
        locale,
        // Honeypot field - should be empty for real users
        _gotcha: formData._gotcha,
      };

      const response = await fetch('/api/quote/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      localStorage.removeItem(STORAGE_KEY);
      setIsComplete(true);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTimeout(() => {
      if (isComplete) {
        setCurrentStep(1);
        setIsComplete(false);
        setFormData({
          industry: '',
          industryCustom: '',
          purpose: 'unknown',
          currentAssets: ['none'],
          hasQuote: 'no',
          contactMethod: defaultContactMethod,
          contactValue: defaultContactValue,
          additionalLinks: [{ type: 'style', url: '' }],
          additionalNote: '',
          _gotcha: '',
        });
      }
    }, 300);
    onClose();
  };

  const handleContactMethodChange = (methodId: string) => {
    const isPhoneMethod = methodId === 'kakao' || methodId === 'sms';
    setFormData((prev) => ({
      ...prev,
      contactMethod: methodId,
      contactValue: isPhoneMethod ? '010' : '',
    }));
    setContactError('');
  };

  const handleContactValueChange = (value: string) => {
    const { contactMethod } = formData;
    let newValue = value;

    if (contactMethod === 'kakao' || contactMethod === 'sms') {
      newValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, contactValue: newValue }));
    setContactError('');
  };

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      additionalLinks: [...prev.additionalLinks, { type: 'style', url: '' }],
    }));
  };

  const handleRemoveLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalLinks: prev.additionalLinks.filter((_, i) => i !== index),
    }));
  };

  const handleLinkChange = (index: number, field: 'type' | 'url' | 'customType', value: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalLinks: prev.additionalLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const slideVariants = {
    enter: { y: 20, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  // Get placeholder based on contact method
  const getContactPlaceholder = (methodId: string) => {
    if (methodId === 'email') return t('placeholders.email');
    return t('placeholders.phone');
  };

  // ============================================
  // Render Steps
  // ============================================

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {industryKeys.map((key) => (
                <GlassChip
                  key={key}
                  selected={formData.industry === key}
                  onClick={() => setFormData((prev) => ({ ...prev, industry: key }))}
                >
                  {t(`industries.${key}`)}
                </GlassChip>
              ))}
            </div>
            
            <AnimatePresence>
              {formData.industry === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    value={formData.industryCustom}
                    onChange={(e) => setFormData((prev) => ({ ...prev, industryCustom: e.target.value }))}
                    placeholder={t('placeholders.industryCustom')}
                    className={cn(
                      'w-full mt-2 px-5 py-4 bg-white/60 backdrop-blur-xl',
                      'border-2 border-[#7fa8c9]/30 rounded-2xl',
                      'text-base text-[#1a1a1a] placeholder:text-[#1a1a1a]/30',
                      'focus:outline-none focus:border-[#7fa8c9] focus:bg-white/80',
                      'transition-all duration-200'
                    )}
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 2:
        return (
          <div className="space-y-2.5">
            {purposeKeys.map((key) => (
              <GlassSelect
                key={key}
                selected={formData.purpose === key}
                recommended={recommendedPurposes.includes(key)}
                recommendedLabel={t('labels.recommended')}
                onClick={() => setFormData((prev) => ({ ...prev, purpose: key }))}
              >
                {t(`purposes.${key}`)}
              </GlassSelect>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-2.5">
            {assetKeys.map((key) => (
              <GlassCheckbox
                key={key}
                checked={formData.currentAssets.includes(key)}
                recommended={recommendedAssets.includes(key)}
                recommendedLabel={t('labels.recommended')}
                onClick={() => {
                  setFormData((prev) => {
                    const isChecked = prev.currentAssets.includes(key);
                    if (key === 'none') {
                      return { ...prev, currentAssets: isChecked ? [] : ['none'] };
                    }
                    const newAssets = isChecked
                      ? prev.currentAssets.filter((id) => id !== key)
                      : [...prev.currentAssets.filter((id) => id !== 'none'), key];
                    return { ...prev, currentAssets: newAssets };
                  });
                }}
              >
                {t(`assets.${key}`)}
              </GlassCheckbox>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-2.5">
            {quoteKeys.map((key) => (
              <GlassSelect
                key={key}
                selected={formData.hasQuote === key}
                recommended={recommendedQuote.includes(key)}
                recommendedLabel={t('labels.recommended')}
                onClick={() => setFormData((prev) => ({ ...prev, hasQuote: key }))}
              >
                {t(`quote.${key}`)}
              </GlassSelect>
            ))}
            <AnimatePresence>
              {formData.hasQuote && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-5 text-sm text-[#7fa8c9] text-center whitespace-pre-line"
                >
                  {formData.hasQuote === 'yes'
                    ? t('quote.yesMessage')
                    : t('quote.noMessage')}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              {availableContactMethods.map((key) => (
                <button
                  key={key}
                  onClick={() => handleContactMethodChange(key)}
                  className={cn(
                    'flex-1 py-3.5 px-3 rounded-xl text-sm font-medium transition-all duration-200',
                    formData.contactMethod === key
                      ? 'bg-[#7fa8c9] text-white shadow-[0_4px_20px_rgba(127,168,201,0.35)]'
                      : 'bg-[#f2f8fc] text-[#1a1a1a]/60 hover:bg-[#e8f1f8]'
                  )}
                >
                  {t(`contactMethods.${key}`)}
                  {isKorean && recommendedContactMethods.includes(key) && formData.contactMethod !== key && (
                    <span className="ml-1 text-[10px] text-[#7fa8c9]/70">{t('labels.recommended')}</span>
                  )}
                </button>
              ))}
            </div>
            <div>
              <input
                type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                value={formData.contactValue}
                onChange={(e) => handleContactValueChange(e.target.value)}
                placeholder={getContactPlaceholder(formData.contactMethod)}
                className={cn(
                  'w-full px-5 py-4 bg-white/60 backdrop-blur-xl',
                  'border-2 rounded-2xl',
                  'text-lg text-[#1a1a1a] placeholder:text-[#1a1a1a]/30',
                  'focus:outline-none focus:bg-white/80',
                  'transition-all duration-200',
                  contactError
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#7fa8c9]/30 focus:border-[#7fa8c9]'
                )}
                autoFocus
              />
              {contactError && (
                <p className="mt-2 text-xs text-red-500">{contactError}</p>
              )}
              {/* Honeypot field - hidden from real users, filled by bots */}
              <input
                type="text"
                name="_gotcha"
                value={formData._gotcha}
                onChange={(e) => setFormData((prev) => ({ ...prev, _gotcha: e.target.value }))}
                tabIndex={-1}
                autoComplete="off"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  opacity: 0,
                  height: 0,
                  width: 0,
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================
  // Complete Screen
  // ============================================

  // Get confirmation message based on selected contact method
  const getCheckMessage = () => {
    switch (formData.contactMethod) {
      case 'kakao':
        return t('complete.checkKakao');
      case 'sms':
        return t('complete.checkSms');
      case 'email':
      default:
        return t('complete.checkEmail');
    }
  };

  const renderComplete = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-2"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-18 h-18 bg-gradient-to-br from-[#7fa8c9] to-[#5a8ab0] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(127,168,201,0.4)]"
          style={{ width: 72, height: 72 }}
        >
          <Check className="w-9 h-9 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-[#7fa8c9] mb-3 leading-tight break-keep">
          {getCheckMessage()}
        </h2>
        <p className="text-sm text-[#1a1a1a]/50 mb-2">
          {t('complete.confirmMessage')}
        </p>
        <p className="text-sm text-[#1a1a1a]/70">
          {t('complete.title')}
        </p>
      </div>

      {/* Additional Input */}
      <div className="bg-[#f2f8fc]/60 rounded-2xl p-5 mb-6">
        <p className="text-xs text-[#1a1a1a]/50 mb-4">
          {t('labels.linkSection')}
        </p>
        
        <div className="space-y-3 mb-3">
          {formData.additionalLinks.map((link, index) => (
            <div key={index} className="space-y-2">
              {/* Link Type Chips */}
              <div className="flex flex-wrap gap-1.5">
                {linkTypeKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleLinkChange(index, 'type', key)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                      link.type === key
                        ? 'bg-[#7fa8c9] text-white'
                        : 'bg-white text-[#1a1a1a]/60 hover:bg-[#e8f1f8]'
                    )}
                  >
                    {t(`linkTypes.${key}`)}
                  </button>
                ))}
              </div>
              {/* Custom Type Input (직접 입력 선택 시) */}
              <AnimatePresence>
                {link.type === 'other' && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    type="text"
                    value={link.customType || ''}
                    onChange={(e) => handleLinkChange(index, 'customType', e.target.value)}
                    placeholder={t('labels.linkType')}
                    className={cn(
                      'w-full px-3 py-2 bg-white/80 border border-[#7fa8c9]/15 rounded-xl',
                      'text-xs placeholder:text-[#1a1a1a]/30',
                      'focus:outline-none focus:border-[#7fa8c9]/40'
                    )}
                  />
                )}
              </AnimatePresence>
              {/* URL Input */}
              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className={cn(
                    'flex-1 min-w-0 px-4 py-3 bg-white/80 border border-[#7fa8c9]/15 rounded-xl',
                    'text-sm placeholder:text-[#1a1a1a]/30',
                    'focus:outline-none focus:border-[#7fa8c9]/40'
                  )}
                />
                {formData.additionalLinks.length > 1 && (
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddLink}
          className="flex items-center gap-1.5 text-xs text-[#7fa8c9] hover:text-[#5a8ab0] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('buttons.addLink')}
        </button>

        <textarea
          value={formData.additionalNote}
          onChange={(e) => setFormData((prev) => ({ ...prev, additionalNote: e.target.value }))}
          placeholder={t('placeholders.additionalNote')}
          rows={2}
          className={cn(
            'w-full mt-3 px-4 py-3 bg-white/80 border border-[#7fa8c9]/15 rounded-xl',
            'text-sm placeholder:text-[#1a1a1a]/30 break-keep',
            'focus:outline-none focus:border-[#7fa8c9]/40 resize-none'
          )}
        />
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleClose}
          className={cn(
            'w-full py-4 rounded-2xl font-semibold',
            'bg-[#1a1a1a] text-white',
            'hover:bg-[#333]',
            'transition-all duration-300'
          )}
        >
          {t('buttons.close')}
        </button>
        <button
          onClick={handleGoBackFromComplete}
          className={cn(
            'flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm',
            'bg-[#f2f8fc] text-[#1a1a1a]/50 hover:bg-[#e8f1f8]',
            'transition-all duration-200'
          )}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('buttons.goBack')}
        </button>
      </div>
    </motion.div>
  );

  // ============================================
  // Main Render
  // ============================================

  const currentTitle = stepTitles[currentStep - 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            className={cn(
              'fixed z-50',
              // Mobile: full screen
              'inset-0',
              // PC: large centered modal
              'md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
              'md:w-[90vw] md:max-w-[900px] md:max-h-[85vh]',
              'pointer-events-none'
            )}
          >
            <motion.div
              className={cn(
                'h-full md:h-auto pointer-events-auto flex flex-col md:flex-row',
                // Glass Style
                'bg-white md:bg-white/95 md:backdrop-blur-2xl',
                'md:border md:border-[#7fa8c9]/10',
                'md:rounded-3xl md:shadow-[0_40px_100px_rgba(0,0,0,0.15)]',
                'overflow-hidden',
                className
              )}
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Left Panel (PC only) - Title */}
              {!isComplete && (
                <div className="hidden md:flex md:w-[45%] bg-[#1a1a1a] relative flex-col justify-between p-10">
                  {/* Background Glow */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-60 h-60 rounded-full bg-[#7fa8c9] blur-[80px]" />
                    <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#5a8ab0] blur-[60px]" />
                  </div>

                  {/* Progress Dots */}
                  <div className="relative z-10 flex items-center gap-2">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-2 rounded-full transition-all duration-300',
                          i + 1 === currentStep
                            ? 'w-6 bg-[#7fa8c9]'
                            : i + 1 < currentStep
                            ? 'w-2 bg-[#7fa8c9]/60'
                            : 'w-2 bg-white/20'
                        )}
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <div className="relative z-10 flex-1 flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                      >
                        <h2 className="text-3xl font-bold text-white leading-tight whitespace-pre-line">
                          {currentTitle.title}
                        </h2>
                        <p className="mt-3 text-base text-white/50">
                          {currentTitle.sub}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Step Info */}
                  <div className="relative z-10 text-white/40 text-xs">
                    STEP {currentStep} OF {totalSteps}
                  </div>
                </div>
              )}

              {/* Right Panel - Form */}
              <div className={cn(
                'flex-1 flex flex-col',
                isComplete ? 'md:w-full' : 'md:w-[55%]'
              )}>
                {/* Mobile Header */}
                <div className="md:hidden px-5 pt-5 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentStep > 1 && !isComplete ? (
                      <button
                        onClick={handleBack}
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center',
                          'bg-[#f2f8fc]',
                          'text-[#1a1a1a]/60'
                        )}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    ) : isComplete ? (
                      <button
                        onClick={handleGoBackFromComplete}
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center',
                          'bg-[#f2f8fc]',
                          'text-[#1a1a1a]/60'
                        )}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="w-10" />
                    )}
                    {!isComplete && (
                      <span className="text-sm font-medium text-[#7fa8c9]">
                        {currentStep} / {totalSteps}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleClose}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      'bg-[#f2f8fc]',
                      'text-[#1a1a1a]/60'
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* PC Close Button */}
                <div className="hidden md:flex justify-end p-4">
                  <button
                    onClick={handleClose}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      'bg-[#f2f8fc] hover:bg-[#e8f1f8]',
                      'text-[#1a1a1a]/50 hover:text-[#1a1a1a]',
                      'transition-colors duration-200'
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Progress */}
                {!isComplete && (
                  <div className="md:hidden px-5 pb-3">
                    <div className="h-1.5 bg-[#f2f8fc] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#7fa8c9] to-[#5a8ab0]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Title */}
                {!isComplete && (
                  <div className="md:hidden px-5 pt-2 pb-5">
                    <h2 className="text-xl font-bold text-[#1a1a1a] leading-tight whitespace-pre-line">
                      {currentTitle.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#1a1a1a]/40">{currentTitle.sub}</p>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 md:px-8 py-2 md:py-0">
                  <AnimatePresence mode="wait">
                    {isComplete ? (
                      <motion.div key="complete">
                        {renderComplete()}
                      </motion.div>
                    ) : (
                      <motion.div
                        key={currentStep}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {renderStep()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                {!isComplete && (
                  <div className="px-5 md:px-8 pb-6 pt-4">
                    {submitError && (
                      <p className="text-sm text-red-500 text-center mb-3">{submitError}</p>
                    )}
                    <button
                      onClick={handleNext}
                      disabled={!canProceed() || isSubmitting}
                      className={cn(
                        'w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2',
                        'transition-all duration-300',
                        canProceed() && !isSubmitting
                          ? 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                          : 'bg-[#f2f8fc] text-[#1a1a1a]/30 cursor-not-allowed'
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>처리 중...</span>
                        </>
                      ) : (
                        <>
                          {currentStep === totalSteps ? t('buttons.submit') : t('buttons.next')}
                          {canProceed() && <ArrowRight className="w-5 h-5" />}
                        </>
                      )}
                    </button>
                    <p className="hidden md:block text-[10px] text-center text-[#1a1a1a]/30 mt-3">
                      {t('labels.keyboard')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// Sub Components
// ============================================

function GlassChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'py-4 px-4 rounded-2xl text-sm font-medium transition-all duration-200',
        selected
          ? 'bg-gradient-to-br from-[#7fa8c9] to-[#5a8ab0] text-white shadow-[0_4px_20px_rgba(127,168,201,0.35)]'
          : 'bg-[#f2f8fc] text-[#1a1a1a]/70 hover:bg-[#e8f1f8] border border-transparent hover:border-[#7fa8c9]/20'
      )}
    >
      {children}
    </button>
  );
}

function GlassSelect({
  selected,
  recommended,
  recommendedLabel,
  onClick,
  children,
}: {
  selected: boolean;
  recommended?: boolean;
  recommendedLabel?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full py-4 px-5 rounded-2xl text-left text-sm font-medium transition-all duration-200',
        'flex items-center justify-between',
        selected
          ? 'bg-gradient-to-br from-[#7fa8c9] to-[#5a8ab0] text-white shadow-[0_4px_20px_rgba(127,168,201,0.35)]'
          : 'bg-[#f2f8fc] text-[#1a1a1a]/70 hover:bg-[#e8f1f8] border border-transparent hover:border-[#7fa8c9]/20'
      )}
    >
      <span>{children}</span>
      <span className="flex items-center gap-2">
        {recommended && !selected && (
          <span className="text-[10px] text-[#7fa8c9] bg-[#7fa8c9]/10 px-2 py-0.5 rounded-full">
            {recommendedLabel || '추천'}
          </span>
        )}
        {selected && <Check className="w-5 h-5" />}
      </span>
    </button>
  );
}

function GlassCheckbox({
  checked,
  recommended,
  recommendedLabel,
  onClick,
  children,
}: {
  checked: boolean;
  recommended?: boolean;
  recommendedLabel?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full py-4 px-5 rounded-2xl text-left font-medium transition-all duration-200',
        'flex items-center gap-3',
        checked
          ? 'bg-gradient-to-br from-[#7fa8c9] to-[#5a8ab0] text-white shadow-[0_4px_20px_rgba(127,168,201,0.35)]'
          : 'bg-[#f2f8fc] text-[#1a1a1a]/70 hover:bg-[#e8f1f8] border border-transparent hover:border-[#7fa8c9]/20'
      )}
    >
      <div
        className={cn(
          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0',
          checked ? 'bg-white/90 border-white/50' : 'border-[#7fa8c9]/30 bg-white/50'
        )}
      >
        {checked && <Check className="w-3.5 h-3.5 text-[#7fa8c9]" />}
      </div>
      <span className="flex-1 text-sm">{children}</span>
      {recommended && !checked && (
        <span className="text-[10px] text-[#7fa8c9] bg-[#7fa8c9]/10 px-2 py-0.5 rounded-full shrink-0">
          {recommendedLabel || '추천'}
        </span>
      )}
    </button>
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
