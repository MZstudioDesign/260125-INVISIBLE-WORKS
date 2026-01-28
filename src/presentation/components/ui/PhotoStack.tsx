'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

interface PhotoStackProps {
  photos?: PhotoItem[];
  className?: string;
}

// 기본 샘플 이미지
const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=500&fit=crop',
    alt: 'Team meeting',
    caption: 'Team Collaboration',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=500&fit=crop',
    alt: 'Office space',
    caption: 'Our Space',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=400&h=500&fit=crop',
    alt: 'Working on laptop',
    caption: 'Deep Work',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop',
    alt: 'Brainstorming',
    caption: 'Ideas',
  },
];

// 각 카드의 기본 위치와 회전값
const cardPositions = [
  { x: -60, y: 10, rotate: -12, zIndex: 1 },
  { x: -20, y: -5, rotate: -4, zIndex: 2 },
  { x: 30, y: 8, rotate: 6, zIndex: 3 },
  { x: 80, y: -2, rotate: 14, zIndex: 4 },
];

/**
 * PhotoStack - 폴라로이드 스타일 사진 스택
 * 
 * - 4개의 카드가 겹쳐서 배치
 * - 각 카드는 약간씩 기울어져 있음
 * - 호버 시 해당 카드가 위로 올라오며 z-index 상승
 * - 폴라로이드 느낌의 흰 테두리
 */
export function PhotoStack({
  photos = DEFAULT_PHOTOS,
  className = '',
}: PhotoStackProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={`relative w-full h-[350px] ${className}`}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {photos.slice(0, 4).map((photo, index) => {
          const pos = cardPositions[index];
          const isHovered = hoveredId === photo.id;

          return (
            <motion.div
              key={photo.id}
              className="absolute cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{
                x: pos.x - 80,
                y: pos.y - 100,
                rotate: pos.rotate,
                zIndex: pos.zIndex,
              }}
              animate={{
                x: pos.x - 80,
                y: isHovered ? pos.y - 130 : pos.y - 100,
                rotate: isHovered ? 0 : pos.rotate,
                zIndex: isHovered ? 10 : pos.zIndex,
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              onMouseEnter={() => setHoveredId(photo.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* 폴라로이드 카드 */}
              <div
                className="relative bg-white p-2 pb-10 shadow-xl"
                style={{
                  width: '160px',
                  boxShadow: isHovered
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
                    : '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* 이미지 영역 */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                {/* 캡션 영역 */}
                {photo.caption && (
                  <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 font-light">
                    {photo.caption}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * PhotoStackSection - 섹션 래퍼
 */
interface PhotoStackSectionProps {
  photos?: PhotoItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  bgColor?: 'white' | 'black' | 'gray';
}

export function PhotoStackSection({
  photos,
  title,
  subtitle,
  className = '',
  bgColor = 'black',
}: PhotoStackSectionProps) {
  const bgClasses = {
    white: 'bg-white',
    black: 'bg-black',
    gray: 'bg-[#1a1a1a]',
  };

  const textClasses = {
    white: 'text-[#1a1a1a]',
    black: 'text-white',
    gray: 'text-white',
  };

  return (
    <section className={`py-24 ${bgClasses[bgColor]} ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        {/* 좌우 레이아웃 */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left - Photo Stack */}
          <PhotoStack photos={photos} />

          {/* Right - Text */}
          {(title || subtitle) && (
            <div className={`text-center md:text-left ${textClasses[bgColor]}`}>
              {title && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={`text-lg ${bgColor === 'white' ? 'text-[#1a1a1a]/60' : 'text-white/60'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export type { PhotoItem };
export default PhotoStack;
