'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

interface DialWheelProps {
  items?: string[];
  speed?: number;
  className?: string;
  showIndicator?: boolean;
}

// 기본 아이템 - 웹사이트 제작 시 신경쓸 것들
const DEFAULT_ITEMS = [
  '도메인',
  '호스팅',
  'SSL인증',
  '보안',
  '속도',
  '구조',
  '레이아웃',
  '디자인',
  '콘텐츠',
  '반응형',
  '접근성',
  'SEO',
  '퍼포먼스',
  '브라우저호환',
  '모바일최적화',
  '유지보수',
  '업데이트',
  '백업',
  '배포',
  '관리',
];

/**
 * DialWheel - 3D 원통형 회전 텍스트
 * 
 * 하스스톤 매칭 스타일의 빠른 룰렛 효과
 * - 5개 표시 (위 2개 + 가운데 + 아래 2개)
 * - 선명한 투명도
 * - 최소 블러
 * - 부드러운 스크롤 애니메이션
 * 
 * "웹사이트는 신경쓸 게 많다, 끝이 안보인다" 느낌 표현
 */
export function DialWheel({
  items = DEFAULT_ITEMS,
  speed = 750,
  className = '',
  showIndicator = true,
}: DialWheelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: '-10%' });

  // 무한 루프 - 빠르게 회전
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, speed);

    return () => clearInterval(interval);
  }, [items.length, speed, isInView]);

  // 보여줄 아이템들 (위 2개 + 현재 + 아래 2개 = 5개)
  const getVisibleItems = () => {
    const result = [];
    for (let offset = -2; offset <= 2; offset++) {
      let index = currentIndex + offset;
      // 무한 루프를 위한 인덱스 순환
      if (index < 0) index = items.length + (index % items.length);
      if (index >= items.length) index = index % items.length;
      result.push({ itemIndex: index, offset, text: items[index] });
    }
    return result;
  };

  const visibleItems = getVisibleItems();
  const itemHeight = 48;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-8">
        {/* 화살표 인디케이터 */}
        {showIndicator && (
          <motion.div
            className="text-white text-2xl font-light"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.div>
        )}
        
        {/* 3D 원통형 휠 */}
        <div 
          className="relative h-[280px] w-[220px] overflow-hidden"
          style={{ 
            perspective: '600px',
            perspectiveOrigin: 'center center',
          }}
        >
          {/* 아이템 컨테이너 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleItems.map(({ itemIndex, offset, text }) => {
                const isActive = offset === 0;
                
                // 3D 회전 각도 계산
                const rotateX = offset * -18;
                // Y 위치
                const translateY = offset * itemHeight;
                // Z 깊이 (가운데가 가장 앞)
                const translateZ = -Math.abs(offset) * 15;
                
                // 투명도 (5개용)
                // offset 0: 1.0 (가운데)
                // offset ±1: 0.7
                // offset ±2: 0.45
                const opacity = isActive ? 1 : Math.max(0.4, 0.9 - Math.abs(offset) * 0.22);
                
                // 블러 (최소화)
                // offset ±1: 0.5px, ±2: 1px
                const blur = isActive ? 0 : Math.abs(offset) * 0.5;
                
                // 스케일
                const scale = isActive ? 1.05 : 0.9 - Math.abs(offset) * 0.05;

                return (
                  <motion.div
                    key={`item-${itemIndex}`}
                    className="absolute flex items-center justify-center w-full"
                    // 새 아이템: 아래에서 올라옴
                    initial={{ 
                      y: 3 * itemHeight,
                      rotateX: -54,
                      z: -45,
                      scale: 0.75,
                      opacity: 0,
                    }}
                    // 현재 위치로 이동
                    animate={{ 
                      y: translateY,
                      rotateX,
                      z: translateZ,
                      scale,
                      opacity,
                    }}
                    // 나가는 아이템: 위로 사라짐
                    exit={{ 
                      y: -3 * itemHeight,
                      rotateX: 54,
                      z: -45,
                      scale: 0.75,
                      opacity: 0,
                    }}
                    transition={{
                      type: 'tween',
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1], // ease-out-quart
                    }}
                    style={{
                      height: `${itemHeight}px`,
                      transformStyle: 'preserve-3d',
                      filter: `blur(${blur}px)`,
                    }}
                  >
                    <span
                      className={`text-2xl md:text-3xl whitespace-nowrap ${
                        isActive
                          ? 'text-white font-medium'
                          : 'text-white/70 font-light'
                      }`}
                    >
                      {text}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* 중앙 하이라이트 바 */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[48px] pointer-events-none z-10">
            <div className="absolute inset-0 border-y border-white/20" />
          </div>

          {/* 상단 페이드 그라데이션 - 미니멀 */}
          <div 
            className="absolute inset-x-0 top-0 h-12 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            }}
          />
          
          {/* 하단 페이드 그라데이션 - 미니멀 */}
          <div 
            className="absolute inset-x-0 bottom-0 h-12 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(to top, black 0%, transparent 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * DialWheelSection - 래퍼 컴포넌트
 */
interface DialWheelSectionProps {
  items?: string[];
  title?: string;
  subtitle?: string;
}

export function DialWheelSection({
  items = DEFAULT_ITEMS,
  title = '웹사이트는',
  subtitle,
}: DialWheelSectionProps) {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <DialWheel items={items} />
          </div>
          <div className="text-right">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">{title}</h2>
            {subtitle && (
              <p className="text-xl text-white/60">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DialWheel;
