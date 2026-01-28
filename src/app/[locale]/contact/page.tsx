'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Check, Plus, X, Home, RotateCcw } from 'lucide-react';
import { useParams } from 'next/navigation';

// ============================================
// Types
// ============================================

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
}

const STORAGE_KEY = 'invisible-works-contact-form';

// ============================================
// Translations
// ============================================

const translations: Record<string, {
  industries: { id: string; label: string }[];
  purposes: { id: string; label: string; recommended?: boolean }[];
  currentAssets: { id: string; label: string; recommended?: boolean }[];
  quoteOptions: { id: string; label: string; recommended?: boolean }[];
  contactMethods: { id: string; label: string; recommended?: boolean; placeholder: string; type: string }[];
  linkTypes: { id: string; label: string }[];
  stepTitles: { title: string; sub: string }[];
  ui: {
    back: string;
    next: string;
    submit: string;
    skip: string;
    home: string;
    goBack: string;
    addLink: string;
    recommended: string;
    enterNext: string;
    escBack: string;
    stepOf: string;
    completeTitle: string;
    completeSubtitle: string;
    linkPlaceholder: string;
    notePlaceholder: string;
    customIndustryPlaceholder: string;
    customLinkTypePlaceholder: string;
    quoteYesMessage: string;
    quoteNoMessage: string;
    emailError: string;
    phoneError: string;
  };
}> = {
  ko: {
    industries: [
      { id: 'food', label: '음식점/카페' },
      { id: 'beauty', label: '뷰티/네일' },
      { id: 'fitness', label: '헬스/필라테스' },
      { id: 'education', label: '학원/교육' },
      { id: 'medical', label: '병원/클리닉' },
      { id: 'brand', label: '브랜드/제조' },
      { id: 'office', label: '사무실/오피스' },
      { id: 'other', label: '기타 (직접 입력)' },
    ],
    purposes: [
      { id: 'trust', label: '신뢰감 전달' },
      { id: 'inquiry', label: '문의 유도' },
      { id: 'reservation', label: '예약 연결' },
      { id: 'sales', label: '판매/결제' },
      { id: 'unknown', label: '잘 모르겠어요', recommended: true },
    ],
    currentAssets: [
      { id: 'sns', label: '인스타그램/블로그/플레이스가 있어요' },
      { id: 'logo', label: '로고가 있어요' },
      { id: 'photos', label: '사진(매장/제품)이 있어요' },
      { id: 'content', label: '소개글/메뉴/가격표가 있어요' },
      { id: 'website', label: '기존 웹사이트가 있어요' },
      { id: 'none', label: '아직 없어요', recommended: true },
    ],
    quoteOptions: [
      { id: 'yes', label: '받아봤어요' },
      { id: 'no', label: '아직 안 받아봤어요', recommended: true },
    ],
    contactMethods: [
      { id: 'sms', label: '문자', recommended: true, placeholder: '010-0000-0000', type: 'tel' },
      { id: 'email', label: '이메일', placeholder: 'example@email.com', type: 'email' },
      { id: 'call', label: '전화', placeholder: '010-0000-0000', type: 'tel' },
    ],
    linkTypes: [
      { id: 'own', label: '자사 홈페이지' },
      { id: 'competitor', label: '경쟁사' },
      { id: 'style', label: '원하는 스타일' },
      { id: 'other', label: '직접 입력' },
    ],
    stepTitles: [
      { title: '어떤 웹사이트를\n만들고 싶으신가요?', sub: '업종을 선택해주세요' },
      { title: '웹사이트로\n무엇을 하고 싶으세요?', sub: '목적을 알려주세요' },
      { title: '현재 갖고 계신 게\n있으신가요?', sub: '여러 개 선택 가능해요' },
      { title: '다른 곳에서\n견적을 받아보셨나요?', sub: '비교해보시면 판단이 쉬워져요' },
      { title: '연락은\n어떻게 드릴까요?', sub: '답변 드릴 연락처를 알려주세요' },
    ],
    ui: {
      back: '메인으로',
      next: '다음으로',
      submit: '입력 완료',
      skip: '건너뛰기',
      home: '홈으로 돌아가기',
      goBack: '이전 단계로 되돌아가기',
      addLink: '링크 추가',
      recommended: '추천',
      enterNext: 'Enter로 다음 · Esc로 뒤로',
      escBack: 'Esc로 뒤로',
      stepOf: 'STEP {current} OF {total}',
      completeTitle: '좋습니다. 곧 연락드리겠습니다.',
      completeSubtitle: '빠른 시일 내에 확인 후 답변드리겠습니다.',
      linkPlaceholder: '참고할 링크가 있으면 남겨주세요 (선택)',
      notePlaceholder: '궁금한 점이나 더 알려주고 싶은 내용이 있으면 편하게 적어주세요',
      customIndustryPlaceholder: '예: 스타트업, 개인 브랜드, 프리랜서...',
      customLinkTypePlaceholder: '어떤 종류의 링크인가요?',
      quoteYesMessage: '좋습니다. 기준이 있으시면 비교가 더 쉬워집니다.',
      quoteNoMessage: '꼭 한 번 받아보시는 걸 권합니다. 기준이 생기면 판단이 쉬워집니다.',
      emailError: '올바른 이메일 형식이 아닙니다',
      phoneError: '올바른 전화번호 형식이 아닙니다 (10-11자리)',
    },
  },
  en: {
    industries: [
      { id: 'food', label: 'Restaurant/Cafe' },
      { id: 'beauty', label: 'Beauty/Nail' },
      { id: 'fitness', label: 'Fitness/Pilates' },
      { id: 'education', label: 'Academy/Education' },
      { id: 'medical', label: 'Hospital/Clinic' },
      { id: 'brand', label: 'Brand/Manufacturing' },
      { id: 'office', label: 'Office' },
      { id: 'other', label: 'Other (Enter manually)' },
    ],
    purposes: [
      { id: 'trust', label: 'Build trust' },
      { id: 'inquiry', label: 'Generate inquiries' },
      { id: 'reservation', label: 'Enable reservations' },
      { id: 'sales', label: 'Drive sales' },
      { id: 'unknown', label: 'Not sure', recommended: true },
    ],
    currentAssets: [
      { id: 'sns', label: 'I have Instagram/Blog/Place' },
      { id: 'logo', label: 'I have a logo' },
      { id: 'photos', label: 'I have photos (store/products)' },
      { id: 'content', label: 'I have descriptions/menu/prices' },
      { id: 'website', label: 'I have an existing website' },
      { id: 'none', label: 'Not yet', recommended: true },
    ],
    quoteOptions: [
      { id: 'yes', label: 'Yes, I have' },
      { id: 'no', label: 'Not yet', recommended: true },
    ],
    contactMethods: [
      { id: 'sms', label: 'SMS', recommended: true, placeholder: '010-0000-0000', type: 'tel' },
      { id: 'email', label: 'Email', placeholder: 'example@email.com', type: 'email' },
      { id: 'call', label: 'Phone', placeholder: '010-0000-0000', type: 'tel' },
    ],
    linkTypes: [
      { id: 'own', label: 'Our website' },
      { id: 'competitor', label: 'Competitor' },
      { id: 'style', label: 'Preferred style' },
      { id: 'other', label: 'Enter manually' },
    ],
    stepTitles: [
      { title: 'What kind of website\ndo you want?', sub: 'Select your industry' },
      { title: 'What do you want\nfrom your website?', sub: 'Tell us your goal' },
      { title: 'What do you\ncurrently have?', sub: 'Multiple selections allowed' },
      { title: 'Have you received\na quote before?', sub: 'Comparison helps with decisions' },
      { title: 'How should we\ncontact you?', sub: 'Share your contact info' },
    ],
    ui: {
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      skip: 'Skip',
      home: 'Go to Home',
      goBack: 'Go back to previous step',
      addLink: 'Add link',
      recommended: 'Recommended',
      enterNext: 'Enter for next · Esc for back',
      escBack: 'Esc for back',
      stepOf: 'STEP {current} OF {total}',
      completeTitle: 'Great. We\'ll contact you soon.',
      completeSubtitle: 'We\'ll review and respond as soon as possible.',
      linkPlaceholder: 'Share reference links if you have any (optional)',
      notePlaceholder: 'Feel free to share any questions or additional information',
      customIndustryPlaceholder: 'e.g., Startup, Personal brand, Freelancer...',
      customLinkTypePlaceholder: 'What type of link is this?',
      quoteYesMessage: 'Great. Having a reference makes comparison easier.',
      quoteNoMessage: 'We recommend getting one. Having a standard makes decisions easier.',
      emailError: 'Invalid email format',
      phoneError: 'Invalid phone format (10-11 digits)',
    },
  },
  'zh-CN': {
    industries: [
      { id: 'food', label: '餐厅/咖啡厅' },
      { id: 'beauty', label: '美容/美甲' },
      { id: 'fitness', label: '健身/普拉提' },
      { id: 'education', label: '培训/教育' },
      { id: 'medical', label: '医院/诊所' },
      { id: 'brand', label: '品牌/制造' },
      { id: 'office', label: '办公室' },
      { id: 'other', label: '其他（手动输入）' },
    ],
    purposes: [
      { id: 'trust', label: '建立信任' },
      { id: 'inquiry', label: '促进咨询' },
      { id: 'reservation', label: '启用预订' },
      { id: 'sales', label: '促进销售' },
      { id: 'unknown', label: '不确定', recommended: true },
    ],
    currentAssets: [
      { id: 'sns', label: '我有Instagram/博客/商铺' },
      { id: 'logo', label: '我有logo' },
      { id: 'photos', label: '我有照片（店铺/产品）' },
      { id: 'content', label: '我有介绍/菜单/价格表' },
      { id: 'website', label: '我有现有网站' },
      { id: 'none', label: '还没有', recommended: true },
    ],
    quoteOptions: [
      { id: 'yes', label: '收到过' },
      { id: 'no', label: '还没有', recommended: true },
    ],
    contactMethods: [
      { id: 'sms', label: '短信', recommended: true, placeholder: '010-0000-0000', type: 'tel' },
      { id: 'email', label: '邮件', placeholder: 'example@email.com', type: 'email' },
      { id: 'call', label: '电话', placeholder: '010-0000-0000', type: 'tel' },
    ],
    linkTypes: [
      { id: 'own', label: '自有网站' },
      { id: 'competitor', label: '竞争对手' },
      { id: 'style', label: '喜欢的风格' },
      { id: 'other', label: '手动输入' },
    ],
    stepTitles: [
      { title: '您想要什么样的\n网站？', sub: '请选择您的行业' },
      { title: '您想通过网站\n实现什么？', sub: '告诉我们您的目标' },
      { title: '您目前\n拥有什么？', sub: '可多选' },
      { title: '您之前收到过\n报价吗？', sub: '有比较才能做决定' },
      { title: '我们如何\n联系您？', sub: '请分享您的联系方式' },
    ],
    ui: {
      back: '返回',
      next: '下一步',
      submit: '提交',
      skip: '跳过',
      home: '返回首页',
      goBack: '返回上一步',
      addLink: '添加链接',
      recommended: '推荐',
      enterNext: 'Enter下一步 · Esc返回',
      escBack: 'Esc返回',
      stepOf: '第{current}步，共{total}步',
      completeTitle: '好的，我们会尽快联系您。',
      completeSubtitle: '我们会尽快审核并回复您。',
      linkPlaceholder: '如有参考链接请留下（选填）',
      notePlaceholder: '如有任何问题或补充信息，请随时告诉我们',
      customIndustryPlaceholder: '例如：创业公司、个人品牌、自由职业者...',
      customLinkTypePlaceholder: '这是什么类型的链接？',
      quoteYesMessage: '很好。有参考标准会更容易比较。',
      quoteNoMessage: '建议您先获取一个报价。有标准才能做决定。',
      emailError: '邮箱格式无效',
      phoneError: '电话格式无效（10-11位数字）',
    },
  },
  'zh-TW': {
    industries: [
      { id: 'food', label: '餐廳/咖啡廳' },
      { id: 'beauty', label: '美容/美甲' },
      { id: 'fitness', label: '健身/普拉提' },
      { id: 'education', label: '培訓/教育' },
      { id: 'medical', label: '醫院/診所' },
      { id: 'brand', label: '品牌/製造' },
      { id: 'office', label: '辦公室' },
      { id: 'other', label: '其他（手動輸入）' },
    ],
    purposes: [
      { id: 'trust', label: '建立信任' },
      { id: 'inquiry', label: '促進諮詢' },
      { id: 'reservation', label: '啟用預訂' },
      { id: 'sales', label: '促進銷售' },
      { id: 'unknown', label: '不確定', recommended: true },
    ],
    currentAssets: [
      { id: 'sns', label: '我有Instagram/部落格/商鋪' },
      { id: 'logo', label: '我有logo' },
      { id: 'photos', label: '我有照片（店鋪/產品）' },
      { id: 'content', label: '我有介紹/菜單/價格表' },
      { id: 'website', label: '我有現有網站' },
      { id: 'none', label: '還沒有', recommended: true },
    ],
    quoteOptions: [
      { id: 'yes', label: '收到過' },
      { id: 'no', label: '還沒有', recommended: true },
    ],
    contactMethods: [
      { id: 'sms', label: '簡訊', recommended: true, placeholder: '010-0000-0000', type: 'tel' },
      { id: 'email', label: '郵件', placeholder: 'example@email.com', type: 'email' },
      { id: 'call', label: '電話', placeholder: '010-0000-0000', type: 'tel' },
    ],
    linkTypes: [
      { id: 'own', label: '自有網站' },
      { id: 'competitor', label: '競爭對手' },
      { id: 'style', label: '喜歡的風格' },
      { id: 'other', label: '手動輸入' },
    ],
    stepTitles: [
      { title: '您想要什麼樣的\n網站？', sub: '請選擇您的行業' },
      { title: '您想通過網站\n實現什麼？', sub: '告訴我們您的目標' },
      { title: '您目前\n擁有什麼？', sub: '可多選' },
      { title: '您之前收到過\n報價嗎？', sub: '有比較才能做決定' },
      { title: '我們如何\n聯繫您？', sub: '請分享您的聯繫方式' },
    ],
    ui: {
      back: '返回',
      next: '下一步',
      submit: '提交',
      skip: '跳過',
      home: '返回首頁',
      goBack: '返回上一步',
      addLink: '添加連結',
      recommended: '推薦',
      enterNext: 'Enter下一步 · Esc返回',
      escBack: 'Esc返回',
      stepOf: '第{current}步，共{total}步',
      completeTitle: '好的，我們會儘快聯繫您。',
      completeSubtitle: '我們會儘快審核並回覆您。',
      linkPlaceholder: '如有參考連結請留下（選填）',
      notePlaceholder: '如有任何問題或補充資訊，請隨時告訴我們',
      customIndustryPlaceholder: '例如：創業公司、個人品牌、自由職業者...',
      customLinkTypePlaceholder: '這是什麼類型的連結？',
      quoteYesMessage: '很好。有參考標準會更容易比較。',
      quoteNoMessage: '建議您先獲取一個報價。有標準才能做決定。',
      emailError: '郵箱格式無效',
      phoneError: '電話格式無效（10-11位數字）',
    },
  },
};

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
// Contact Page
// ============================================

