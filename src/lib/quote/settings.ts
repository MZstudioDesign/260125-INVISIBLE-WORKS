// Quote Settings - Cost Structure & Company Info

// ═══════════════════════════════════════════════════════════════
// 비용 설정 타입
// ═══════════════════════════════════════════════════════════════
export interface PageCostTier {
  min: number;
  max: number;
  cost: number;
}

export interface QuoteSettings {
  // 페이지 제작비
  pageCost: {
    tiers: PageCostTier[];
    extraPerTwo: number;  // 45 초과 시 2페이지당 추가 비용
  };

  // UIUX 배율
  uiuxMultiplier: {
    normal: number;
    fancy: number;
  };

  // 기능 비용
  featureCost: {
    board: number;         // 게시판
    shopping: number;      // 쇼핑 기본
    productExtra: number;  // 상품 20개 초과 시 1개당
    productBase: number;   // 상품 기본 포함 개수
  };

  // 서버 비용
  serverCost: {
    year1: number;
    year2: number;
    year3: number;
  };

  // 도메인 비용
  domainCost: {
    perYear: number;
    transfer: number;
  };

  // 수정 비용
  revisionCost: {
    contentRevision: number;
    layoutRevision: number;
  };

  // 회사 정보
  companyInfo: {
    name: string;
    representative: string;
    businessNumber: string;
    email: string;
    address: string;
    website: string;
  };

  // 결제 계좌
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };

  // 직접 입력 항목
  customFields: { label: string; value: string }[];
}

// ═══════════════════════════════════════════════════════════════
// 기본 설정값 (지침서 기준)
// ═══════════════════════════════════════════════════════════════
export const DEFAULT_SETTINGS: QuoteSettings = {
  pageCost: {
    tiers: [
      { min: 1, max: 15, cost: 400000 },
      { min: 15, max: 30, cost: 500000 },
      { min: 30, max: 45, cost: 600000 },
    ],
    extraPerTwo: 30000,
  },

  uiuxMultiplier: {
    normal: 1.0,
    fancy: 1.2,
  },

  featureCost: {
    board: 100000,
    shopping: 200000,
    productExtra: 10000,
    productBase: 20,
  },

  serverCost: {
    year1: 150000,
    year2: 250000,
    year3: 300000,
  },

  domainCost: {
    perYear: 30000,
    transfer: 30000,
  },

  revisionCost: {
    contentRevision: 50000,
    layoutRevision: 100000,
  },

  companyInfo: {
    name: 'Invisible Works',
    representative: '오유택',
    businessNumber: '377-44-01126',
    email: 'invisibleworks.office@gmail.com',
    address: '대구광역시 중구 남산동 677-58, 명륜로21길 33-11',
    website: 'invisibleworks.co',
  },

  bankInfo: {
    bankName: '카카오뱅크',
    accountNumber: '3333-14-9478697',
    accountHolder: '오유택(엠지쓰studio)',
  },

  customFields: [],
};

// ═══════════════════════════════════════════════════════════════
// 비용 계산 유틸리티
// ═══════════════════════════════════════════════════════════════

/**
 * 스크린 블록 수에 따른 페이지 제작비 계산
 */
export function calculatePageCost(
  blocks: number,
  settings: QuoteSettings = DEFAULT_SETTINGS
): number {
  const { tiers, extraPerTwo } = settings.pageCost;

  // 기본 구간에서 비용 찾기
  for (const tier of tiers) {
    if (blocks >= tier.min && blocks <= tier.max) {
      return tier.cost;
    }
  }

  // 45 초과 시
  const lastTier = tiers[tiers.length - 1];
  if (blocks > lastTier.max) {
    const extraBlocks = blocks - lastTier.max;
    const extraCost = Math.ceil(extraBlocks / 2) * extraPerTwo;
    return lastTier.cost + extraCost;
  }

  return tiers[0].cost;
}

/**
 * 범위 입력에 대한 페이지 비용 계산 (최소~최대)
 */
export function calculatePageCostRange(
  minBlocks: number,
  maxBlocks: number,
  settings: QuoteSettings = DEFAULT_SETTINGS
): { min: number; max: number } {
  return {
    min: calculatePageCost(minBlocks, settings),
    max: calculatePageCost(maxBlocks, settings),
  };
}

/**
 * UIUX 가산 적용
 */
export function applyUiuxMultiplier(
  baseCost: number,
  isFancy: boolean,
  settings: QuoteSettings = DEFAULT_SETTINGS
): number {
  const multiplier = isFancy
    ? settings.uiuxMultiplier.fancy
    : settings.uiuxMultiplier.normal;
  return Math.round(baseCost * multiplier);
}

/**
 * 쇼핑 기능 비용 계산
 */
