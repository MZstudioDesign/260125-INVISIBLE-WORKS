'use client';

import { useState } from 'react';
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
  StoryQuote,
  Footer,
  ContactModal,
  useContactModal,
} from '@/presentation/components/ui';
import { motion } from 'framer-motion';

// ============================================
// Data
// ============================================

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Process', href: '#how-we-do' },
  { label: 'About', href: '#why-we-work' },
];

const timelineItems = [
  { id: '1', text: '전체가 복잡하게 느껴진 진행' },
  { id: '2', text: '왜 필요한지 모르겠던 단계들' },
  { id: '3', text: '결정할 게 너무 많았던 과정' },
  { id: '4', text: '이해하기 어려웠던 질문들' },
  { id: '5', text: '계속 늘어만 났던 수정 사항' },
];

const accordionSteps = [
  {
    id: 'step-1',
    number: '01',
    title: '내용 전달',
    content: (
      <p className="text-[#1a1a1a]/60 text-base md:text-lg">
        웹사이트에 들어갈 자료를 전달합니다. 텍스트, 이미지, 로고 등 필요한 자료를
        정리해서 보내주시면 됩니다.
      </p>
    ),
  },
  {
    id: 'step-2',
    number: '02',
    title: '디자인 선택',
    content: (
      <DesignStepContent
        description="디자인 시안 3종 중 하나를 선택합니다."
        images={[
          {
            src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop&q=80',
            alt: '디자인 시안 1',
          },
          {
            src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=600&fit=crop&q=80',
            alt: '디자인 시안 2',
          },
          {
            src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop&q=80',
            alt: '디자인 시안 3',
          },
        ]}
        freeEmphasis="여기까지 무료"
        subText="디자인은, 보고 판단하셔도 늦지 않습니다."
      />
    ),
  },
  {
    id: 'step-3',
    number: '03',
    title: '웹사이트 완성',
    content: (
      <p className="text-[#1a1a1a]/60 text-base md:text-lg">
        선택한 디자인으로 웹사이트를 정교하게 완성합니다. 반응형, SEO, 성능 최적화까지
        모두 포함됩니다.
      </p>
    ),
  },
];

const storyLines = [
  { text: '웹사이트는 필요하다고들 말합니다.' },
  { text: '하지만 비용과 복잡함 앞에서', muted: true },
  { text: '시작조차 못 하는 경우를 우리는 너무 많이 봤습니다.', muted: true },
  { text: '' },
  { text: '그건 웹사이트가 어려워서가 아니라,' },
  { text: '어렵게 만들어온 관행이', muted: true },
  { text: '당연해졌기 때문이라고 생각했습니다.', muted: true },
  { text: '' },
  { text: '그래서 우리는' },
  { text: '더 복잡한 방식을 따르기보다,' },
  { text: '그동안 당연하게 여겨지던 과정을 하나씩 걷어내기로 했습니다.', highlight: '걷어내기로' },
  { text: '' },
  { text: '설명은 어렵지 않게,' },
  { text: '결정은 쉽게,' },
  { text: '부담 없이 한 번 시작해볼 수 있도록.' },
  { text: '' },
  { text: '보이지 않는 곳에서 구조를 바꾸는 일.' },
  { text: '고객의 첫 단계를 가볍게 만드는 선택.' },
  { text: '' },
  { text: '우리는 Invisible Works입니다.', highlight: 'Invisible Works' },
];

// ============================================
// Page Component
// ============================================

export default function Home() {
  const contactModal = useContactModal();

  return (
    <div className="relative min-h-screen bg-white">
      {/* Ambient Background */}
      <AmbientBackground variant="lido" />

      {/* Navigation */}
      <Navigation
        items={navItems}
        cta={{
          label: '문의하기',
          href: '#contact',
          onClick: contactModal.open,
        }}
      />

      {/* ==================== HERO SECTION ==================== */}
      <section id="hero" className="relative">
        <SplineEmbed
          url="https://my.spline.design/hoverscrolleffect-0t0T7vh0ZeR3YDGt5l8LNDFw/"
          fallback={
            <div className="w-screen h-screen bg-gradient-to-b from-[#f2f8fc] to-white flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-[#1a1a1a] mb-6">
                  Invisible Works
                </h1>
                <p className="text-xl text-[#1a1a1a]/60">
                  우리는 처음부터 다 보여주지 않습니다
                </p>
              </div>
            </div>
          }
        />
      </section>

      {/* ==================== PROBLEM SECTION ==================== */}
      <section id="problem" className="relative min-h-screen bg-black flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left - Dial Wheel */}
            <div className="flex justify-center">
              <DialWheel showIndicator />
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
                웹사이트는
                <br />
                <span className="text-white/60">신경 쓸 게</span>
                <br />
                <span className="text-white/40">끝이 없습니다</span>
              </h2>
              <p className="text-lg text-white/50 mt-8">
                비용이 크고, 과정이 복잡하며, 관리하기 어렵습니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== CHANGE SECTION ==================== */}
      <section id="change" className="relative bg-white overflow-hidden">
        {/* Gradient Horizon - 하단 배경으로 깔림 */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <GradientHorizon variant="cosmicRise" height="500px" />
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 pb-64">
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
                <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1a1a1a] leading-relaxed">
                  우리는 일을 줄였습니다.
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#7fa8c9] leading-relaxed mt-2">
                  대신 고민을 늘렸습니다.
                </p>
              </div>

              {/* Remaining List */}
              <div className="mb-10 space-y-2">
                <p className="text-lg md:text-xl text-[#1a1a1a]/70">꼭 필요한 판단만</p>
                <p className="text-lg md:text-xl text-[#1a1a1a]/70">설명이 필요한 지점만</p>
                <p className="text-lg md:text-xl text-[#1a1a1a]/70">결과로 이어지는 과정만</p>
              </div>

              {/* Closing */}
              <p className="text-xl md:text-2xl text-[#1a1a1a] font-medium">
                그래서, 웹사이트를 만드는 방식이 달라졌습니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== HOW WE DO SECTION ==================== */}
      <section id="how-we-do" className="relative bg-white py-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium bg-[#f2f8fc] text-[#7fa8c9] border border-[#7fa8c9]/20">
              Process
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a]">
              이렇게 진행됩니다
            </h2>
          </motion.div>

          {/* Accordion Steps */}
          <AccordionStep items={accordionSteps} />
        </div>
      </section>

      {/* ==================== PORTFOLIO SECTION ==================== */}
      <PortfolioMarquee />

      {/* ==================== WHY WE WORK SECTION ==================== */}
      <section id="why-we-work" className="relative bg-white py-32 md:py-48">
        <div className="max-w-4xl mx-auto px-6">
          <StoryQuote
            title="Why We Work Like This"
            lines={storyLines.filter((line) => line.text !== '')}
          />
        </div>
      </section>

      {/* ==================== FOOTER (with CTA) ==================== */}
      <Footer />

      {/* ==================== CONTACT MODAL ==================== */}
      <ContactModal isOpen={contactModal.isOpen} onClose={contactModal.close} />
    </div>
  );
}
