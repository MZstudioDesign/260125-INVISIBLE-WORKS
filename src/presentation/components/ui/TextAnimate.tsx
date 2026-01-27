'use client';

import { ElementType, memo, useRef } from 'react';
import { AnimatePresence, motion, MotionProps, useInView, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

type AnimationType = 'text' | 'word' | 'character' | 'line';
type AnimationVariant =
  | 'fadeIn'
  | 'blurIn'
  | 'blurInUp'
  | 'blurInDown'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'scaleDown';

interface TextAnimateProps extends MotionProps {
  /** 애니메이션할 텍스트 콘텐츠 */
  children: string;
  /** 컴포넌트에 적용할 클래스 */
  className?: string;
  /** 각 세그먼트에 적용할 클래스 */
  segmentClassName?: string;
  /** 애니메이션 시작 전 딜레이 (초) */
  delay?: number;
  /** 애니메이션 지속 시간 (초) */
  duration?: number;
  /** 커스텀 motion variants */
  variants?: Variants;
  /** 렌더링할 요소 타입 */
  as?: ElementType;
  /** 텍스트 분할 방식 */
  by?: AnimationType;
  /** 뷰포트 진입 시 애니메이션 시작 여부 */
  startOnView?: boolean;
  /** 한 번만 애니메이션 실행 */
  once?: boolean;
  /** 애니메이션 프리셋 */
  animation?: AnimationVariant;
}

const staggerTimings: Record<AnimationType, number> = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const defaultItemAnimationVariants: Record<
  AnimationVariant,
  { container: Variants; item: Variants }
> = {
  fadeIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
    },
  },
  blurIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3 } },
      exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } },
    },
  },
  blurInUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
      show: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
      exit: {
        opacity: 0,
        filter: 'blur(10px)',
        y: 20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  blurInDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)', y: -20 },
      show: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
      exit: {
        opacity: 0,
        filter: 'blur(10px)',
        y: -20,
      },
    },
  },
  slideUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: 20, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
      exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  slideDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: -20, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
      exit: { y: 20, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  slideLeft: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 20, opacity: 0 },
      show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
      exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  slideRight: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: -20, opacity: 0 },
      show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
      exit: { x: 20, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  scaleUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 0.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: { type: 'spring', damping: 15, stiffness: 300 },
        },
      },
      exit: { scale: 0.5, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  scaleDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 1.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: { type: 'spring', damping: 15, stiffness: 300 },
        },
      },
      exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } },
    },
  },
};

/**
 * TextAnimate - Magic UI 스타일 텍스트 애니메이션 컴포넌트
 * 
 * @description 다양한 애니메이션 효과와 세그먼트 분할을 지원하는 텍스트 애니메이션
 * @see https://magicui.design/docs/components/text-animate
 */
const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 0.3,
  variants,
  className,
  segmentClassName,
  as: Component = 'p',
  startOnView = true,
  once = true,
  by = 'word',
  animation = 'fadeIn',
  ...props
}: TextAnimateProps) => {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once, margin: '-50px' });

  const MotionComponent = motion.create(Component);

  let segments: string[] = [];
  switch (by) {
    case 'word':
      segments = children.split(/(\s+)/);
      break;
    case 'character':
      segments = children.split('');
      break;
    case 'line':
      segments = children.split('\n');
      break;
    case 'text':
    default:
      segments = [children];
      break;
  }

  const animationVariants = variants
    ? { container: defaultContainerVariants, item: variants }
    : defaultItemAnimationVariants[animation];

  const finalVariants = {
    container: {
      ...animationVariants.container,
      show: {
        ...animationVariants.container.show,
        transition: {
          delayChildren: delay,
          staggerChildren: duration / segments.length,
        },
      },
      exit: {
        ...animationVariants.container.exit,
        transition: {
          staggerChildren: duration / segments.length,
          staggerDirection: -1,
        },
      },
    },
    item: animationVariants.item,
  };

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        ref={ref}
        variants={finalVariants.container as Variants}
        initial="hidden"
        whileInView={startOnView ? 'show' : undefined}
        animate={startOnView ? undefined : 'show'}
        exit="exit"
        className={cn('whitespace-pre-wrap', className)}
        viewport={{ once }}
        {...props}
      >
        {segments.map((segment, i) => (
          <motion.span
            key={`${by}-${segment}-${i}`}
            variants={finalVariants.item}
            custom={i * staggerTimings[by]}
            className={cn(
              by === 'line' ? 'block' : 'inline-block whitespace-pre',
              segmentClassName
            )}
          >
            {segment}
          </motion.span>
        ))}
      </MotionComponent>
    </AnimatePresence>
  );
};

export const TextAnimate = memo(TextAnimateBase);
TextAnimate.displayName = 'TextAnimate';

/**
 * AnimatedShinyText - 반짝이는 텍스트 효과
 */
interface AnimatedShinyTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 100,
}: AnimatedShinyTextProps) {
  return (
    <span
      style={{ '--shiny-width': `${shimmerWidth}px` } as React.CSSProperties}
      className={cn(
        'text-neutral-600/70 dark:text-neutral-400/70',
        'animate-shiny-text bg-clip-text bg-no-repeat',
        'bg-gradient-to-r from-transparent via-[#7fa8c9]/80 via-50% to-transparent',
        '[background-size:var(--shiny-width)_100%] [background-position:0_0]',
        '[transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',
        className
      )}
    >
      {children}
    </span>
  );
}