export default function ContactPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'ko';
  const t = translations[locale] || translations['en'];

  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [contactError, setContactError] = useState('');
  // 한국어가 아닌 경우 이메일만 사용 가능
  const isKorean = locale === 'ko';
  const defaultContactMethod = isKorean ? 'sms' : 'email';
  const defaultContactValue = isKorean ? '010' : '';

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
  });

  const totalSteps = 5;

  // 언어 변경 시 연락 방법 초기화
  useEffect(() => {
    if (!isKorean && formData.contactMethod !== 'email') {
      setFormData(prev => ({
        ...prev,
        contactMethod: 'email',
        contactValue: '',
      }));
    }
  }, [isKorean]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
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
    if (!isComplete) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    }
  }, [formData, currentStep, isComplete]);

  const validateContactValue = useCallback(() => {
    const { contactMethod, contactValue } = formData;

    if (!contactValue.trim()) {
      return { valid: false, error: '' };
    }

    if (contactMethod === 'email') {
      if (!validateEmail(contactValue)) {
        return { valid: false, error: t.ui.emailError };
      }
    } else {
      if (!validatePhone(contactValue)) {
        return { valid: false, error: t.ui.phoneError };
      }
    }

    return { valid: true, error: '' };
  }, [formData, t.ui.emailError, t.ui.phoneError]);

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
      if (isComplete) return;

      if (e.key === 'Enter' && !e.shiftKey && canProceed()) {
        e.preventDefault();
        handleNext();
      }
      if (e.key === 'Escape' && currentStep > 1) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, canProceed, handleNext, handleBack, isComplete]);

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.removeItem(STORAGE_KEY);
    setIsComplete(true);
  };

  const handleContactMethodChange = (methodId: string) => {
    const isPhoneMethod = methodId === 'sms' || methodId === 'call';
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

    if (contactMethod === 'sms' || contactMethod === 'call') {
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
    enter: { y: 30, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -30, opacity: 0 },
  };

  // ============================================
  // Render Steps
  // ============================================

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {t.industries.map((item) => (
                <GlassChip
                  key={item.id}
                  selected={formData.industry === item.id}
                  onClick={() => setFormData((prev) => ({ ...prev, industry: item.id }))}
                >
                  {item.label}
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
                    placeholder={t.ui.customIndustryPlaceholder}
                    className={cn(
                      'w-full mt-3 px-6 py-5 bg-white/60 backdrop-blur-xl',
                      'border-2 border-[#7fa8c9]/30 rounded-2xl',
                      'text-lg text-[#1a1a1a] placeholder:text-[#1a1a1a]/30',
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
          <div className="space-y-3">
            {t.purposes.map((item) => (
              <GlassSelect
                key={item.id}
                selected={formData.purpose === item.id}
                recommended={item.recommended}
                recommendedLabel={t.ui.recommended}
                onClick={() => setFormData((prev) => ({ ...prev, purpose: item.id }))}
              >
                {item.label}
              </GlassSelect>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            {t.currentAssets.map((item) => (
              <GlassCheckbox
                key={item.id}
                checked={formData.currentAssets.includes(item.id)}
                recommended={item.recommended}
                recommendedLabel={t.ui.recommended}
                onClick={() => {
                  setFormData((prev) => {
                    const isChecked = prev.currentAssets.includes(item.id);
                    if (item.id === 'none') {
                      return { ...prev, currentAssets: isChecked ? [] : ['none'] };
                    }
                    const newAssets = isChecked
                      ? prev.currentAssets.filter((id) => id !== item.id)
                      : [...prev.currentAssets.filter((id) => id !== 'none'), item.id];
                    return { ...prev, currentAssets: newAssets };
                  });
                }}
              >
                {item.label}
              </GlassCheckbox>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-3">
            {t.quoteOptions.map((item) => (
              <GlassSelect
                key={item.id}
                selected={formData.hasQuote === item.id}
                recommended={item.recommended}
                recommendedLabel={t.ui.recommended}
                onClick={() => setFormData((prev) => ({ ...prev, hasQuote: item.id }))}
              >
                {item.label}
              </GlassSelect>
            ))}
            <AnimatePresence>
              {formData.hasQuote && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 text-base text-[#7fa8c9] text-center break-keep"
                >
                  {formData.hasQuote === 'yes' ? t.ui.quoteYesMessage : t.ui.quoteNoMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );

      case 5:
        // 한국어가 아닌 경우 이메일만 표시
        const availableMethods = isKorean
          ? t.contactMethods
          : t.contactMethods.filter(m => m.id === 'email');
        const selectedMethod = t.contactMethods.find((m) => m.id === formData.contactMethod);

        return (
          <div className="space-y-5">
            {/* 한국어인 경우에만 연락 방법 선택 버튼 표시 */}
            {isKorean && (
              <div className="flex gap-3">
                {availableMethods.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleContactMethodChange(item.id)}
                    className={cn(
                      'flex-1 py-4 px-4 rounded-2xl text-base font-medium transition-all duration-200',
                      formData.contactMethod === item.id
                        ? 'bg-[#7fa8c9] text-white shadow-[0_4px_24px_rgba(127,168,201,0.4)]'
                        : 'bg-[#f2f8fc] text-[#1a1a1a]/60 hover:bg-[#e8f1f8]'
                    )}
                  >
                    {item.label}
                    {item.recommended && formData.contactMethod !== item.id && (
                      <span className="ml-1 text-xs text-[#7fa8c9]/70">{t.ui.recommended}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <div>
              <input
                type={selectedMethod?.type || 'email'}
                value={formData.contactValue}
                onChange={(e) => handleContactValueChange(e.target.value)}
                placeholder={isKorean ? selectedMethod?.placeholder : 'example@email.com'}
                className={cn(
                  'w-full px-6 py-5 bg-white/60 backdrop-blur-xl',
                  'border-2 rounded-2xl',
                  'text-xl text-[#1a1a1a] placeholder:text-[#1a1a1a]/30',
                  'focus:outline-none focus:bg-white/80',
                  'transition-all duration-200',
                  contactError
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#7fa8c9]/30 focus:border-[#7fa8c9]'
                )}
                autoFocus
              />
              {contactError && (
                <p className="mt-2 text-sm text-red-500">{contactError}</p>
              )}
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

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] via-white to-[#f2f8fc] flex flex-col">
        <header className="px-6 py-5">
          <button
            onClick={handleGoBackFromComplete}
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center',
              'bg-white/80 backdrop-blur border border-[#7fa8c9]/10',
              'text-[#1a1a1a]/60 hover:text-[#1a1a1a]',
              'shadow-sm transition-all duration-200'
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-[#7fa8c9] to-[#5a8ab0] rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_16px_48px_rgba(127,168,201,0.5)]"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-5 leading-tight break-keep">
                {t.ui.completeTitle}
              </h1>
              <p className="text-lg text-[#1a1a1a]/50">
                {t.ui.completeSubtitle}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-[#7fa8c9]/10 rounded-3xl p-8 mb-8 shadow-[0_8px_40px_rgba(127,168,201,0.1)]">
              <p className="text-base text-[#1a1a1a]/50 mb-6">
                {t.ui.linkPlaceholder}
              </p>

              <div className="space-y-4 mb-4">
                {formData.additionalLinks.map((link, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {t.linkTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => handleLinkChange(index, 'type', type.id)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                            link.type === type.id
                              ? 'bg-[#7fa8c9] text-white'
                              : 'bg-[#f2f8fc] text-[#1a1a1a]/60 hover:bg-[#e8f1f8]'
                          )}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                    <AnimatePresence>
                      {link.type === 'other' && (
                        <motion.input
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          type="text"
                          value={link.customType || ''}
                          onChange={(e) => handleLinkChange(index, 'customType', e.target.value)}
                          placeholder={t.ui.customLinkTypePlaceholder}
                          className={cn(
                            'w-full px-4 py-3 bg-[#f2f8fc] border border-[#7fa8c9]/10 rounded-xl',
                            'text-sm placeholder:text-[#1a1a1a]/30',
                            'focus:outline-none focus:border-[#7fa8c9]/30 focus:bg-white'
                          )}
                        />
                      )}
                    </AnimatePresence>
                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className={cn(
                          'flex-1 min-w-0 px-4 py-4 bg-[#f2f8fc] border border-[#7fa8c9]/10 rounded-xl',
                          'text-base placeholder:text-[#1a1a1a]/30',
                          'focus:outline-none focus:border-[#7fa8c9]/30 focus:bg-white'
                        )}
                      />
                      {formData.additionalLinks.length > 1 && (
                        <button
                          onClick={() => handleRemoveLink(index)}
                          className="shrink-0 w-10 h-10 flex items-center justify-center text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddLink}
                className="flex items-center gap-2 text-base text-[#7fa8c9] hover:text-[#5a8ab0] transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t.ui.addLink}
              </button>

              <textarea
                value={formData.additionalNote}
                onChange={(e) => setFormData((prev) => ({ ...prev, additionalNote: e.target.value }))}
                placeholder={t.ui.notePlaceholder}
                rows={3}
                className={cn(
                  'w-full mt-5 px-5 py-4 bg-[#f2f8fc] border border-[#7fa8c9]/10 rounded-xl',
                  'text-base placeholder:text-[#1a1a1a]/30 break-keep',
                  'focus:outline-none focus:border-[#7fa8c9]/30 focus:bg-white resize-none'
                )}
              />
            </div>

            <div className="space-y-3">
              <Link
                href={`/${locale}`}
                className={cn(
                  'flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-semibold text-lg',
                  'bg-gradient-to-r from-[#7fa8c9] to-[#5a8ab0] text-white',
                  'shadow-[0_4px_24px_rgba(127,168,201,0.4)]',
                  'hover:shadow-[0_8px_32px_rgba(127,168,201,0.5)]',
                  'transition-all duration-300'
                )}
              >
                <Home className="w-5 h-5" />
                {t.ui.home}
              </Link>
              <button
                onClick={handleGoBackFromComplete}
                className={cn(
                  'flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-medium',
                  'bg-[#f2f8fc] text-[#1a1a1a]/60 hover:bg-[#e8f1f8]',
                  'transition-all duration-200'
                )}
              >
                <RotateCcw className="w-4 h-4" />
                {t.ui.goBack}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============================================
  // Main Form - Split Layout for PC
  // ============================================

  const currentTitle = t.stepTitles[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfd] via-white to-[#f2f8fc]">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center',
                  'bg-white/80 backdrop-blur border border-[#7fa8c9]/10',
                  'text-[#1a1a1a]/60 hover:text-[#1a1a1a]',
                  'shadow-sm transition-all duration-200'
                )}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={`/${locale}`}
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center',
                  'bg-white/80 backdrop-blur border border-[#7fa8c9]/10',
                  'text-[#1a1a1a]/60 hover:text-[#1a1a1a]',
                  'shadow-sm transition-all duration-200'
                )}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
          </div>
          <span className="text-sm font-medium text-[#7fa8c9]">
            {currentStep} / {totalSteps}
          </span>
        </header>

        <div className="px-6">
          <div className="h-1.5 bg-[#f2f8fc] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7fa8c9] to-[#5a8ab0]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="flex-1 px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1a1a1a] leading-tight whitespace-pre-line">
              {currentTitle.title}
            </h1>
            <p className="mt-2 text-base text-[#1a1a1a]/40">{currentTitle.sub}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="px-6 py-6">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              'w-full py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2',
              'transition-all duration-300',
              canProceed()
                ? 'bg-gradient-to-r from-[#7fa8c9] to-[#5a8ab0] text-white shadow-[0_4px_24px_rgba(127,168,201,0.4)]'
                : 'bg-[#f2f8fc] text-[#1a1a1a]/30 cursor-not-allowed'
            )}
          >
            {currentStep === totalSteps ? t.ui.submit : t.ui.next}
            {canProceed() && <ArrowRight className="w-5 h-5" />}
          </button>
        </footer>
      </div>

      {/* Desktop Layout - Split 50:50 */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Panel - Title & Navigation */}
        <div className="w-1/2 bg-[#1a1a1a] relative flex flex-col justify-between p-12 xl:p-16">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-[#7fa8c9] blur-[120px]" />
            <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-[#5a8ab0] blur-[100px]" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  'bg-white/10 hover:bg-white/20',
                  'text-white/60 hover:text-white',
                  'transition-all duration-200'
                )}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={`/${locale}`}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  'bg-white/10 hover:bg-white/20',
                  'text-white/60 hover:text-white',
                  'transition-all duration-200'
                )}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}

            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-300',
                    i + 1 === currentStep
                      ? 'w-8 bg-[#7fa8c9]'
                      : i + 1 < currentStep
                      ? 'bg-[#7fa8c9]/60'
                      : 'bg-white/20'
                  )}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight whitespace-pre-line">
                  {currentTitle.title}
                </h1>
                <p className="mt-4 text-lg xl:text-xl text-white/50">
                  {currentTitle.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex items-center justify-between text-white/40">
            <span className="text-sm">STEP {currentStep} OF {totalSteps}</span>
            <span className="text-sm">{t.ui.enterNext}</span>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-1/2 flex flex-col justify-center p-12 xl:p-16">
          <div className="max-w-lg mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  'w-full py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3',
                  'transition-all duration-300',
                  canProceed()
                    ? 'bg-[#1a1a1a] text-white hover:bg-[#333] shadow-[0_4px_24px_rgba(0,0,0,0.15)]'
                    : 'bg-[#f2f8fc] text-[#1a1a1a]/30 cursor-not-allowed'
                )}
              >
                {currentStep === totalSteps ? t.ui.submit : t.ui.next}
                {canProceed() && <ArrowRight className="w-5 h-5" />}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Sub Components (Glass Style)
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
        'py-5 px-4 rounded-2xl text-sm sm:text-base font-medium transition-all duration-200',
        'break-words hyphens-auto text-center min-h-[4rem] flex items-center justify-center',
        selected
          ? 'bg-gradient-to-br from-[#7fa8c9] to-[#5a8ab0] text-white shadow-[0_4px_24px_rgba(127,168,201,0.4)]'
          : 'bg-white/80 lg:bg-[#f2f8fc] text-[#1a1a1a]/70 hover:bg-[#e8f1f8] border border-[#7fa8c9]/10 hover:border-[#7fa8c9]/25'
      )}
    >
      <span className="break-words">{children}</span>
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
        'w-full py-5 px-4 sm:px-6 rounded-2xl text-left text-sm sm:text-base font-medium transition-all duration-200',
        'flex items-center justify-between gap-2',
        selected
          ? 'bg-gradient-to-br from-[#7fa8c9] to-[#5a8ab0] text-white shadow-[0_4px_24px_rgba(127,168,201,0.4)]'
          : 'bg-white/80 lg:bg-[#f2f8fc] text-[#1a1a1a]/70 hover:bg-[#e8f1f8] border border-[#7fa8c9]/10 hover:border-[#7fa8c9]/25'
      )}
    >
      <span className="flex-1 break-words hyphens-auto">{children}</span>
      <span className="flex items-center gap-2 shrink-0">
        {recommended && !selected && (
          <span className="text-xs text-[#7fa8c9] bg-[#7fa8c9]/10 px-2 py-1 rounded-full whitespace-nowrap">
            {recommendedLabel || 'Recommended'}
          </span>
        )}
        {selected && <Check className="w-5 h-5 shrink-0" />}
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
        'w-full py-5 px-4 sm:px-6 rounded-2xl text-left font-medium transition-all duration-200',
        'flex items-center gap-3 sm:gap-4',
        checked
          ? 'bg-gradient-to-br from-[#7fa8c9] to-[#5a8ab0] text-white shadow-[0_4px_24px_rgba(127,168,201,0.4)]'
          : 'bg-white/80 lg:bg-[#f2f8fc] text-[#1a1a1a]/70 hover:bg-[#e8f1f8] border border-[#7fa8c9]/10 hover:border-[#7fa8c9]/25'
      )}
    >
      <div
        className={cn(
          'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0',
          checked ? 'bg-white/90 border-white/50' : 'border-[#7fa8c9]/30 bg-white/50'
        )}
      >
        {checked && <Check className="w-4 h-4 text-[#7fa8c9]" />}
      </div>
      <span className="flex-1 text-sm sm:text-base break-words hyphens-auto">{children}</span>
      {recommended && !checked && (
        <span className="text-xs text-[#7fa8c9] bg-[#7fa8c9]/10 px-2 py-1 rounded-full shrink-0 whitespace-nowrap">
          {recommendedLabel || 'Recommended'}
        </span>
      )}
    </button>
  );
}
