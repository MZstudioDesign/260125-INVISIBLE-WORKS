// Pricing Service - Infrastructure Layer
// Calculates estimated prices based on project parameters

import { PricingRules } from '@/domain/entities/QuoteSubmission';

// Default pricing rules (can be overridden from Supabase settings)
const DEFAULT_PRICING_RULES: PricingRules = {
    base_price_per_block: 50000,
    fancy_multiplier: 1.5,
    feature_prices: {
        board: 200000,      // 게시판
        inquiry: 100000,    // 문의 폼
        login: 300000,      // 로그인/회원가입
        shopping: 500000,   // 쇼핑·결제
        admin: 400000,      // 관리자 페이지
        reservation: 350000 // 예약 기능
    }
};

export interface PriceEstimate {
    min: number;
    max: number;
    breakdown: {
        basePrice: { min: number; max: number };
        featurePrice: number;
        featureDetails: Array<{ name: string; price: number }>;
    };
}

export interface PriceCalculationParams {
    screenBlocks: { min: number; max: number };
    uiuxStyle: 'normal' | 'fancy';
    features: string[];
    pricingRules?: PricingRules;
}

/**
 * Calculate estimated price based on project parameters
 */
export function calculateEstimatedPrice(params: PriceCalculationParams): PriceEstimate {
    const rules = params.pricingRules || DEFAULT_PRICING_RULES;

    // Style multiplier
    const styleMultiplier = params.uiuxStyle === 'fancy' ? rules.fancy_multiplier : 1;

    // Base price calculation (screen blocks * base price * style multiplier)
    const basePrice = {
        min: Math.round(params.screenBlocks.min * rules.base_price_per_block * styleMultiplier),
        max: Math.round(params.screenBlocks.max * rules.base_price_per_block * styleMultiplier),
    };

    // Feature price calculation
    const featureDetails: Array<{ name: string; price: number }> = [];
    let featurePrice = 0;

    for (const feature of params.features) {
        const price = rules.feature_prices[feature] || 0;
        if (price > 0) {
            featureDetails.push({ name: feature, price });
            featurePrice += price;
        }
    }

    return {
        min: basePrice.min + featurePrice,
        max: basePrice.max + featurePrice,
        breakdown: {
            basePrice,
            featurePrice,
            featureDetails,
        },
    };
}

/**
 * Format price for display
 */
export function formatPriceRange(estimate: PriceEstimate): string {
    if (estimate.min === estimate.max) {
        return `${estimate.min.toLocaleString('ko-KR')}원`;
    }
    return `${estimate.min.toLocaleString('ko-KR')}원 ~ ${estimate.max.toLocaleString('ko-KR')}원`;
}

/**
 * Get feature label in Korean
 */
export function getFeatureLabel(feature: string): string {
    const labels: Record<string, string> = {
        board: '게시판',
        inquiry: '문의 폼',
        login: '로그인/회원가입',
        shopping: '쇼핑·결제',
        admin: '관리자 페이지',
        reservation: '예약 기능',
    };
    return labels[feature] || feature;
}
