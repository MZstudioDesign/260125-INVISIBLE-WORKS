// GET /api/config/quote-settings
// Returns quote settings from Google Sheet2 (Admin Config)

import { NextResponse } from 'next/server';
import { getQuoteSettingsFromSheet, RawQuoteConfig } from '@/infrastructure/services/GoogleSheetsService';
import { QuoteSettings, DEFAULT_SETTINGS } from '@/lib/quote/settings';

// Server-side cache
let cachedSettings: QuoteSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Parse raw config from Sheet2 into QuoteSettings
 */
function parseRawConfig(raw: RawQuoteConfig): QuoteSettings {
    const getNumber = (key: string, fallback: number): number => {
        const value = raw[key];
        if (value === undefined) return fallback;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? fallback : parsed;
    };

    const getString = (key: string, fallback: string): string => {
        return raw[key] ?? fallback;
    };

    return {
        pageCost: {
            tiers: [
                { min: 1, max: 15, cost: getNumber('page_cost_1_15', DEFAULT_SETTINGS.pageCost.tiers[0].cost) },
                { min: 15, max: 30, cost: getNumber('page_cost_15_30', DEFAULT_SETTINGS.pageCost.tiers[1].cost) },
                { min: 30, max: 45, cost: getNumber('page_cost_30_45', DEFAULT_SETTINGS.pageCost.tiers[2].cost) },
            ],
            extraPerTwo: getNumber('page_cost_extra', DEFAULT_SETTINGS.pageCost.extraPerTwo),
        },
        uiuxMultiplier: {
            normal: getNumber('uiux_normal', DEFAULT_SETTINGS.uiuxMultiplier.normal),
            fancy: getNumber('uiux_fancy', DEFAULT_SETTINGS.uiuxMultiplier.fancy),
        },
        featureCost: {
            board: getNumber('feature_board', DEFAULT_SETTINGS.featureCost.board),
            shopping: getNumber('feature_shopping', DEFAULT_SETTINGS.featureCost.shopping),
            productExtra: getNumber('feature_product_extra', DEFAULT_SETTINGS.featureCost.productExtra),
            productBase: getNumber('feature_product_base', DEFAULT_SETTINGS.featureCost.productBase),
        },
        serverCost: {
            year1: getNumber('server_1year', DEFAULT_SETTINGS.serverCost.year1),
            year2: getNumber('server_2year', DEFAULT_SETTINGS.serverCost.year2),
            year3: getNumber('server_3year', DEFAULT_SETTINGS.serverCost.year3),
        },
        domainCost: {
            perYear: getNumber('domain_per_year', DEFAULT_SETTINGS.domainCost.perYear),
            transfer: getNumber('domain_transfer', DEFAULT_SETTINGS.domainCost.transfer),
        },
        revisionCost: {
            contentRevision: getNumber('revision_content', DEFAULT_SETTINGS.revisionCost.contentRevision),
            layoutRevision: getNumber('revision_layout', DEFAULT_SETTINGS.revisionCost.layoutRevision),
        },
        companyInfo: {
            name: getString('company_name', DEFAULT_SETTINGS.companyInfo.name),
            representative: getString('company_rep', DEFAULT_SETTINGS.companyInfo.representative),
            businessNumber: getString('company_biznum', DEFAULT_SETTINGS.companyInfo.businessNumber),
            email: getString('company_email', DEFAULT_SETTINGS.companyInfo.email),
            address: getString('company_address', DEFAULT_SETTINGS.companyInfo.address),
            website: getString('company_website', DEFAULT_SETTINGS.companyInfo.website),
        },
        bankInfo: {
            bankName: getString('bank_name', DEFAULT_SETTINGS.bankInfo.bankName),
            accountNumber: getString('bank_account', DEFAULT_SETTINGS.bankInfo.accountNumber),
            accountHolder: getString('bank_holder', DEFAULT_SETTINGS.bankInfo.accountHolder),
        },
        customFields: DEFAULT_SETTINGS.customFields,
    };
}

export async function GET() {
    try {
        const now = Date.now();

        // Return cached if valid
        if (cachedSettings && (now - cacheTimestamp) < CACHE_TTL_MS) {
            return NextResponse.json({
                success: true,
                data: cachedSettings,
                cachedAt: new Date(cacheTimestamp).toISOString(),
                fromCache: true,
            });
        }

        // Fetch from Sheet2
        const rawConfig = await getQuoteSettingsFromSheet();
        const settings = parseRawConfig(rawConfig);

        // Update cache
        cachedSettings = settings;
        cacheTimestamp = now;

        return NextResponse.json({
            success: true,
            data: settings,
            cachedAt: new Date(cacheTimestamp).toISOString(),
            fromCache: false,
        });
    } catch (error) {
        console.error('[API] Failed to get quote settings:', error);

        // Return default settings as fallback
        return NextResponse.json({
            success: true,
            data: DEFAULT_SETTINGS,
            cachedAt: null,
            fromCache: false,
            fallback: true,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
