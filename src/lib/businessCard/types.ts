// Business Card Types

export type TemplateId =
  | 'minimal-corinthian'
  | 'dynamic-block'
  | 'clean-hierarchy'
  | 'dot-matrix'
  | 'curve-elegance'
  | 'glass-prism'
  | 'swiss-grid'
  | 'dev-terminal'
  | 'tech-black'
  | 'bauhaus-geo'
  | 'holo-gradient'
  | 'ticket-pass'
  | 'sns-profile'
  | 'retro-cassette'
  | 'game-card'
  | 'lucid-plastic'
  | 'shipping-label'
  | 'neon-cyber'
  | 'polaroid-photo'
  | 'win95-os'
  | 'liquid-marbling'
  | 'eco-kraft'
  // Food
  | 'cafe-minimal'
  | 'bistro-bold'
  | 'organic-fresh'
  | 'burger-pop'
  // Beauty
  | 'soft-elegance'
  | 'modern-chic'
  | 'nail-art-pop'
  | 'spa-zen'
  // Fitness
  | 'power-gym'
  | 'pilates-flow'
  | 'crossfit-grungy'
  | 'yoga-balance'
  // Education
  | 'academic-ivy'
  | 'kids-school'
  | 'math-grid'
  | 'language-talk'
  // Medical
  | 'clinic-clean'
  | 'dental-smile'
  | 'oriental-herbal'
  | 'pediatric-care'
  // Brand
  | 'startup-rocket'
  | 'maker-industrial'
  | 'leather-craft'
  | 'eco-package'
  // Office
  | 'law-firm-classic'
  | 'finance-chart'
  | 'architect-line'
  | 'consulting-trust';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  mood: string[];
  defaultColor: string;
}

export interface BusinessCardData {
  template: TemplateId;
  primaryColor: string;
  logo: string | null; // Base64
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  slogan: string;
}

export interface BusinessCardState extends BusinessCardData {
  activeSide: 'front' | 'back';
  isGenerating: boolean;
  logoFile: File | null;
}

// Constants
export const CARD_WIDTH_MM = 90;
export const CARD_HEIGHT_MM = 50;
export const BLEED_MM = 3;
export const SAFE_MARGIN_MM = 3;

// With bleed
export const FULL_WIDTH_MM = CARD_WIDTH_MM + (BLEED_MM * 2); // 96mm
export const FULL_HEIGHT_MM = CARD_HEIGHT_MM + (BLEED_MM * 2); // 56mm

// Safe area (content should stay within)
export const SAFE_WIDTH_MM = CARD_WIDTH_MM - (SAFE_MARGIN_MM * 2); // 84mm
export const SAFE_HEIGHT_MM = CARD_HEIGHT_MM - (SAFE_MARGIN_MM * 2); // 44mm

// For canvas/preview (scale factor for 300dpi quality)
export const SCALE_FACTOR = 300 / 25.4; // pixels per mm at 300dpi