export function calculateShoppingCost(
  productCount: number,
  settings: QuoteSettings = DEFAULT_SETTINGS
): number {
  const { shopping, productExtra, productBase } = settings.featureCost;

  if (productCount <= productBase) {
    return shopping;
  }

  const extraProducts = productCount - productBase;
  const extraCost = extraProducts * productExtra;

  // 5만원 단위 반올림
  const roundedExtra = Math.ceil(extraCost / 50000) * 50000;

  return shopping + roundedExtra;
}

/**
 * 서버 비용 조회
 */
export function getServerCost(
  years: 1 | 2 | 3,
  settings: QuoteSettings = DEFAULT_SETTINGS
): number {
  const costs = settings.serverCost;
  switch (years) {
    case 1:
      return costs.year1;
    case 2:
      return costs.year2;
    case 3:
      return costs.year3;
    default:
      return costs.year1;
  }
}

/**
 * 도메인 비용 계산
 */
export function calculateDomainCost(
  years: number,
  isTransfer: boolean,
  settings: QuoteSettings = DEFAULT_SETTINGS
): number {
  const { perYear, transfer } = settings.domainCost;
  const baseCost = perYear * years;
  return isTransfer ? baseCost + transfer : baseCost;
}

/**
 * 금액 포맷 (만원 단위)
 */
