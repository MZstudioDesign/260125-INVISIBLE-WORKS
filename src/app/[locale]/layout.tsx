import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Invisible Works',
  description: '투명하고 신뢰감 있는 디자인 시스템',
};

// 언어별 줄바꿈 클래스
const breakClasses: Record<Locale, string> = {
  ko: 'break-keep',
  en: 'hyphens-auto',
  'zh-CN': '',
  'zh-TW': '',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 유효한 locale인지 확인
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // 정적 생성을 위해 locale 설정
  setRequestLocale(locale);

  // 번역 메시지 로드
  const messages = await getMessages();

  return (
    <div className={breakClasses[locale as Locale]}>
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
