// Business Card Types

export type TemplateId = 
  | 'minimal-corinthian'
  | 'dynamic-block'
  | 'clean-hierarchy'
  | 'dot-matrix'
  | 'curve-elegance';

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
