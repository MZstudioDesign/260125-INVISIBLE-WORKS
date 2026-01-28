'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
import { Navigation, GlassButton } from '@/presentation/components/ui';
import { ArrowLeft, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';

// ============================================
// Types
// ============================================

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link?: string;
}

// ============================================
// Portfolio Data
// ============================================

const categories = ['전체', '웹사이트', '랜딩페이지', '웹앱'];

const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modern E-Commerce',
    category: '웹사이트',
    description: '세련된 쇼핑 경험을 제공하는 이커머스 플랫폼',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80',
    tags: ['Next.js', 'Stripe', 'Tailwind'],
  },
  {
    id: '2',
    title: 'Creative Agency',
    category: '랜딩페이지',
    description: '크리에이티브 에이전시를 위한 임팩트 있는 랜딩페이지',
    imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&q=80',
    tags: ['Animation', 'Responsive'],
  },
  {
    id: '3',
    title: 'SaaS Dashboard',
    category: '웹앱',
    description: '데이터 시각화와 관리 기능을 갖춘 대시보드',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80',
    tags: ['React', 'Chart.js', 'Real-time'],
  },
  {
    id: '4',
    title: 'Restaurant Branding',
    category: '웹사이트',
    description: '로컬 레스토랑을 위한 브랜드 웹사이트',
    imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop&q=80',
    tags: ['Branding', 'Photography'],
  },
  {
    id: '5',
    title: 'Fitness Platform',
    category: '웹앱',
    description: '운동 트래킹과 커뮤니티 기능을 갖춘 피트니스 플랫폼',
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop&q=80',
    tags: ['Health', 'Community', 'Tracking'],
  },
  {
    id: '6',
    title: 'Tech Startup',
    category: '랜딩페이지',
    description: '테크 스타트업의 제품 소개 랜딩페이지',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80',
    tags: ['Product', 'Conversion'],
  },
  {
    id: '7',
    title: 'Portfolio Site',
    category: '웹사이트',
    description: '디자이너를 위한 미니멀한 포트폴리오 사이트',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop&q=80',
    tags: ['Minimal', 'Gallery'],
  },
  {
    id: '8',
    title: 'Education Platform',
    category: '웹앱',
    description: '온라인 학습을 위한 교육 플랫폼',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80',
    tags: ['LMS', 'Video', 'Progress'],
  },
  {
    id: '9',
    title: 'Real Estate',
    category: '웹사이트',
    description: '부동산 매물 검색 및 상담 웹사이트',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=80',
    tags: ['Search', 'Map', 'Listing'],
  },
  {
    id: '10',
    title: 'Fintech App',
    category: '웹앱',
    description: '금융 서비스를 위한 모던한 웹앱',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop&q=80',
    tags: ['Finance', 'Security', 'Dashboard'],
  },
  {
    id: '11',
    title: 'Event Landing',
    category: '랜딩페이지',
    description: '컨퍼런스 이벤트를 위한 랜딩페이지',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80',
    tags: ['Event', 'Registration'],
  },
  {
    id: '12',
    title: 'Medical Clinic',
    category: '웹사이트',
    description: '의료 클리닉을 위한 신뢰감 있는 웹사이트',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&q=80',
    tags: ['Healthcare', 'Booking'],
  },
];

// ============================================
// Portfolio Page Component
// ============================================

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems =
    selectedCategory === '전체'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio', isActive: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AmbientBackground variant="lido" />

      {/* Navigation */}
      <Navigation
        items={navItems}
        cta={{ label: '문의하기', href: '/#contact' }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/"
              className={cn(
                'inline-flex items-center gap-2 mb-8',
                'text-[#1a1a1a]/60 hover:text-[#1a1a1a]',
                'transition-colors duration-200'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              메인으로 돌아가기
            </Link>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] mb-6">
              Portfolio
            </h1>
            <p className="text-xl text-[#1a1a1a]/60 max-w-2xl leading-relaxed">
              복잡한 과정 없이 완성된 웹사이트들입니다.
              <br />
              여러분의 다음 웹사이트도 이렇게 만들어집니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter - 숨김 처리 (코드 유지) */}
      <section className="hidden px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-5 py-2.5 rounded-xl text-sm font-medium',
                  'transition-all duration-300',
                  selectedCategory === category
                    ? 'bg-[#7fa8c9] text-white shadow-[0_4px_16px_rgba(127,168,201,0.3)]'
                    : 'bg-white/80 text-[#1a1a1a]/70 border border-[#7fa8c9]/20 hover:border-[#7fa8c9]/40 hover:bg-white'
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl cursor-pointer',
                    'bg-white/85 backdrop-blur-xl',
                    'border-2 border-[#7fa8c9]/15',
                    'shadow-[0_8px_32px_rgba(127,168,201,0.08)]',
                    'hover:border-[#7fa8c9]/30',
                    'hover:shadow-[0_16px_48px_rgba(127,168,201,0.15)]',
                    'transition-all duration-500'
                  )}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium',
                          'bg-white/90 backdrop-blur-md text-[#1a1a1a]',
                          'border border-[#7fa8c9]/20'
                        )}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2 group-hover:text-[#7fa8c9] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#1a1a1a]/60 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-[#f2f8fc] text-[#7fa8c9] rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <motion.div
                className={cn(
                  'relative w-full max-w-4xl pointer-events-auto',
                  'bg-white/95 backdrop-blur-2xl',
                  'border-2 border-[#7fa8c9]/20',
                  'rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.2)]',
                  'overflow-hidden'
                )}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className={cn(
                    'absolute top-6 right-6 z-10',
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-white/90 hover:bg-white',
                    'text-[#1a1a1a]/60 hover:text-[#1a1a1a]',
                    'shadow-lg transition-colors duration-200'
                  )}
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Image */}
                <div className="relative aspect-video">
                  <Image
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={cn(
                          'inline-block px-3 py-1.5 mb-4 rounded-full text-xs font-medium',
                          'bg-[#f2f8fc] text-[#7fa8c9]'
                        )}
                      >
                        {selectedItem.category}
                      </span>
                      <h2 className="text-3xl font-bold text-[#1a1a1a] mb-3">
                        {selectedItem.title}
                      </h2>
                      <p className="text-lg text-[#1a1a1a]/60">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {selectedItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm bg-[#f2f8fc] text-[#7fa8c9] rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {selectedItem.link && (
                    <div className="mt-8">
                      <GlassButton variant="accent" className="gap-2">
                        사이트 방문하기
                        <ExternalLink className="w-4 h-4" />
                      </GlassButton>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