// Template definitions
export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'minimal-corinthian',
    name: '미니멀 코린티안',
    description: '극단의 여백과 타이포그래피 중심의 클래식한 명함',
    mood: ['Luxury', 'Editorial', 'Clean'],
    defaultColor: '#1a1a1a',
  },
  {
    id: 'dynamic-block',
    name: '다이나믹 블록',
    description: '강렬한 색면 대비와 기하학적 파티션',
    mood: ['Bold', 'Modern', 'Energetic'],
    defaultColor: '#7fa8c9',
  },
  {
    id: 'clean-hierarchy',
    name: '깔끔한 계층',
    description: '명확한 정보 계층과 그리드 기반 레이아웃',
    mood: ['Corporate', 'Professional', 'Organized'],
    defaultColor: '#2d5a7b',
  },
  {
    id: 'dot-matrix',
    name: '도트 매트릭스',
    description: '돈트 패턴과 레트로-퓨처리즘 감성',
    mood: ['Retro', 'Tech', 'Creative'],
    defaultColor: '#00ff88',
  },
  {
    id: 'curve-elegance',
    name: '커브 엘레강스',
    description: '부드러운 곡선과 유려한 그라디언트',
    mood: ['Artistic', 'Premium', 'Sophisticated'],
    defaultColor: '#9b6b9e',
  },
  {
    id: 'glass-prism',
    name: '글래스 프리즘',
    description: '투명한 유리 질감과 감각적인 블러 효과',
    mood: ['Trendy', 'Glass', 'Premium'],
    defaultColor: '#3b82f6',
  },
  {
    id: 'swiss-grid',
    name: '스위스 그리드',
    description: '엄격한 그리드 시스템과 볼드한 타이포그래피',
    mood: ['Professional', 'Modern', 'Structured'],
    defaultColor: '#ef4444',
  },
  {
    id: 'dev-terminal',
    name: '데브 터미널',
    description: '개발자를 위한 IDE/터미널 컨셉',
    mood: ['Tech', 'Geek', 'Dark'],
    defaultColor: '#10b981',
  },
  {
    id: 'tech-black',
    name: '테크 블랙',
    description: '프리미엄 블랙 메탈 카드 스타일',
    mood: ['Premium', 'Dark', 'Luxury'],
    defaultColor: '#000000',
  },
  {
    id: 'bauhaus-geo',
    name: '바우하우스',
    description: '원색의 기하학적 도형과 구성주의 예술',
    mood: ['Artistic', 'Vivid', 'Geometric'],
    defaultColor: '#eab308',
  },
  {
    id: 'holo-gradient',
    name: '홀로그램',
    description: '빛에 따라 변하는 듯한 오로라 그라디언트',
    mood: ['Trendy', 'Space', 'Vibrant'],
    defaultColor: '#8b5cf6',
  },
  {
    id: 'ticket-pass',
    name: '티켓 패스',
    description: '항공권/입장권 스타일의 유니크한 레이아웃',
    mood: ['Fun', 'Concept', 'Unique'],
    defaultColor: '#f97316',
  },
  {
    id: 'sns-profile',
    name: 'SNS 프로필',
    description: '인스타그램/소셜 미디어 프로필 스타일',
    mood: ['Social', 'Trendy', 'Young'],
    defaultColor: '#e1306c',
  },
  {
    id: 'retro-cassette',
    name: '레트로 카세트',
    description: '80년대 카세트 테이프 감성',
    mood: ['Retro', 'Fun', 'Music'],
    defaultColor: '#f59e0b',
  },
  {
    id: 'game-card',
    name: '게임 카드',
    description: '트레이딩 카드 게임(TCG) 스타일',
    mood: ['Game', 'Fun', 'Hobby'],
    defaultColor: '#dc2626',
  },
  {
    id: 'lucid-plastic',
    name: '투명 플라스틱',
    description: '누드 카드 컨셉의 반투명 플라스틱 느낌',
    mood: ['Minimal', 'Texture', 'Unique'],
    defaultColor: '#94a3b8',
  },
  {
    id: 'shipping-label',
    name: '운송장 라벨',
    description: '택배 운송장 스타일의 브루탈리즘 디자인',
    mood: ['Industrial', 'Brutalist', 'Concept'],
    defaultColor: '#fbbf24',
  },
  {
    id: 'neon-cyber',
    name: '네온 사이버',
    description: '어두운 배경에 빛나는 네온 보더',
    mood: ['Cyberpunk', 'Night', 'Neon'],
    defaultColor: '#06b6d4',
  },
  {
    id: 'polaroid-photo',
    name: '폴라로이드',
    description: '즉석 사진 스타일 프레임과 손글씨 폰트',
    mood: ['Vintage', 'Warm', 'Analog'],
    defaultColor: '#1a1a1a',
  },
  {
    id: 'win95-os',
    name: '윈도우 95',
    description: '90년대 레트로 OS 윈도우 스타일',
    mood: ['Retro', 'Nostalgia', 'Tech'],
    defaultColor: '#008080',
  },
  {
    id: 'liquid-marbling',
    name: '리퀴드 마블',
    description: '물감을 섞은 듯한 예술적인 마블링 패턴',
    mood: ['Artistic', 'Luxury', 'Fluid'],
    defaultColor: '#7c3aed',
  },
  {
    id: 'eco-kraft',
    name: '에코 크라프트',
    description: '재생지 크라프트 질감과 스탬프 느낌',
    mood: ['Eco', 'Natural', 'Warm'],
    defaultColor: '#166534',
  },

  // Food (음식점/카페)
  {
    id: 'cafe-minimal',
    name: '카페 미니멀',
    description: '모던한 카페를 위한 따뜻하고 심플한 디자인',
    mood: ['Warm', 'Clean', 'Cafe'],
    defaultColor: '#a16207', // Brown
  },
  {
    id: 'bistro-bold',
    name: '비스트로 볼드',
    description: '셰프/레스토랑을 위한 클래식하고 강렬한 스타일',
    mood: ['Classic', 'Strong', 'Dining'],
    defaultColor: '#1a1a1a',
  },
  {
    id: 'organic-fresh',
    name: '오가닉 프레시',
    description: '샐러드/웰빙 푸드에 어울리는 신선한 느낌',
    mood: ['Fresh', 'Green', 'Organic'],
    defaultColor: '#4d7c0f',
  },
  {
    id: 'burger-pop',
    name: '버거 팝',
    description: '캐주얼 다이닝을 위한 톡톡 튀는 레트로 팝',
    mood: ['Fun', 'Pop', 'Food'],
    defaultColor: '#ef4444',
  },

  // Beauty (뷰티/네일)
  {
    id: 'soft-elegance',
    name: '소프트 엘레강스',
    description: '뷰티/에스테틱을 위한 우아하고 부드러운 감성',
    mood: ['Elegant', 'Soft', 'Beauty'],
    defaultColor: '#db2777', // Pink
  },
  {
    id: 'modern-chic',
    name: '모던 시크',
    description: '헤어숍/메이크업을 위한 세련된 도시적 감각',
    mood: ['Chic', 'Modern', 'Fashion'],
    defaultColor: '#000000',
  },
  {
    id: 'nail-art-pop',
    name: '네일 아트 팝',
    description: '네일숍을 위한 컬러풀하고 아기자기한 디자인',
    mood: ['Cute', 'Colorful', 'Nail'],
    defaultColor: '#c084fc',
  },
  {
    id: 'spa-zen',
    name: '스파 젠',
    description: '휴식과 힐링을 강조한 차분한 스파 스타일',
    mood: ['Calm', 'Healing', 'Zen'],
    defaultColor: '#57534e', // Stone
  },

  // Fitness (헬스/필라테스)
  {
    id: 'power-gym',
    name: '파워 짐',
    description: '피트니스/PT를 위한 강렬하고 역동적인 디자인',
    mood: ['Strong', 'Dynamic', 'Gym'],
    defaultColor: '#ef4444',
  },
  {
    id: 'pilates-flow',
    name: '필라테스 플로우',
    description: '필라테스/요가를 위한 유연한 곡선미',
    mood: ['Flow', 'Soft', 'Health'],
    defaultColor: '#60a5fa', // Soft Blue
  },
  {
    id: 'crossfit-grungy',
    name: '크로스핏 그런지',
    description: '와일드한 텍스처와 거친 매력',
    mood: ['Wild', 'Rough', 'Sport'],
    defaultColor: '#262626',
  },
  {
    id: 'yoga-balance',
    name: '요가 밸런스',
    description: '균형과 평온함을 주는 미니멀한 라인',
    mood: ['Balance', 'Calm', 'Yoga'],
    defaultColor: '#14b8a6', // Teal
  },

  // Education (학원/교육)
  {
    id: 'academic-ivy',
    name: '아카데믹 아이비',
    description: '전통적인 교육 기관의 신뢰감을 주는 클래식 스타일',
    mood: ['Trust', 'Classic', 'Edu'],
    defaultColor: '#1e3a8a', // Navy
  },
  {
    id: 'kids-school',
    name: '키즈 스쿨',
    description: '유치원/미술학원을 위한 밝고 경쾌한 디자인',
    mood: ['Kids', 'Playful', 'Bright'],
    defaultColor: '#facc15', // Yellow
  },
  {
    id: 'math-grid',
    name: '매스 그리드',
    description: '수학/과학 학원을 위한 논리적인 그리드 패턴',
    mood: ['Logic', 'Smart', 'Math'],
    defaultColor: '#0891b2',
  },
  {
    id: 'language-talk',
    name: '랭귀지 토크',
    description: '어학원을 위한 말풍선 모티브와 소통의 이미지',
    mood: ['Talk', 'Global', 'Lang'],
    defaultColor: '#f97316',
  },

  // Medical (병원/클리닉)
  {
    id: 'clinic-clean',
    name: '클리닉 클린',
    description: '내과/검진센터를 위한 깨끗하고 전문적인 느낌',
    mood: ['Clean', 'Medical', 'Trust'],
    defaultColor: '#0ea5e9', // Sky Blue
  },
  {
    id: 'dental-smile',
    name: '덴탈 스마일',
    description: '치과를 위한 밝고 깨끗한 이미지',
    mood: ['Bright', 'Health', 'Dental'],
    defaultColor: '#10b981', // Mint
  },
  {
    id: 'oriental-herbal',
    name: '오리엔탈 허브',
    description: '한의원을 위한 전통적인 종이 질감과 먹 색상',
    mood: ['Tradition', 'Warm', 'Herbal'],
    defaultColor: '#78350f', // Brown
  },
  {
    id: 'pediatric-care',
    name: '소아과 케어',
    description: '소아과를 위한 부드럽고 친근한 캐릭터 스타일',
    mood: ['Soft', 'Care', 'Kids'],
    defaultColor: '#f472b6', // Soft Pink
  },

  // Brand (브랜드/제조)
  {
    id: 'startup-rocket',
    name: '스타트업 로켓',
    description: '혁신적인 IT/스타트업을 위한 그라디언트',
    mood: ['Modern', 'Tech', 'Fast'],
    defaultColor: '#6366f1', // Indigo
  },
  {
    id: 'maker-industrial',
    name: '메이커 인더스트리',
    description: '제조/공방을 위한 테크니컬 드로잉 컨셉',
    mood: ['Technical', 'Solid', 'Maker'],
    defaultColor: '#475569', // Slate
  },
  {
    id: 'leather-craft',
    name: '레더 크래프트',
    description: '가죽 공방/수공예 브랜드를 위한 텍스처',
    mood: ['Craft', 'Texture', 'Handmade'],
    defaultColor: '#451a03', // Dark Brown
  },
  {
    id: 'eco-package',
    name: '에코 패키지',
    description: '친환경 제품/패키징 브랜드를 위한 박스 질감',
    mood: ['Eco', 'Box', 'Brand'],
    defaultColor: '#b45309',
  },

  // Office (사무실/오피스)
  {
    id: 'law-firm-classic',
    name: '로펌 클래식',
    description: '변호사/세무사를 위한 가장 보수적이고 신뢰감 있는 스타일',
    mood: ['Law', 'Trust', 'Serious'],
    defaultColor: '#172554', // Dark Navy
  },
  {
    id: 'finance-chart',
    name: '파이낸스 차트',
    description: '금융/투자를 위한 데이터 시각화 배경',
    mood: ['Data', 'Smart', 'Money'],
    defaultColor: '#047857', // Emerald
  },
  {
    id: 'architect-line',
    name: '아키텍트 라인',
    description: '건축/설계를 위한 정교한 라인 드로잉',
    mood: ['Precise', 'Line', 'Build'],
    defaultColor: '#000000',
  },
  {
    id: 'consulting-trust',
    name: '컨설팅 트러스트',
    description: '컨설팅/자문업을 위한 군더더기 없는 신뢰 디자인',
    mood: ['Trust', 'Simple', 'Biz'],
    defaultColor: '#334155',
  },
];

export const getTemplateById = (id: TemplateId): TemplateInfo => {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
};

// Initial state
export const initialBusinessCardState: BusinessCardState = {
  template: 'minimal-corinthian',
  primaryColor: '#1a1a1a',
  logo: null,
  logoFile: null,
  name: '',
  title: '',
  company: '',
  phone: '',
  email: '',
  address: '',
  website: '',
  slogan: '',
  activeSide: 'front',
  isGenerating: false,
};
