'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
import { Navigation } from '@/presentation/components/ui';
import { PortfolioModal, usePortfolioModal } from '@/presentation/components/ui/PortfolioModal';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import {
  portfolioProjects,
  getProjectById,
  CATEGORIES,
  type CategoryKey,
  type PortfolioProject,
} from '@/data/portfolio-projects';

// ============================================
// Category Filter Bar
// ============================================

interface CategoryFilterProps {
  active: CategoryKey | 'all';
  onChange: (category: CategoryKey | 'all') => void;
}

function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const t = useTranslations('PortfolioCategories');

  const categories: (CategoryKey | 'all')[] = ['all', ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
            active === cat
              ? 'bg-[#1a1a1a] text-white shadow-md'
              : 'bg-[#f2f8fc] text-[#1a1a1a]/60 hover:text-[#1a1a1a] hover:bg-[#e8f0f6] border border-[#7fa8c9]/10'
          )}
        >
          {t(cat)}
        </button>
      ))}
    </div>
  );
}

// ============================================
// Project Card
// ============================================

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
  onClick: () => void;
  categoryLabel: string;
}

function ProjectCard({ project, index, onClick, categoryLabel }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl cursor-pointer',
        'bg-white/85 backdrop-blur-xl',
        'border-2 border-[#7fa8c9]/15',
        'shadow-[0_8px_32px_rgba(127,168,201,0.08)]',
        'hover:border-[#7fa8c9]/30',
        'hover:shadow-[0_16px_48px_rgba(127,168,201,0.15)]',
        'transition-all duration-500'
      )}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.name}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium',
            'bg-white/90 backdrop-blur-md text-[#1a1a1a]',
            'border border-[#7fa8c9]/20'
          )}>
            {categoryLabel}
          </span>
        </div>

        {/* 3 Designs indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
            'bg-white/90 backdrop-blur-md text-[#1a1a1a]',
            'text-xs font-medium shadow-lg'
          )}>
            <div className="flex -space-x-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-3 h-3 rounded-full border-2 border-white bg-[#7fa8c9]" style={{ opacity: 1 - i * 0.25 }} />
              ))}
            </div>
            3 Designs
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#7fa8c9] transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-[#1a1a1a]/50">{project.industry}</p>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7fa8c9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

// ============================================
// Portfolio Page
// ============================================

export default function PortfolioPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const t = useTranslations('PortfolioPage');
  const tNav = useTranslations('Navigation');
  const tCategories = useTranslations('PortfolioCategories');

  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');
  const { selectedProject, open, close } = usePortfolioModal();

  // Auto-open modal from query param (e.g. ?open=codelab-academy)
  useEffect(() => {
    const openId = searchParams.get('open');
    if (openId) {
      const project = getProjectById(openId);
      if (project) {
        open(project);
      }
    }
  }, [searchParams, open]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return portfolioProjects;
    return portfolioProjects.filter(p => p.category === activeCategory);
  }, [activeCategory]);

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

      {/* Header */}
      <section className="pt-32 pb-12 px-6">
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
            <p className="text-xl text-[#1a1a1a]/60 max-w-2xl leading-relaxed mb-10">
              {t('description1')}
              <br />
              {t('description2')}
            </p>

            {/* Category Filter */}
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => open(project)}
                  categoryLabel={tCategories(project.category)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-[#1a1a1a]/40">
              {t('noResults')}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <PortfolioModal
        project={selectedProject}
        onClose={close}
        categoryLabel={selectedProject ? tCategories(selectedProject.category) : undefined}
      />
    </div>
  );
}
