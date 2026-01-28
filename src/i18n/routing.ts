import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['ko', 'en', 'zh-CN', 'zh-TW'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
};

export const localeShortNames: Record<Locale, string> = {
  ko: 'KO',
  en: 'EN',
  'zh-CN': '简',
  'zh-TW': '繁',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'ko',
  localePrefix: 'always', // 항상 /ko, /en 등 prefix 사용
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
