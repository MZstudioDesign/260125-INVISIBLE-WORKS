'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
import {
  GlassCard,
  GlassButton,
  GlassBadge,
  GlassInput,
  GlassTextarea,
  GlassDivider,
  RevealText,
  Navigation,
  DialWheel,
  AccordionStep,
  DesignStepContent,
  TimelineBlur,
  CTASection,
  Marquee,
  ShimmerButton,
  GlowButton,
  RippleButton,
  BlurFade,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  UnderlineReveal,
  HighlightReveal,
  ContactModal,
} from '@/presentation/components/ui';
import { useState } from 'react';

export default function DesignSystemPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: `/${locale}` },
    { label: 'Design System', href: `/${locale}/design-system`, isActive: true },
  ];

  // 언어별 폰트 정보
  const fontInfo: Record<string, { name: string; family: string; sample: string }> = {
    ko: { name: 'Pretendard', family: 'Pretendard Variable', sample: '안녕하세요, Invisible Works입니다.' },
    en: { name: 'Inter', family: 'Inter', sample: 'Hello, we are Invisible Works.' },
    'zh-CN': { name: 'Noto Sans SC', family: 'Noto Sans SC', sample: '您好，我们是 Invisible Works。' },
    'zh-TW': { name: 'Noto Sans TC', family: 'Noto Sans TC', sample: '您好，我們是 Invisible Works。' },
  };

  const currentFont = fontInfo[locale] || fontInfo['en'];

  // AccordionStep 데모 데이터
  const accordionItems = [
    {
      id: '1',
      number: '01',
      title: locale === 'ko' ? '내용 전달' : 'Share Content',
      content: <p className="text-[#1a1a1a]/60">{locale === 'ko' ? '웹사이트에 들어갈 자료를 전달합니다.' : 'Send materials for the website.'}</p>,
    },
    {
      id: '2',
      number: '02',
      title: locale === 'ko' ? '디자인 선택' : 'Choose Design',
      content: (
        <DesignStepContent
          description={locale === 'ko' ? '디자인 시안 3종 중 하나를 선택합니다.' : 'Choose one from 3 design options.'}
          images={[
            { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop', alt: 'Design 1' },
            { src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=600&fit=crop', alt: 'Design 2' },
            { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop', alt: 'Design 3' },
          ]}
          freeEmphasis={locale === 'ko' ? '여기까지 무료' : 'Free until here'}
        />
      ),
    },
    {
      id: '3',
      number: '03',
      title: locale === 'ko' ? '웹사이트 완성' : 'Complete Website',
      content: <p className="text-[#1a1a1a]/60">{locale === 'ko' ? '선택한 디자인으로 웹사이트를 완성합니다.' : 'Complete the website with chosen design.'}</p>,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AmbientBackground variant="lido" />
      <Navigation items={navItems} />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-8 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-6">Design System</h1>
            <p className="text-xl text-[#1a1a1a]/60">Invisible Works UI Components & Typography</p>
          </motion.div>
        </div>
      </section>

      {/* Font Section */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Typography</h2>
          <GlassCard className="p-8" hover={false}>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[#1a1a1a]/60 mb-2">Current Language: <strong>{locale.toUpperCase()}</strong></p>
                <p className="text-sm text-[#1a1a1a]/60 mb-4">Font Family: <strong>{currentFont.name}</strong></p>
              </div>
              <div className="space-y-4">
                <p className="text-4xl font-bold">{currentFont.sample}</p>
                <p className="text-2xl font-semibold">{currentFont.sample}</p>
                <p className="text-xl font-medium">{currentFont.sample}</p>
                <p className="text-base">{currentFont.sample}</p>
                <p className="text-sm text-[#1a1a1a]/60">{currentFont.sample}</p>
              </div>
            </div>
          </GlassCard>

          {/* Font Guide */}
          <div className="mt-8 p-6 bg-[#f2f8fc] rounded-2xl">
            <h3 className="font-semibold text-[#1a1a1a] mb-4">Language Font Guide</h3>
            <ul className="space-y-2 text-sm text-[#1a1a1a]/70">
              <li><strong>Korean (KO):</strong> Pretendard Variable - 한국어 UI에 최적화된 산세리프</li>
              <li><strong>English (EN):</strong> Inter - Clean and modern sans-serif for English</li>
              <li><strong>Chinese Simplified (ZH-CN):</strong> Noto Sans SC - 简体中文专用无衬线字体</li>
              <li><strong>Chinese Traditional (ZH-TW):</strong> Noto Sans TC - 繁體中文專用無襯線字體</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Basic Components Section */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Basic Components</h2>

          {/* Buttons */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Glass Buttons</h3>
            <GlassCard className="p-8" hover={false}>
              <div className="flex flex-wrap gap-4">
                <GlassButton variant="outline">Outline Button</GlassButton>
                <GlassButton variant="accent">Accent Button</GlassButton>
                <GlassButton variant="outline" size="sm">Small</GlassButton>
                <GlassButton variant="outline" size="lg">Large</GlassButton>
              </div>
            </GlassCard>
          </div>

          {/* Special Buttons */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Special Buttons</h3>
            <GlassCard className="p-8" hover={false}>
              <div className="flex flex-wrap gap-4">
                <ShimmerButton>Shimmer Button</ShimmerButton>
                <GlowButton>Glow Button</GlowButton>
                <RippleButton>Ripple Button</RippleButton>
              </div>
            </GlassCard>
          </div>

          {/* Badges */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Badges</h3>
            <GlassCard className="p-8" hover={false}>
              <div className="flex flex-wrap gap-4">
                <GlassBadge variant="accent">Accent</GlassBadge>
                <GlassBadge variant="outline">Outline</GlassBadge>
                <GlassBadge>Process</GlassBadge>
                <GlassBadge>Portfolio</GlassBadge>
              </div>
            </GlassCard>
          </div>

          {/* Inputs */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Inputs</h3>
            <GlassCard className="p-8" hover={false}>
              <div className="space-y-4 max-w-md">
                <GlassInput label="Name" placeholder="Enter your name" />
                <GlassInput label="Email" placeholder="example@email.com" type="email" />
                <GlassInput label="Required Field (Error)" placeholder="This field is required" error="필수 입력 값입니다" />
                <GlassTextarea label="Message" placeholder="Your message..." />
                <GlassTextarea label="Message (Error)" placeholder="Your message..." error="내용을 입력해주세요" />
              </div>
            </GlassCard>
          </div>

          {/* Dividers */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Dividers</h3>
            <GlassCard className="p-8" hover={false}>
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">Line</p>
                  <GlassDivider variant="line" />
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">Dots</p>
                  <GlassDivider variant="dots" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Cards */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Cards</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h4 className="font-semibold mb-2">Hover Card</h4>
                <p className="text-[#1a1a1a]/60 text-sm">This card has hover effect</p>
              </GlassCard>
              <GlassCard className="p-6" hover={false}>
                <h4 className="font-semibold mb-2">Static Card</h4>
                <p className="text-[#1a1a1a]/60 text-sm">This card is static (no hover)</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Animation Components */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Animation Components</h2>

          {/* Text Effects */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Text Effects</h3>
            <GlassCard className="p-8" hover={false}>
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">RevealText (fade)</p>
                  <RevealText variant="fade" className="text-2xl font-semibold">
                    {currentFont.sample}
                  </RevealText>
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">UnderlineReveal</p>
                  <p className="text-2xl font-semibold">
                    <UnderlineReveal>{locale === 'ko' ? '밑줄 효과' : 'Underline Effect'}</UnderlineReveal>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">HighlightReveal</p>
                  <p className="text-2xl font-semibold">
                    <HighlightReveal>{locale === 'ko' ? '하이라이트 효과' : 'Highlight Effect'}</HighlightReveal>
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* BlurFade */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">BlurFade</h3>
            <GlassCard className="p-8" hover={false}>
              <div className="flex gap-4">
                {[0, 0.1, 0.2, 0.3].map((delay, i) => (
                  <BlurFade key={i} delay={delay}>
                    <div className="w-16 h-16 bg-[#7fa8c9] rounded-xl flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                  </BlurFade>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Skeleton Loading */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Skeleton Loading</h3>
            <GlassCard className="p-8" hover={false}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">Skeleton</p>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">SkeletonText</p>
                  <SkeletonText lines={3} />
                </div>
                <div>
                  <p className="text-sm text-[#1a1a1a]/60 mb-2">SkeletonCard</p>
                  <SkeletonCard />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Section Components */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Section Components</h2>
        </div>

        {/* DialWheel */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto px-6 mb-4">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70">DialWheel</h3>
            <p className="text-sm text-[#1a1a1a]/50 mt-1">3D rotating wheel component (dark background)</p>
          </div>
          <div className="bg-black py-16">
            <div className="max-w-5xl mx-auto px-6 flex justify-center">
              <DialWheel />
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">AccordionStep</h3>
          <GlassCard className="p-8" hover={false}>
            <AccordionStep items={accordionItems} />
          </GlassCard>
        </div>

        {/* TimelineBlur */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto px-6 mb-4">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70">TimelineBlur</h3>
            <p className="text-sm text-[#1a1a1a]/50 mt-1">Animated timeline with blur effect</p>
          </div>
          <div className="max-w-5xl mx-auto px-6">
            <TimelineBlur
              items={[
                { id: '1', text: locale === 'ko' ? '복잡하게 느껴진 진행' : 'Confusing process' },
                { id: '2', text: locale === 'ko' ? '필요한지 모르겠던 단계들' : 'Unnecessary steps' },
                { id: '3', text: locale === 'ko' ? '결정할 게 너무 많았던 과정' : 'Too many decisions' },
              ]}
            />
          </div>
        </div>

        {/* Marquee */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto px-6 mb-4">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70">Marquee</h3>
            <p className="text-sm text-[#1a1a1a]/50 mt-1">Infinite scrolling content</p>
          </div>
          <Marquee speed="normal">
            {['Design', 'Development', 'Strategy', 'Branding', 'Marketing'].map((item, i) => (
              <div key={i} className="mx-4 px-6 py-3 bg-[#f2f8fc] rounded-full text-[#1a1a1a] font-medium">
                {item}
              </div>
            ))}
          </Marquee>
        </div>

        {/* CTA Section */}
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">CTASection</h3>
          <GlassCard className="p-8" hover={false}>
            <CTASection
              text={locale === 'ko' ? '내 웹사이트 디자인 보러가기' : 'See your website design'}
              href="#"
            />
          </GlassCard>
        </div>
      </section>

      {/* Color Palette */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Color Palette</h2>
          <GlassCard className="p-8" hover={false}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="w-full h-24 rounded-xl bg-[#f2f8fc] border border-[#7fa8c9]/20" />
                <p className="text-sm font-medium mt-2">Soft Blue</p>
                <p className="text-xs text-[#1a1a1a]/60">#f2f8fc</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-xl bg-[#7fa8c9]" />
                <p className="text-sm font-medium mt-2">Muted Aqua</p>
                <p className="text-xs text-[#1a1a1a]/60">#7fa8c9</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-xl bg-[#5a8ab0]" />
                <p className="text-sm font-medium mt-2">Deep Aqua</p>
                <p className="text-xs text-[#1a1a1a]/60">#5a8ab0</p>
              </div>
              <div>
                <div className="w-full h-24 rounded-xl bg-[#1a1a1a]" />
                <p className="text-sm font-medium mt-2">Dark Gray</p>
                <p className="text-xs text-[#1a1a1a]/60">#1a1a1a</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Modals */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Modals</h2>
          <GlassCard className="p-8" hover={false}>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#1a1a1a]/70">Contact Modal</h3>
              <p className="text-sm text-[#1a1a1a]/60 mb-4">Multi-step contact form modal</p>
              <GlassButton onClick={() => setIsContactModalOpen(true)}>
                Open Contact Modal
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </section>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
