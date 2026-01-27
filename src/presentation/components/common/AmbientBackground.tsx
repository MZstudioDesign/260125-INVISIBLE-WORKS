'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AmbientBackgroundProps {
  variant?: 'default' | 'subtle' | 'intense' | 'lido' | 'aurora' | 'mesh';
  /** 마우스 인터랙션 활성화 (aurora, mesh에서 사용) */
  interactive?: boolean;
}

/**
 * AmbientBackground - Liquid Glass 스타일 배경 그라데이션 컴포넌트
 * 
 * @description Apple Liquid Glass 디자인에서 영감을 받은 ambient 배경
 * 
 * Variants:
 * - lido: 은은한 원형 orb (권장, 고정 배경)
 * - default: 기본 radial-gradient
 * - subtle: 더 연한 효과
 * - intense: 더 강한 효과
 * - aurora: 오로라 그라데이션 애니메이션
 * - mesh: 메시 그라데이션 (마우스 인터랙션)
 * 
 * @see LIQUID-GLASS.md, GRADIENT-ORB-BACKGROUND.md
 */
export function AmbientBackground({ 
  variant = 'default',
  interactive = false 
}: AmbientBackgroundProps) {
  
  // Aurora variant: 부드러운 오로라 애니메이션
  if (variant === 'aurora') {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-white">
        {/* Aurora gradient orbs with animation */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            background: 'linear-gradient(135deg, rgba(127, 168, 201, 0.3), rgba(242, 248, 252, 0.5))',
            filter: 'blur(60px)',
          }}
          animate={{
            x: ['-10%', '10%', '-10%'],
            y: ['-5%', '15%', '-5%'],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ top: '0%', right: '5%' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '350px',
            height: '350px',
            background: 'linear-gradient(225deg, rgba(127, 168, 201, 0.25), rgba(242, 248, 252, 0.4))',
            filter: 'blur(60px)',
          }}
          animate={{
            x: ['10%', '-10%', '10%'],
            y: ['5%', '-15%', '5%'],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ bottom: '5%', left: '0%' }}
        />
        <motion.div
          className="absolute rounded-full opacity-50"
          style={{
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(127, 168, 201, 0.2), transparent)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: ['-5%', '5%', '-5%'],
            y: ['10%', '-10%', '10%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ top: '40%', left: '30%' }}
        />
      </div>
    );
  }

  // Mesh variant: 메시 그라데이션 (마우스 추적)
  if (variant === 'mesh') {
    return <MeshGradientBackground interactive={interactive} />;
  }

  // Lido 스타일: 흰색 배경 + 은은한 원형 orb (고정 배경 - 스크롤 시 깊이감)
  if (variant === 'lido') {
    return (
      <motion.div 
        className="fixed inset-0 -z-10 pointer-events-none bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* Primary orb - 오른쪽 상단 (원형 유지, 연한 파랑) */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '300px',
            height: '300px',
            backgroundColor: 'rgba(127, 168, 201, 0.25)',
            filter: 'blur(50px)',
            top: '5%',
            right: '10%',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        />
        
        {/* Secondary orb - 왼쪽 하단 (원형 유지, 연한 아쿠아) */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '250px',
            height: '250px',
            backgroundColor: 'rgba(127, 168, 201, 0.2)',
            filter: 'blur(50px)',
            bottom: '10%',
            left: '5%',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        />
      </motion.div>
    );
  }

  // 다른 variant들은 radial-gradient 사용
  const gradientStyles = {
    default: {
      background: `
        radial-gradient(circle 300px at 85% 10%, rgba(127, 168, 201, 0.25) 0%, transparent 70%),
        radial-gradient(circle 250px at 10% 85%, rgba(127, 168, 201, 0.2) 0%, transparent 70%),
        #ffffff
      `,
    },
    subtle: {
      background: `
        radial-gradient(circle 250px at 80% 15%, rgba(127, 168, 201, 0.15) 0%, transparent 65%),
        radial-gradient(circle 200px at 15% 80%, rgba(127, 168, 201, 0.12) 0%, transparent 60%),
        #ffffff
      `,
    },
    intense: {
      background: `
        radial-gradient(circle 400px at 80% 10%, rgba(127, 168, 201, 0.35) 0%, transparent 65%),
        radial-gradient(circle 350px at 10% 85%, rgba(127, 168, 201, 0.3) 0%, transparent 60%),
        #ffffff
      `,
    },
  };

  const style = gradientStyles[variant as keyof typeof gradientStyles] || gradientStyles.default;

  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    />
  );
}

/**
 * MeshGradientBackground - 마우스 인터랙션 메시 그라데이션
 */
function MeshGradientBackground({ interactive }: { interactive: boolean }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, mouseX, mouseY]);

  const orb1X = useTransform(x, [0, 1], ['5%', '25%']);
  const orb1Y = useTransform(y, [0, 1], ['5%', '25%']);
  const orb2X = useTransform(x, [0, 1], ['75%', '55%']);
  const orb2Y = useTransform(y, [0, 1], ['75%', '55%']);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-white overflow-hidden">
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(127, 168, 201, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          right: orb1X,
          top: orb1Y,
        }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(127, 168, 201, 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
          left: orb2X,
          bottom: orb2Y,
        }}
      />
    </div>
  );
}

/**
 * ProgressiveBlur - 점진적 블러 효과 (Magic UI 스타일)
 * 
 * @description 콘텐츠 위/아래에 점진적으로 블러가 강해지는 효과
 */
interface ProgressiveBlurProps {
  className?: string;
  height?: string;
  position?: 'top' | 'bottom' | 'both';
}

export function ProgressiveBlur({
  className,
  height = '120px',
  position = 'bottom',
}: ProgressiveBlurProps) {
  const blurLevels = [0.5, 1, 2, 4, 8, 16];

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-10 ${
        position === 'top' ? 'top-0' : position === 'bottom' ? 'bottom-0' : 'inset-y-0'
      } ${className}`}
      style={{ height: position === 'both' ? '100%' : height }}
    >
      {blurLevels.map((blur, index) => {
        const startPercent = (index / blurLevels.length) * 100;
        const endPercent = ((index + 1) / blurLevels.length) * 100;
        
        const maskGradient = position === 'bottom'
          ? `linear-gradient(to bottom, transparent ${startPercent}%, black ${endPercent}%)`
          : position === 'top'
            ? `linear-gradient(to top, transparent ${startPercent}%, black ${endPercent}%)`
            : `linear-gradient(transparent 0%, black 50%, transparent 100%)`;

        return (
          <div
            key={blur}
            className="absolute inset-0"
            style={{
              zIndex: index + 1,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient,
            }}
          />
        );
      })}
    </div>
  );
}
