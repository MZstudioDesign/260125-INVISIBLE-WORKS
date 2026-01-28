'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

export interface Slide {
  id: string;
  content: string[];
  isEnding?: boolean;
}

interface ScrollStoryProps {
  slides?: Slide[];
  className?: string;
  locale?: string;
}

/**
 * ScrollStory - 스크롤 고정 PPT 스타일 컴포넌트
 *
 * Features:
 * - 스크롤 시 섹션이 고정되고 텍스트가 순차적으로 전환
 * - 페이드 인/아웃 애니메이션
 * - 마지막 슬라이드는 가운데 정렬 + 큰 텍스트
 */
export function ScrollStory({
  slides: customSlides,
  className = '',
  locale = 'ko',
}: ScrollStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Why');

  // 번역된 기본 슬라이드
  const defaultSlides: Slide[] = [
    {
      id: 'slide-1',
      content: [
        t('slide1Line1'),
        t('slide1Line2'),
        t('slide1Line3'),
      ],
    },
    {
      id: 'slide-2',
      content: [
        t('slide2Line1'),
        t('slide2Line2'),
        t('slide2Line3'),
      ],
    },
    {
      id: 'slide-3',
      content: [
        t('slide3Line1'),
        t('slide3Line2'),
        t('slide3Line3'),
      ],
    },
    {
      id: 'slide-4',
      content: [
        t('slide4Line1'),
        t('slide4Line2'),
        t('slide4Line3'),
      ],
    },
    {
      id: 'slide-5',
      content: [t('slide5')],
      isEnding: true,
    },
  ];

  const slides = customSlides || defaultSlides;
  const slideCount = slides.length;

  // 언어별 줄바꿈 클래스
  const breakClass = locale === 'ko' ? 'break-keep' 
    : locale.startsWith('zh') ? '' 
    : 'hyphens-auto';

  // 스크롤 진행률 추적 (컨테이너 기준)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${slideCount * 100}vh` }}
      id="why-we-work"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a]" />

        {/* Subtle ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(127,168,201,0.15) 0%, transparent 70%)',
          }}
        />


        {/* Slides */}
        <div className="relative h-full flex items-center justify-center">
          {slides.map((slide, index) => (
            <SlideItem
              key={slide.id}
              slide={slide}
              index={index}
              totalSlides={slideCount}
              scrollProgress={scrollYProgress}
              breakClass={breakClass}
              locale={locale}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((slide, index) => (
            <ProgressDot
              key={slide.id}
              index={index}
              totalSlides={slideCount}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface SlideItemProps {
  slide: Slide;
  index: number;
  totalSlides: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  breakClass: string;
  locale: string;
}

function SlideItem({
  slide,
  index,
  totalSlides,
  scrollProgress,
  breakClass,
  locale,
}: SlideItemProps) {
  // 각 슬라이드의 시작/끝 지점 계산
  const slideStart = index / totalSlides;
  const slideEnd = (index + 1) / totalSlides;
  const slideMid = (slideStart + slideEnd) / 2;

  // 페이드 인/아웃 애니메이션
  const opacity = useTransform(
    scrollProgress,
    [
      slideStart,
      slideStart + 0.05,
      slideMid,
      slideEnd - 0.05,
      slideEnd,
    ],
    [0, 1, 1, 1, 0]
  );

  // 약간의 Y 이동
  const y = useTransform(
    scrollProgress,
    [slideStart, slideStart + 0.05, slideEnd - 0.05, slideEnd],
    [30, 0, 0, -30]
  );

  // 스케일 효과 (마지막 슬라이드)
  const scale = useTransform(
    scrollProgress,
    [slideStart, slideStart + 0.05, slideMid],
    slide.isEnding ? [0.9, 1, 1] : [1, 1, 1]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6"
      style={{ opacity, y, scale }}
    >
      <div
        className={`max-w-3xl w-full ${
          slide.isEnding ? 'text-left md:text-center' : 'text-left md:text-center'
        }`}
      >
        {slide.content.map((line, lineIndex) => (
          <p
            key={lineIndex}
            className={`
              leading-relaxed ${breakClass}
              ${
                slide.isEnding
                  ? 'text-4xl md:text-5xl lg:text-6xl font-bold text-white md:whitespace-nowrap'
                  : lineIndex === 0
                  ? 'text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4'
                  : 'text-xl md:text-3xl lg:text-4xl text-white/60 font-medium mb-2 md:mb-3'
              }
            `}
          >
            {slide.isEnding && locale === 'ko' ? (
              <>
                <span className="md:hidden">우리는<br />Invisible Works입니다.</span>
                <span className="hidden md:inline">{line}</span>
              </>
            ) : slide.isEnding && locale === 'en' ? (
              <>
                <span className="md:hidden">We are<br />Invisible Works.</span>
                <span className="hidden md:inline">{line}</span>
              </>
            ) : slide.isEnding && locale.startsWith('zh') ? (
              <>
                <span className="md:hidden">我们是<br />Invisible Works。</span>
                <span className="hidden md:inline">{line}</span>
              </>
            ) : (
              line
            )}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

interface ProgressDotProps {
  index: number;
  totalSlides: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

function ProgressDot({ index, totalSlides, scrollProgress }: ProgressDotProps) {
  const slideStart = index / totalSlides;
  const slideEnd = (index + 1) / totalSlides;

  // 현재 슬라이드일 때 활성화
  const opacity = useTransform(
    scrollProgress,
    [slideStart - 0.01, slideStart, slideEnd - 0.01, slideEnd],
    [0.3, 1, 1, 0.3]
  );

  const scale = useTransform(
    scrollProgress,
    [slideStart - 0.01, slideStart, slideEnd - 0.01, slideEnd],
    [1, 1.5, 1.5, 1]
  );

  return (
    <motion.div
      className="w-2 h-2 rounded-full bg-[#7fa8c9]"
      style={{ opacity, scale }}
    />
  );
}

/**
 * ScrollStorySection - 섹션 래퍼 (기존 호환용)
 */
export function ScrollStorySection({
  slides,
  className = '',
  locale = 'ko',
}: ScrollStoryProps) {
  return (
    <ScrollStory slides={slides} className={className} locale={locale} />
  );
}

export default ScrollStory;
