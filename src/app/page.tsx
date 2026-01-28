'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Root page: redirect to default locale
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 브라우저 언어 감지
    const browserLang = navigator.language || navigator.languages?.[0] || 'ko';
    
    // 지원 언어 매핑
    let locale = 'ko';
    if (browserLang.startsWith('en')) locale = 'en';
    else if (browserLang === 'zh-CN' || browserLang === 'zh-Hans') locale = 'zh-CN';
    else if (browserLang.startsWith('zh')) locale = 'zh-TW';
    
    router.replace(`/${locale}`);
  }, [router]);

  // 로딩 화면
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#7fa8c9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#1a1a1a]/60">Loading...</p>
      </div>
    </div>
  );
}
