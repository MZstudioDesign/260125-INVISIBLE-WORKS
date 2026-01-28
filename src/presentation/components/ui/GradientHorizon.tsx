'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface GradientHorizonProps {
  className?: string;
  height?: string;
  variant?: 'ellipseGlow' | 'orbFloat' | 'radialBurst' | 'dualOrb' | 'softHorizon' | 'waveGlow' | 'cosmicRise';
}

/**
 * GradientHorizon - 도형 기반 섹션 전환 효과
 * 
 * 해가 뜨는 느낌의 블러된 도형들로 지평선 표현
 * 
 * Variants:
 * - ellipseGlow: 지평선에 블러된 긴 타원 (기본)
 * - orbFloat: 떠오르는 오브/구체
 * - radialBurst: 방사형 빛 효과
 * - dualOrb: 두 개의 오브 조합
 * - softHorizon: 부드러운 수평 그라데이션
 * - waveGlow: 물결치는 글로우
 * - cosmicRise: 우주적 일출
 */
export function GradientHorizon({
  className = '',
  height = '400px',
  variant = 'ellipseGlow',
}: GradientHorizonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const renderVariant = () => {
    switch (variant) {
      case 'ellipseGlow':
        return <EllipseGlowHorizon />;
      case 'orbFloat':
        return <OrbFloatHorizon />;
      case 'radialBurst':
        return <RadialBurstHorizon />;
      case 'dualOrb':
        return <DualOrbHorizon />;
      case 'softHorizon':
        return <SoftHorizon />;
      case 'waveGlow':
        return <WaveGlowHorizon />;
      case 'cosmicRise':
        return <CosmicRiseHorizon />;
      default:
        return <EllipseGlowHorizon />;
    }
  };

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden bg-white ${className}`}
      style={{ height }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ opacity, scale }}
      >
        {renderVariant()}
      </motion.div>
    </div>
  );
}

/**
 * Variant 1: Ellipse Glow (긴 타원 글로우)
 * 지평선에 가로로 긴 블러 타원
 */
function EllipseGlowHorizon() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f5faff]">
      {/* Wide ellipse glow */}
      <div
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2"
        style={{
          width: '200%',
          height: '200px',
          background: 'radial-gradient(ellipse 50% 100% at 50% 100%, rgba(59, 130, 246, 0.35) 0%, rgba(96, 165, 250, 0.15) 50%, transparent 80%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Secondary glow layer */}
      <div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2"
        style={{
          width: '120%',
          height: '150px',
          background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(147, 197, 253, 0.4) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Subtle top ambient */}
      <div
        className="absolute top-0 left-0 right-0 h-[40%]"
        style={{
          background: 'linear-gradient(to bottom, white, transparent)',
        }}
      />
    </div>
  );
}

/**
 * Variant 2: Orb Float (떠오르는 오브)
 * 부드럽게 떠오르는 구체 형태
 */
function OrbFloatHorizon() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f0f7ff]">
      {/* Main floating orb */}
      <motion.div
        className="absolute bottom-[25%] left-1/2 -translate-x-1/2"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle at 30% 30%, rgba(147, 197, 253, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ground reflection */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        style={{
          width: '400px',
          height: '200px',
          background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(96, 165, 250, 0.2) 0%, transparent 60%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
}

/**
 * Variant 3: Radial Burst (방사형 빛)
 * 지평선에서 퍼져나가는 빛줄기
 */
function RadialBurstHorizon() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f8fbff]">
      {/* Radial burst from bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        style={{
          width: '200%',
          aspectRatio: '2/1',
          background: `
            conic-gradient(
              from 180deg at 50% 100%,
              transparent 0deg,
              transparent 160deg,
              rgba(147, 197, 253, 0.15) 170deg,
              rgba(147, 197, 253, 0.25) 180deg,
              rgba(147, 197, 253, 0.15) 190deg,
              transparent 200deg,
              transparent 360deg
            )
          `,
          filter: 'blur(20px)',
        }}
      />

      {/* Central glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '60%',
          height: '150px',
          background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Light rays */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{
            width: '2px',
            height: '60%',
            background: 'linear-gradient(to top, rgba(147, 197, 253, 0.3), transparent)',
            transform: `translateX(-50%) rotate(${(i - 2) * 15}deg)`,
            filter: 'blur(8px)',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Variant 4: Dual Orb (이중 오브)
 * 두 개의 오브가 겹치는 효과
 */
function DualOrbHorizon() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f5f9ff]">
      {/* Left orb */}
      <motion.div
        className="absolute bottom-[20%] left-[30%]"
        style={{
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle at 40% 40%, rgba(96, 165, 250, 0.5) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Right orb */}
      <motion.div
        className="absolute bottom-[15%] right-[25%]"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle at 60% 40%, rgba(147, 197, 253, 0.4) 0%, rgba(96, 165, 250, 0.15) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -15, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Connecting glow */}
      <div
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2"
        style={{
          width: '80%',
          height: '100px',
          background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(59, 130, 246, 0.2) 0%, transparent 60%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
}

/**
 * Variant 5: Soft Horizon (부드러운 수평선)
 * 미니멀하고 부드러운 수평 그라데이션
 */
function SoftHorizon() {
  return (
    <div className="absolute inset-0 bg-white">
      {/* Soft horizontal gradient band */}
      <div
        className="absolute bottom-[25%] left-0 right-0"
        style={{
          height: '150px',
          background: 'linear-gradient(to bottom, transparent, rgba(147, 197, 253, 0.15) 30%, rgba(147, 197, 253, 0.25) 50%, rgba(147, 197, 253, 0.15) 70%, transparent)',
          filter: 'blur(30px)',
        }}
      />

      {/* Subtle bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '40%',
          background: 'linear-gradient(to top, rgba(240, 247, 255, 1), transparent)',
        }}
      />

      {/* Center accent */}
      <div
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2"
        style={{
          width: '50%',
          height: '80px',
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(96, 165, 250, 0.2) 0%, transparent 70%)',
          filter: 'blur(25px)',
        }}
      />
    </div>
  );
}

/**
 * Variant 6: Wave Glow (물결 글로우)
 * 물결치는 듯한 레이어드 글로우
 */
function WaveGlowHorizon() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f5faff]">
      {/* Wave layer 1 */}
      <motion.div
        className="absolute bottom-[10%] left-0 right-0"
        style={{
          height: '140px',
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(147, 197, 253, 0.2) 0%, transparent 60%)',
          filter: 'blur(25px)',
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Wave layer 2 */}
      <motion.div
        className="absolute bottom-[0%] left-0 right-0"
        style={{
          height: '168px',
          background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(96, 165, 250, 0.25) 0%, transparent 60%)',
          filter: 'blur(30px)',
        }}
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Wave layer 3 */}
      <motion.div
        className="absolute -bottom-[10%] left-0 right-0"
        style={{
          height: '196px',
          background: 'radial-gradient(ellipse 90% 100% at 50% 100%, rgba(59, 130, 246, 0.2) 0%, transparent 60%)',
          filter: 'blur(35px)',
        }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
    </div>
  );
}

/**
 * Variant 7: Cosmic Rise (우주적 일출)
 * 직접 제작 - 우주에서 해가 뜨는 느낌
 */
function CosmicRiseHorizon() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#fafcff] via-[#f0f7ff] to-[#e8f4ff]">
      {/* Large rising ellipse - main sun */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[60%]"
        style={{
          width: '180%',
          aspectRatio: '2.5/1',
          background: `
            radial-gradient(ellipse 100% 100% at 50% 0%, 
              rgba(96, 165, 250, 0.5) 0%, 
              rgba(59, 130, 246, 0.3) 30%,
              rgba(147, 197, 253, 0.15) 60%,
              transparent 80%
            )
          `,
          filter: 'blur(50px)',
        }}
        animate={{
          translateY: ['60%', '55%', '60%'],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Corona glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '100%',
          height: '50%',
          background: `
            radial-gradient(ellipse 80% 80% at 50% 100%, 
              rgba(255, 255, 255, 0.8) 0%,
              rgba(147, 197, 253, 0.3) 30%,
              transparent 60%
            )
          `,
          filter: 'blur(30px)',
        }}
      />

      {/* Atmosphere glow rings */}
      <div
        className="absolute bottom-[5%] left-1/2 -translate-x-1/2"
        style={{
          width: '120%',
          height: '80px',
          background: 'linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.2) 20%, rgba(147, 197, 253, 0.3) 50%, rgba(147, 197, 253, 0.2) 80%, transparent)',
          filter: 'blur(15px)',
        }}
      />

      {/* Small accent particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: '8px',
            height: '8px',
            background: 'rgba(147, 197, 253, 0.4)',
            borderRadius: '50%',
            left: `${20 + i * 12}%`,
            bottom: `${15 + (i % 3) * 10}%`,
            filter: 'blur(4px)',
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

/**
 * SectionTransition - Simple gradient transition
 */
interface SectionTransitionProps {
  from?: 'white' | 'blue' | 'dark' | 'transparent';
  to?: 'white' | 'blue' | 'dark' | 'transparent';
  className?: string;
  height?: string;
}

export function SectionTransition({
  from = 'white',
  to = 'blue',
  className = '',
  height = '120px',
}: SectionTransitionProps) {
  const colors = {
    white: '#FFFFFF',
    blue: '#f2f8fc',
    dark: '#0a1628',
    transparent: 'transparent',
  };

  return (
    <div
      className={`w-full ${className}`}
      style={{
        height,
        background: `linear-gradient(to bottom, ${colors[from]}, ${colors[to]})`,
      }}
    />
  );
}

/**
 * DarkHorizon - For dark section transitions (kept for backward compatibility)
 */
interface DarkHorizonProps {
  className?: string;
  fromColor?: string;
  toColor?: string;
}

export function DarkHorizon({
  className = '',
  fromColor = 'white',
  toColor = 'white',
}: DarkHorizonProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: '500px' }}>
      <div
        className="absolute inset-x-0 top-0 h-[25%] z-10"
        style={{
          background: `linear-gradient(to bottom, ${fromColor} 0%, transparent 100%)`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a1628] to-[#0d2847]" />

      <div
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2"
        style={{
          width: '200%',
          height: '300px',
          background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        }}
      />

      <div
        className="absolute bottom-[18%] left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.5) 30%, rgba(147, 197, 253, 0.7) 50%, rgba(147, 197, 253, 0.5) 70%, transparent)',
          boxShadow: '0 0 30px rgba(96, 165, 250, 0.5)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-[25%] z-10"
        style={{
          background: `linear-gradient(to top, ${toColor} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

export default GradientHorizon;
