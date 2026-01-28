'use client';

import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
import {
  Navigation,
  SplineEmbed,
  DialWheel,
  TimelineBlur,
  GradientHorizon,
  AccordionStep,
  DesignStepContent,
  PortfolioMarquee,
  ScrollStory,
  Footer,
  GlassDivider,
} from '@/presentation/components/ui';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

// ============================================
// Page Component
// ============================================

export default function Home() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  // 언어별 줄바꿈 클래스
  const breakClass = locale === 'ko' ? 'break-keep' 
    : locale.startsWith('zh') ? '' 
    : 'hyphens-auto';

  // Navigation items
  const navItems = [
    { label: t('Navigation.home'), href: '#hero' },
    { label: t('Navigation.portfolio'), href: `/${locale}/portfolio` },
    { label: t('Navigation.process'), href: '#how-we-do' },
    { label: t('Navigation.about'), href: '#why-we-work' },
  ];

  // Timeline items
  const timelineItems = [
    { id: '1', text: t('Timeline.item1') },
    { id: '2', text: t('Timeline.item2') },
    { id: '3', text: t('Timeline.item3') },
    { id: '4', text: t('Timeline.item4') },
    { id: '5', text: t('Timeline.item5') },
  ];

  // Accordion steps
  const accordionSteps = [
    {
      id: 'step-1',
      number: '01',
      title: t('HowWeDo.step1Title'),
      content: (
        <p className={`text-[#1a1a1a]/60 text-base md:text-lg ${breakClass}`}>
          {t('HowWeDo.step1Desc')}
        </p>
      ),
    },
    {
      id: 'step-2',
      number: '02',
      title: t('HowWeDo.step2Title'),
      content: (
        <DesignStepContent
          description={t('HowWeDo.step2Desc')}
          images={[
            {
              src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop&q=80',
              alt: 'Design 1',
            },
            {
              src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=600&fit=crop&q=80',
              alt: 'Design 2',
            },
            {
              src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop&q=80',
              alt: 'Design 3',
            },
          ]}
          freeEmphasis={t('HowWeDo.step2Free')}
        />
      ),
    },
    {
      id: 'step-3',
      number: '03',
      title: t('HowWeDo.step3Title'),
      content: (
        <p className={`text-[#1a1a1a]/60 text-base md:text-lg ${breakClass}`}>
          {t('HowWeDo.step3Desc')}
        </p>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-white">

      {/* Navigation */}
      <Navigation
        items={navItems}
        cta={{
          label: t('Navigation.contact'),
          href: `/${locale}/contact`,
        }}
      />

      {/* ==================== HERO SECTION ==================== */}
      <section id="hero" className="relative">
        {/* 모바일용 Spline */}
        <div className="md:hidden">
          <SplineEmbed
            url="https://my.spline.design/hoverscrolleffect-IzHoBaO7ENQvu6w2kOuUGAfj/"
            fallback={
              <div className="w-screen h-screen bg-gradient-to-b from-[#f2f8fc] to-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-[#1a1a1a] mb-6">
                    {t('Hero.title')}
                  </h1>
                  <p className={`text-xl text-[#1a1a1a]/60 ${breakClass}`}>
                    {t('Hero.subtitle')}
                  </p>
                </div>
              </div>
            }
          />
        </div>
        {/* PC용 Spline */}
        <div className="hidden md:block">
          <SplineEmbed
            url="https://my.spline.design/hoverscrolleffect-0t0T7vh0ZeR3YDGt5l8LNDFw/"
            fallback={
              <div className="w-screen h-screen bg-gradient-to-b from-[#f2f8fc] to-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-7xl font-bold text-[#1a1a1a] mb-6">
                    {t('Hero.title')}
                  </h1>
                  <p className={`text-xl text-[#1a1a1a]/60 ${breakClass}`}>
                    {t('Hero.subtitle')}
                  </p>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* ==================== PROBLEM SECTION ==================== */}
      <section id="problem" className="relative min-h-screen bg-black flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left - Dial Wheel */}
            <div className="flex justify-center">
              {/* 모바일: 화살표 없이 가운데 정렬 */}
              <div className="md:hidden">
                <DialWheel showIndicator={false} />
              </div>
              {/* PC: 화살표 포함 */}
              <div className="hidden md:block">
                <DialWheel showIndicator />
              </div>
            </div>

            {/* Right - Text */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t('Problem.title1')}
                <br />
                <span className="text-white/60">{t('Problem.title2')}</span>
                <br />
                <span className="text-white/40">{t('Problem.title3')}</span>
              </h2>
              <p className={`text-lg text-white/50 mt-8 ${breakClass}`}>
                <span className="md:hidden whitespace-pre-line">{t('Problem.subtitleMobile')}</span>
                <span className="hidden md:inline">{t('Problem.subtitle')}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== CHANGE SECTION ==================== */}
      <section id="change" className="relative overflow-hidden min-h-screen">
        {/* Gradient Horizon - 하단 배경으로 깔림 */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <GradientHorizon variant="waveGlow" height="500px" />
        </div>

        {/* 콘텐츠 - 상하 중앙 정렬 */}
        <div className="relative z-10 w-full min-h-screen flex flex-col justify-center py-20">
          <div className="max-w-5xl mx-auto px-6 w-full">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Left - Timeline */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <TimelineBlur items={timelineItems} />
              </motion.div>

              {/* Right - Text */}
              <motion.div
                className="text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Main Copy */}
                <div className="mb-10">
                  {/* Badge Label */}
                  <span className="inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium bg-[#f2f8fc] text-[#7fa8c9] border border-[#7fa8c9]/20">
                    {t('Change.badge')}
                  </span>
                  <p className={`text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1a1a1a] leading-snug ${breakClass}`}>
                    {t('Change.line1')}
                  </p>
                  <p className={`text-3xl md:text-4xl lg:text-5xl font-semibold text-[#7fa8c9] leading-snug ${breakClass}`}>
                    {t('Change.line2')}
                  </p>
                </div>

                {/* Remaining List */}
                <div className="mb-10 space-y-2">
                  <p className="text-lg md:text-xl text-[#1a1a1a]/70">{t('Change.list1')}</p>
                  <p className="text-lg md:text-xl text-[#1a1a1a]/70">{t('Change.list2')}</p>
                  <p className="text-lg md:text-xl text-[#1a1a1a]/70">{t('Change.list3')}</p>
                </div>

              </motion.div>
            </div>
          </div>

          {/* Closing - 전체 너비 기준 가운데 정렬 */}
          <motion.div
            className="mt-20 text-center w-full px-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#1a1a1a] font-bold md:whitespace-nowrap ${breakClass}`}>
              <span className="md:hidden whitespace-pre-line">{t('Change.closingMobile')}</span>
              <span className="hidden md:inline">{t('Change.closing')}</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* ==================== HOW WE DO SECTION ==================== */}
      <section id="how-we-do" className="relative py-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium bg-[#f2f8fc] text-[#7fa8c9] border border-[#7fa8c9]/20">
              {t('HowWeDo.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a]">
              {t('HowWeDo.title')}
            </h2>
          </motion.div>

          {/* Accordion Steps */}
          <AccordionStep items={accordionSteps} />
        </div>
      </section>

      {/* Divider */}
      <GlassDivider variant="line" className="my-8" />

      {/* ==================== PORTFOLIO SECTION ==================== */}
      <PortfolioMarquee locale={locale} />

      {/* ==================== WHY WE WORK SECTION ==================== */}
      <ScrollStory locale={locale} />

      {/* ==================== FOOTER (with CTA) ==================== */}
      <Footer locale={locale} />

    </div>
  );
}
