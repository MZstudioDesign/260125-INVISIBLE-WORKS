'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface TimelineItem {
  id: string;
  text: string;
}

interface TimelineBlurProps {
  items: TimelineItem[];
  className?: string;
  /** 각 아이템 사이의 지연 시간 (ms) */
  staggerDelay?: number;
  /** 첫 번째 아이템이 시작되기까지의 지연 시간 (ms) */
  initialDelay?: number;
}

/**
 * TimelineBlur - 시간이 지나면 순차적으로 취소선이 생기는 타임라인
 * 
 * - 원과 선이 정확히 정렬됨
 * - 화면에 보이면 순차적으로 자동 취소선 + 텍스트 연해짐
 */
export function TimelineBlur({ 
  items, 
  className = '',
  staggerDelay = 600,
  initialDelay = 500,
}: TimelineBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });
  const [activeIndex, setActiveIndex] = useState(-1);

  // 화면에 보이면 순차적으로 취소선 적용
  useEffect(() => {
    if (!isInView) return;

    const startTimer = setTimeout(() => {
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        setActiveIndex(currentIndex);
        currentIndex++;
        
        if (currentIndex >= items.length) {
          clearInterval(interval);
        }
      }, staggerDelay);

      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(startTimer);
  }, [isInView, items.length, staggerDelay, initialDelay]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Timeline items */}
      <div className="relative">
        {items.map((item, index) => (
          <TimelineBlurItem
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
            isStruck={index <= activeIndex}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelineBlurItemProps {
  item: TimelineItem;
  isLast: boolean;
  isStruck: boolean;
}

function TimelineBlurItem({ item, isLast, isStruck }: TimelineBlurItemProps) {
  return (
    <motion.div className="relative flex items-start">
      {/* Timeline dot & line container */}
      <div className="relative flex-shrink-0 w-4 mr-4 flex flex-col items-center">
        {/* Dot - 텍스트 첫 줄 중심에 맞춤 */}
        <motion.div
          className="w-4 h-4 rounded-full border-2 border-[#7fa8c9] bg-white z-10 mt-[5px]"
          animate={{ 
            opacity: isStruck ? 0.3 : 1,
            borderColor: isStruck ? '#7fa8c9' : '#7fa8c9',
          }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Connecting line */}
        {!isLast && (
          <motion.div 
            className="w-[2px] bg-gradient-to-b from-[#7fa8c9]/40 to-[#7fa8c9]/10 flex-1 mt-0"
            style={{ minHeight: '40px' }}
            animate={{ opacity: isStruck ? 0.2 : 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </div>

      {/* Content - 자동 취소선 + 연해짐 */}
      <div className="flex-1 pb-6 select-none -mt-[2px]">
        <div className="relative inline-block">
          {/* 텍스트 */}
          <motion.p
            className="text-lg md:text-xl leading-relaxed"
            animate={{
              color: isStruck ? 'rgba(26, 26, 26, 0.25)' : 'rgba(26, 26, 26, 0.8)',
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {item.text}
          </motion.p>

          {/* 취소선 (키컬러) */}
          <motion.div
            className="absolute left-0 top-1/2 h-[2px] bg-[#7fa8c9] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: isStruck ? '100%' : '0%' }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ 
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ChangeSection - Complete Section 4 layout
 */
interface ChangeSectionProps {
  timelineItems: TimelineItem[];
  centerCopy: { line1: string; line2: string };
  remainingList: string[];
  closingText: string;
  className?: string;
}

export function ChangeSection({
  timelineItems,
  centerCopy,
  remainingList,
  closingText,
  className = '',
}: ChangeSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const centerOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const listOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const closingOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);

  return (
    <section ref={containerRef} className={`relative py-32 ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Timeline with blur effect */}
        <div className="mb-24">
          <TimelineBlur items={timelineItems} />
        </div>

        {/* Center copy */}
        <motion.div
          className="text-center mb-16"
          style={{ opacity: centerOpacity }}
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1a1a1a] leading-relaxed">
            {centerCopy.line1}
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#7fa8c9] leading-relaxed mt-2">
            {centerCopy.line2}
          </p>
        </motion.div>

        {/* Remaining list */}
        <motion.div
          className="text-center mb-16 space-y-3"
          style={{ opacity: listOpacity }}
        >
          {remainingList.map((item, index) => (
            <motion.p
              key={index}
              className="text-lg md:text-xl text-[#1a1a1a]/70"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {item}
            </motion.p>
          ))}
        </motion.div>

        {/* Closing text */}
        <motion.div
          className="text-center"
          style={{ opacity: closingOpacity }}
        >
          <p className="text-xl md:text-2xl text-[#1a1a1a] font-medium">
            {closingText}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * TimelineReveal - Timeline that reveals items on scroll
 */
interface TimelineRevealProps {
  items: TimelineItem[];
  className?: string;
}

export function TimelineReveal({ items, className = '' }: TimelineRevealProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative flex items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {/* Timeline dot & line */}
            <div className="relative flex-shrink-0 w-4 mr-4 flex flex-col items-center">
              <motion.div
                className="w-4 h-4 rounded-full border-2 border-[#7fa8c9] bg-white z-10 mt-[5px]"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
              />
              
              {index < items.length - 1 && (
                <div 
                  className="w-[2px] bg-gradient-to-b from-[#7fa8c9]/40 to-[#7fa8c9]/20 flex-1"
                  style={{ minHeight: '40px' }}
                />
              )}
            </div>

            <p className="text-lg text-[#1a1a1a]/70 leading-relaxed flex-1 pb-6 -mt-[2px]">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TimelineBlur;