export function formatWon(amount: number): string {
  if (amount >= 10000) {
    const man = amount / 10000;
    return `${man.toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

/**
 * 서버 옵션 텍스트 생성 (미정 시)
 */
export function getServerOptionsText(
  settings: QuoteSettings = DEFAULT_SETTINGS
): string {
  const { year1, year2, year3 } = settings.serverCost;
  return `1년 ${formatWon(year1)} / 2년 ${formatWon(year2)} / 3년 ${formatWon(year3)}`;
}

export function getDomainOptionsText(
  settings: QuoteSettings = DEFAULT_SETTINGS
): string {
  const { perYear, transfer } = settings.domainCost;
  return `신규: 연 ${formatWon(perYear)} × 사용연수 / 이전: +${formatWon(transfer)}`;
}

// ═══════════════════════════════════════════════════════════════
// 기능 비용 계산
// ═══════════════════════════════════════════════════════════════
import type { FeatureType, FeatureSelection, ScreenBlocks, UIUXStyle, SpecialNoteType } from './types';

// ═══════════════════════════════════════════════════════════════
// 특이사항 → 항목 변환 설정
// ═══════════════════════════════════════════════════════════════
/**
 * Special Note Item Generation Configuration
 * Each note generates a 'text' type item with "별도 상담" value
 */
export const SPECIAL_NOTE_ITEM_CONFIG: Record<SpecialNoteType, {
  description: string;
  subItems: string[];
}> = {
  multilingual: {
    description: '다국어 사이트 구축',
    subItems: ['번역 및 다국어 라우팅 설정', '언어별 콘텐츠 관리 시스템'],
  },
  renewal: {
    description: '기존 사이트 이전/리뉴얼',
    subItems: ['기존 콘텐츠 마이그레이션', '도메인 및 서버 이전 작업'],
  },
  external: {
    description: '외부 서비스 연동',
    subItems: ['API 연동 개발', '인증 및 데이터 동기화'],
  },
  urgent: {
    description: '긴급 일정 가산',
    subItems: ['우선 작업 배정', '초과 근무 비용 포함'],
  },
  security: {
    description: '내부 보안 규정 대응',
    subItems: ['보안 감사 대응', '특수 접근 제한 설정'],
  },
};

/**
 * 선택된 기능들의 총 비용 계산
 */
export function calculateFeatureCost(
  selection: FeatureSelection,
  settings: QuoteSettings = DEFAULT_SETTINGS
): { min: number; max: number } {
  const { features, productCount } = selection;
  let minCost = 0;
  let maxCost = 0;

  for (const feature of features) {
    switch (feature) {
      case 'board':
        minCost += settings.featureCost.board;
        maxCost += settings.featureCost.board;
        break;
      case 'shopping':
        if (productCount) {
          minCost += calculateShoppingCost(productCount.min, settings);
          maxCost += calculateShoppingCost(productCount.max, settings);
        } else {
          // 상품 개수 미입력 시 기본 비용만
          minCost += settings.featureCost.shopping;
          maxCost += settings.featureCost.shopping;
        }
        break;
      // inquiry, login, admin, reservation은 추가 비용 없음
      default:
        break;
    }
  }

  return { min: minCost, max: maxCost };
}

/**
 * 전체 견적 예상 비용 계산 (범위)
 */
export function calculateTotalEstimate(
  screenBlocks: ScreenBlocks,
  uiuxStyle: UIUXStyle,
  featureSelection: FeatureSelection,
  settings: QuoteSettings = DEFAULT_SETTINGS
): { min: number; max: number } {
  // 1. 페이지 제작비
  const pageCosts = calculatePageCostRange(screenBlocks.min, screenBlocks.max, settings);

  // 2. UIUX 가산 적용
  const isFancy = uiuxStyle === 'fancy';
  const pageCostWithUiux = {
    min: applyUiuxMultiplier(pageCosts.min, isFancy, settings),
    max: applyUiuxMultiplier(pageCosts.max, isFancy, settings),
  };

  // 3. 기능 비용
  const featureCosts = calculateFeatureCost(featureSelection, settings);

  return {
    min: pageCostWithUiux.min + featureCosts.min,
    max: pageCostWithUiux.max + featureCosts.max,
  };
}

// ═══════════════════════════════════════════════════════════════
// 견적 항목 생성 유틸리티
// ═══════════════════════════════════════════════════════════════
import { createNewItem, QuoteItem, QuoteData, FEATURE_LABELS } from './types';

/**
 * 프로젝트 정보를 기반으로 견적 항목 리스트 생성
 */
export function generateEstimateQuoteItems(
  data: QuoteData,
  settings: QuoteSettings = DEFAULT_SETTINGS
): QuoteItem[] {
  const items: QuoteItem[] = [];
  const { screenBlocks, uiuxStyle, featureSelection, specialNotes } = data;

  // 1. 페이지 제작비 항목 생성
  if (screenBlocks.min > 0) {
    const pageCosts = calculatePageCostRange(screenBlocks.min, screenBlocks.max, settings);
    const isFancy = uiuxStyle === 'fancy';

    // UIUX 가산 적용
    const minCost = applyUiuxMultiplier(pageCosts.min, isFancy, settings);
    const maxCost = applyUiuxMultiplier(pageCosts.max, isFancy, settings);

    const desc = `웹사이트 기획 및 디자인/개발 (${screenBlocks.min}~${screenBlocks.max} 블록)`;
    const subItems = [];
    if (isFancy) subItems.push('UI/UX: 화려한 스타일 적용 (1.2배)');
    else subItems.push('UI/UX: 일반 스타일 적용');

    // 리뉴얼인 경우
    if (specialNotes.includes('renewal')) subItems.push('기존 사이트 리뉴얼');

    items.push({
      ...createNewItem(),
      id: 'auto-page-cost',
      description: desc,
      subItems: subItems,
      quantity: 1,
      unitPrice: minCost,
      maxPrice: maxCost,
    });
  }

  // 2. 기능 비용 항목 생성
  featureSelection.features.forEach((feature) => {
    // 무료 기능은 제외하거나 0원으로 표시 (사용자 선택에 따라 다름, 여기선 유료만 표시)
    if (['board', 'shopping'].includes(feature)) {
      let min = 0;
      let max = 0;
      let name = FEATURE_LABELS[feature];
      let sub = '';

      if (feature === 'board') {
        min = max = settings.featureCost.board;
        sub = '게시판 기능 구현';
      } else if (feature === 'shopping') {
        const pCount = featureSelection.productCount || { min: 20, max: 50 };
        min = calculateShoppingCost(pCount.min, settings);
        max = calculateShoppingCost(pCount.max, settings);
        name += ` (상품 ${pCount.min}~${pCount.max}개)`;
        sub = '쇼핑몰 결제 및 상품 관리 기능';
      }

      items.push({
        ...createNewItem(),
        id: `auto-feature-${feature}`,
        description: `기능 추가: ${name}`,
        subItems: [sub],
        quantity: 1,
        unitPrice: min,
        maxPrice: max,
      });
    }
  });

  // 3. 특이사항 → 별도 상담 항목 생성
  specialNotes.forEach((note) => {
    // renewal은 이미 페이지 비용 항목의 subItem으로 포함되므로 제외
    if (note === 'renewal') return;

    const config = SPECIAL_NOTE_ITEM_CONFIG[note];
    if (config) {
      items.push({
        ...createNewItem(),
        id: `auto-special-${note}`,
        description: config.description,
        subItems: config.subItems,
        quantity: 1,
        unitPrice: 0,
        inputType: 'text',
        textValue: '별도 상담',
      });
    }
  });

  // 4. 서버 확정 시 항목 생성
  if (data.serverOption?.status === 'confirmed' && data.serverOption.years) {
    const serverCost = getServerCost(data.serverOption.years, settings);
    items.push({
      ...createNewItem(),
      id: 'auto-server',
      description: `서버 유지관리 (${data.serverOption.years}년)`,
      subItems: ['웹호스팅 및 서버 관리'],
      quantity: 1,
      unitPrice: serverCost,
    });
  }

  // 5. 도메인 확정 시 항목 생성
  if (data.domainOption?.status === 'confirmed') {
    const years = data.domainOption.years || 1;
    const isTransfer = data.domainOption.type === 'transfer';
    const domainCost = calculateDomainCost(years, isTransfer, settings);
    const typeText = isTransfer ? '이전' : '신규 등록';
    items.push({
      ...createNewItem(),
      id: 'auto-domain',
      description: `도메인 ${typeText} (${years}년)`,
      subItems: isTransfer ? ['기존 도메인 이전 작업 포함'] : ['도메인 등록 및 설정'],
      quantity: 1,
      unitPrice: domainCost,
    });
  }

  return items;
}

