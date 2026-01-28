'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
import { Navigation, GlassCard } from '@/presentation/components/ui';
import { ArrowLeft } from 'lucide-react';
import { legalData } from '@/lib/legal';

export default function TermsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const tNav = useTranslations('Navigation');

  const navItems = [
    { label: tNav('home'), href: `/${locale}` },
    { label: tNav('portfolio'), href: `/${locale}/portfolio` },
  ];

  const backText: Record<string, string> = {
    ko: '메인으로 돌아가기',
    en: 'Back to main',
    'zh-CN': '返回首页',
    'zh-TW': '返回首頁',
  };

  // Select content based on locale, fallback to Korean if missing
  const currentContent = legalData.terms[locale as keyof typeof legalData.terms] || legalData.terms.ko;

  return (
    <div className="min-h-screen bg-white">
      <AmbientBackground variant="lido" />
      <Navigation items={navItems} cta={{ label: tNav('contact'), href: `/${locale}/contact` }} />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-8 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {backText[locale] || backText['ko']}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">{currentContent.title}</h1>
            <p className="text-lg text-[#1a1a1a]/60 whitespace-pre-line">{currentContent.intro}</p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12" hover={false}>
            <div className="space-y-12">
              {currentContent.sections.map((section, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.03 }}>
                  <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">{section.title}</h2>
                  <div className="text-[#1a1a1a]/70 leading-relaxed whitespace-pre-line text-sm md:text-base break-all">{section.content}</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
