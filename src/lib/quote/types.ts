// Quote/Invoice Types

// 견적 항목 입력 타입
export type QuoteItemType = 'fixed' | 'range' | 'text' | 'percent';

export interface QuoteItem {
  id: string;
  description: string;
  subItems?: string[]; // 세부 항목
  quantity: number;
  unitPrice: number;   // 고정가 또는 최소금액

  // New fields for advanced logic
  inputType?: QuoteItemType; // 기본값은 'fixed'
  maxPrice?: number;         // 범위 입력 시 최대값
  textValue?: string;        // 텍스트 입력 시 (예: "별도 상담")
  ratio?: number;            // 비율 (%) 입력 시

  discount?: number;   // 할인율 (%)
}

// ═══════════════════════════════════════════════════════════════
// 결제 분할 옵션
// ═══════════════════════════════════════════════════════════════
export type PaymentSplitType = 'full' | 'two' | 'three';

export interface PaymentSplit {
  type: PaymentSplitType;
  ratios: number[];   // [100] / [50, 50] / [30, 40, 30] 등
  labels: string[];   // ['선금'] / ['착수금', '잔금'] / ['착수금', '중도금', '완료금']
}

export const DEFAULT_PAYMENT_SPLITS: Record<PaymentSplitType, PaymentSplit> = {
  full: { type: 'full', ratios: [100], labels: ['선금'] },
  two: { type: 'two', ratios: [50, 50], labels: ['착수금', '잔금'] },
  three: { type: 'three', ratios: [30, 40, 30], labels: ['착수금', '중도금', '완료금'] },
};

// ═══════════════════════════════════════════════════════════════
// 서버/도메인 옵션
// ═══════════════════════════════════════════════════════════════
export type ServiceStatus = 'confirmed' | 'pending';

export interface ServerOption {
  status: ServiceStatus;
  years?: 1 | 2 | 3;
}

export interface DomainOption {
  status: ServiceStatus;
  type?: 'new' | 'transfer';  // 신규 / 이전
  years?: number;             // 1~5년
}

// ═══════════════════════════════════════════════════════════════
// 스크린 블록 (범위 지원)
// ═══════════════════════════════════════════════════════════════
export interface ScreenBlocks {
  min: number;
  max: number;
}

// ═══════════════════════════════════════════════════════════════
// UIUX 스타일
// ═══════════════════════════════════════════════════════════════
export type UIUXStyle = 'normal' | 'fancy';

// ═══════════════════════════════════════════════════════════════
// 기능 선택
// ═══════════════════════════════════════════════════════════════
export type FeatureType = 'board' | 'inquiry' | 'login' | 'shopping' | 'admin' | 'reservation';

export interface FeatureSelection {
  features: FeatureType[];
  productCount?: { min: number; max: number };  // 쇼핑 선택 시만
}

export const FEATURE_LABELS: Record<FeatureType, string> = {
  board: '게시판',
  inquiry: '문의 폼',
  login: '로그인/회원가입',
  shopping: '쇼핑·결제',
  admin: '관리자 페이지',
  reservation: '예약 기능',
};

// ═══════════════════════════════════════════════════════════════
// 특이사항
// ═══════════════════════════════════════════════════════════════
export type SpecialNoteType = 'multilingual' | 'renewal' | 'external' | 'urgent' | 'security';

export const SPECIAL_NOTE_LABELS: Record<SpecialNoteType, string> = {
  multilingual: '다국어 사이트',
  renewal: '기존 사이트 이전/리뉴얼',
  external: '외부 서비스 연동',
  urgent: '일정이 매우 촉박함',
  security: '내부 보안 규정/접근 제한',
};

export interface QuoteData {
  // 기본 정보
  quoteNumber: string;
  date: string;

  // 발신인 (우리 회사)
  companyName: string;
  companyLogo: string | null;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyRepresentative: string;      // 대표자명
  companyBusinessNumber: string;      // 사업자등록번호

  // 수신인 (고객)
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;

  // 항목
  items: QuoteItem[];

  // 금액
  vatRate: number; // 퍼센트 (예: 10)

  // 추가
  headerMessage: string;
  notes: string;
  validUntil: string;

  // 세부 견적서 전용
  invoiceSubject: string;
  discount: number; // 전체 할인 금액

  // 결제 정보
  bankName: string;
  bankAccountName: string;
  bankBSB: string;
  bankAccountNumber: string;
  paymentTerms: string;

  // 결제 분할
  paymentSplit: PaymentSplit;

  // 서버/도메인 옵션
  serverOption: ServerOption;
  domainOption: DomainOption;

  // 프로젝트 정보 (자동 계산용)
  screenBlocks: ScreenBlocks;
  uiuxStyle: UIUXStyle;
  featureSelection: FeatureSelection;
  specialNotes: SpecialNoteType[];

  // 약관
  termsAndConditions: string[];
}

export type QuoteType = 'simple' | 'detailed';

export interface QuoteState extends QuoteData {
  activeTab: QuoteType;
  isGenerating: boolean;
  showSettings: boolean;  // 관리자 설정 패널 표시 여부
}

// Constants - A4 Size
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const A4_PADDING_MM = 15; // 페이지 여백

// 미리보기용 (72dpi 기준)
export const A4_WIDTH_PX = 595;
export const A4_HEIGHT_PX = 842;

