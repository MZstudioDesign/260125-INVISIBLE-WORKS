export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Invisible Works',
    url: 'https://invisibleworks.co',
    logo: 'https://invisibleworks.co/og-image.png',
    description:
      '투명한 가격, 전문적인 디자인. 복잡한 과정 없이 깔끔한 홈페이지를 만들어 드립니다.',
    foundingDate: '2025',
    areaServed: {
      '@type': 'Country',
      name: 'KR',
    },
    serviceType: [
      'Web Design',
      'Web Development',
      'Landing Page',
      'Responsive Website',
    ],
    knowsLanguage: ['ko', 'en', 'zh-CN', 'zh-TW'],
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Korean', 'English', 'Chinese'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Invisible Works',
    url: 'https://invisibleworks.co',
    inLanguage: ['ko', 'en', 'zh-CN', 'zh-TW'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://invisibleworks.co/ko/portfolio?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
