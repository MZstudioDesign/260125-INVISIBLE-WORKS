'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
import { Navigation, GlassButton } from '@/presentation/components/ui';
import { ArrowLeft, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

// Types & Data (same as before)
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link?: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: '1', title: 'Modern E-Commerce', category: 'Website',
    description: 'Elegant shopping experience', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80',
    tags: ['Next.js', 'Stripe', 'Tailwind'],
  },
  {
    id: '2', title: 'Creative Agency', category: 'Landing',
    description: 'Impactful landing page', imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&q=80',
    tags: ['Animation', 'Responsive'],
  },
  {
    id: '3', title: 'SaaS Dashboard', category: 'WebApp',
    description: 'Data visualization dashboard', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80',
    tags: ['React', 'Chart.js', 'Real-time'],
  },
  {
    id: '4', title: 'Restaurant Branding', category: 'Website',
    description: 'Local restaurant brand site', imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop&q=80',
    tags: ['Branding', 'Photography'],
  },
  {
    id: '5', title: 'Fitness Platform', category: 'WebApp',
    description: 'Fitness tracking platform', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop&q=80',
    tags: ['Health', 'Community'],
  },
  {
    id: '6', title: 'Tech Startup', category: 'Landing',
    description: 'Product landing page', imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80',
    tags: ['Product', 'Conversion'],
  },
];

export default function PortfolioPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('PortfolioPage');
  const tNav = useTranslations('Navigation');
  
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const navItems = [
    { label: tNav('home'), href: `/${locale}` },
    { label: tNav('portfolio'), href: `/${locale}/portfolio`, isActive: true },
  ];

  const backText: Record<string, string> = {
    ko: '메인으로 돌아가기',
    en: 'Back to main',
    'zh-CN': '返回首页',
    'zh-TW': '返回首頁',
  };

  return (
    <div className="min-h-screen bg-white">
      <AmbientBackground variant="lido" />

      <Navigation
        items={navItems}
        cta={{ label: tNav('contact'), href: `/${locale}/contact` }}
      />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href={`/${locale}`}
              className={cn(
                'inline-flex items-center gap-2 mb-8',
                'text-[#1a1a1a]/60 hover:text-[#1a1a1a]',
                'transition-colors duration-200'
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              {backText[locale] || backText['en']}
            </Link>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] mb-6">
              Portfolio
            </h1>
            <p className="text-xl text-[#1a1a1a]/60 max-w-2xl leading-relaxed">
              {t('description1')}
              <br />
              {t('description2')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {portfolioItems.map((item, index) => (
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
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium',
                        'bg-white/90 backdrop-blur-md text-[#1a1a1a]',
                        'border border-[#7fa8c9]/20'
                      )}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2 group-hover:text-[#7fa8c9] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#1a1a1a]/60 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-[#f2f8fc] text-[#7fa8c9] rounded-md">
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
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
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
              >
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
                <div className="relative aspect-video">
                  <Image src={selectedItem.imageUrl} alt={selectedItem.title} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <span className={cn('inline-block px-3 py-1.5 mb-4 rounded-full text-xs font-medium', 'bg-[#f2f8fc] text-[#7fa8c9]')}>
                    {selectedItem.category}
                  </span>
                  <h2 className="text-3xl font-bold text-[#1a1a1a] mb-3">{selectedItem.title}</h2>
                  <p className="text-lg text-[#1a1a1a]/60">{selectedItem.description}</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {selectedItem.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 text-sm bg-[#f2f8fc] text-[#7fa8c9] rounded-lg">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