// 계산 유틸리티 (범위 지원)
export const calculateItemTotal = (item: QuoteItem): { min: number; max: number } => {
  const quantity = item.quantity;
  const discountRate = (item.discount || 0) / 100;

  const minBase = quantity * item.unitPrice;
  const maxBase = quantity * (item.maxPrice || item.unitPrice);

  return {
    min: Math.round(minBase * (1 - discountRate)),
    max: Math.round(maxBase * (1 - discountRate))
  };
};

export const calculateSubtotal = (items: QuoteItem[]): { min: number; max: number } => {
  return items.reduce(
    (acc, item) => {
      const total = calculateItemTotal(item);
      return {
        min: acc.min + total.min,
        max: acc.max + total.max
      };
    },
    { min: 0, max: 0 }
  );
};

export const calculateVAT = (subtotal: { min: number; max: number }, vatRate: number): { min: number; max: number } => {
  return {
    min: Math.round(subtotal.min * (vatRate / 100)),
    max: Math.round(subtotal.max * (vatRate / 100))
  };
};

export const calculateTotal = (
  subtotal: { min: number; max: number },
  vat: { min: number; max: number }
): { min: number; max: number } => {
  return {
    min: subtotal.min + vat.min,
    max: subtotal.max + vat.max
  };
};

export const calculateBalanceDue = (
  subtotal: { min: number; max: number },
  vat: { min: number; max: number },
  discount: number
): { min: number; max: number } => {
  const totalMin = subtotal.min + vat.min;
  const totalMax = subtotal.max + vat.max;
  return {
    min: Math.max(0, totalMin - discount),
    max: Math.max(0, totalMax - discount)
  };
};

export const formatCurrency = (amount: number | { min: number; max: number }): string => {
  if (typeof amount === 'number') {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  }

  if (amount.min === amount.max) {
    return new Intl.NumberFormat('ko-KR').format(amount.min) + '원';
  }

  return `${new Intl.NumberFormat('ko-KR').format(amount.min)}원 ~ ${new Intl.NumberFormat('ko-KR').format(amount.max)}원`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// 기본 약관
export const DEFAULT_TERMS = [
  '본 견적서는 서비스 제공 범위를 명시하며, 별도 협의되지 않은 인쇄 비용 등은 포함되지 않습니다.',
  '계약금 50%는 작업 착수 전에 입금되어야 하며, 입금 확인 후 작업이 시작됩니다.',
  '잔금은 발행일로부터 7일 이내에 입금해 주시기 바랍니다.',
  '프로젝트 관리 비용은 본 견적에 포함되어 있지 않습니다.',
  '지급 지연 시 총 금액의 1.5%에 해당하는 연체료가 부과될 수 있습니다.',
  '본 견적서 관련 문의는 발행일로부터 2영업일 이내에 연락 주시기 바랍니다.',
  '결제가 완료되지 않을 경우 서비스 제공이 중단될 수 있습니다.',
  '본 견적서와 서비스는 대한민국 법률에 따라 해석됩니다.',
  '본 견적서를 수락하시면 위의 약관에 동의하는 것으로 간주됩니다.',
];

// 초기 상태
export const initialQuoteState: QuoteState = {
  quoteNumber: '001',
  date: new Date().toISOString().split('T')[0],

  companyName: 'Invisible Works',
  companyLogo: null,
  companyAddress: '대구광역시 중구 남산동 677-58, 명륜로21길 33-11',
  companyPhone: '',
  companyEmail: 'invisibleworks.office@gmail.com',
  companyWebsite: 'invisibleworks.co',
  companyRepresentative: '오유택',
  companyBusinessNumber: '377-44-01126',

  clientName: '',
  clientAddress: '',
  clientPhone: '',
  clientEmail: '',

  items: [
    { id: '1', description: '', subItems: [], quantity: 1, unitPrice: 0, discount: 0 },
  ],

  vatRate: 10,

  headerMessage: '견적서를 보내드립니다. 궁금한 점이 있으시면 연락 주세요.',
  notes: '',
  validUntil: '',

  // 세부 견적서 전용
  invoiceSubject: '',
  discount: 0,

  // 결제 정보
  bankName: '카카오뱅크',
  bankAccountName: '오유택(엠지쓰studio)',
  bankBSB: '',
  bankAccountNumber: '3333-14-9478697',
  paymentTerms: '발행일로부터 7일 이내',

  // 결제 분할 (기본: 100% 선금)
  paymentSplit: DEFAULT_PAYMENT_SPLITS.full,

  // 서버/도메인 (기본: 미정)
  serverOption: { status: 'pending' },
  domainOption: { status: 'pending' },

  // 프로젝트 정보 (기본값)
  screenBlocks: { min: 15, max: 30 },
  uiuxStyle: 'normal',
  featureSelection: { features: [] },
  specialNotes: [],

  // 약관
  termsAndConditions: DEFAULT_TERMS,

  activeTab: 'simple',
  isGenerating: false,
  showSettings: false,
};

// 새 항목 생성
export const createNewItem = (): QuoteItem => ({
  id: Date.now().toString(),
  description: '',
  subItems: [],
  quantity: 1,
  unitPrice: 0,
  discount: 0,
});

// End of calculation utilities
