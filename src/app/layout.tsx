import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Invisible Works | 웹사이트 제작 전문',
    template: '%s | Invisible Works',
  },
  description:
    '투명한 가격, 전문적인 디자인. 복잡한 과정 없이 깔끔한 웹사이트를 만들어 드립니다. 무료 디자인 시안 제공.',
  keywords: [
    '웹사이트 제작',
    '홈페이지 제작',
    '랜딩페이지',
    '웹디자인',
    '반응형 웹',
    'Invisible Works',
  ],
  authors: [{ name: 'Invisible Works', url: 'https://invisibleworks.co' }],
  creator: 'Invisible Works',
  publisher: 'Invisible Works',
  metadataBase: new URL('https://invisibleworks.co'),
  alternates: {
    canonical: '/',
    languages: {
      ko: '/ko',
      en: '/en',
      'zh-CN': '/zh-CN',
      'zh-TW': '/zh-TW',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: ['en_US', 'zh_CN', 'zh_TW'],
    url: 'https://invisibleworks.co',
    siteName: 'Invisible Works',
    title: 'Invisible Works | 웹사이트 제작 전문',
    description:
      '투명한 가격, 전문적인 디자인. 복잡한 과정 없이 깔끔한 웹사이트를 만들어 드립니다.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Invisible Works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invisible Works | 웹사이트 제작 전문',
    description:
      '투명한 가격, 전문적인 디자인. 복잡한 과정 없이 깔끔한 웹사이트를 만들어 드립니다.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Search engine verification tags
  // Add your verification codes here after registering with each service
  verification: {
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // other: {
    //   'naver-site-verification': 'YOUR_NAVER_VERIFICATION_CODE',
    // },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="font-pretendard">
      <head>
        {/* Pretendard - 한국어 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* Inter - 영어 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Noto Sans SC - 중국어 간체 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Noto Sans TC - 중국어 번체 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
