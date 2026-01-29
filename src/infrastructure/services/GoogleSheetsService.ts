// Google Sheets Service - Infrastructure Layer
// Uses Google Sheets API v4 with Service Account

import { google } from 'googleapis';
import { QuoteSubmission } from '@/domain/entities/QuoteSubmission';

// Sheet tab name (Korean: 시트1)
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || '시트1';

// Create authenticated Sheets client
async function getSheetsClient() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!email || !privateKey || !sheetId) {
        throw new Error('Google Sheets credentials not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID.');
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: email,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return {
        sheets: google.sheets({ version: 'v4', auth }),
        sheetId,
    };
}

/**
 * Append quote inquiry to Google Sheet
 */
export async function appendInquiryToSheet(inquiry: QuoteSubmission): Promise<void> {
    const { sheets, sheetId } = await getSheetsClient();

    const now = new Date();
    const dateStr = now.toLocaleDateString('ko-KR');
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    // Format new fields
    const industryStr = inquiry.industry_custom
        ? `${inquiry.industry} (${inquiry.industry_custom})`
        : inquiry.industry;

    const linksStr = inquiry.additional_links
        ? inquiry.additional_links.map(l => `[${l.type}] ${l.url}`).join('\n')
        : '';

    const noteStr = [
        inquiry.additional_note,
        ...(inquiry.special_notes || [])
    ].filter(Boolean).join('\n');



    const values = [[
        dateStr,                                    // A: 날짜
        timeStr,                                    // B: 시간
        inquiry.quote_number,                       // C: 견적번호
        inquiry.client_name,                        // D: 고객명
        inquiry.client_phone || '',                 // E: 전화번호
        inquiry.client_email || '',                 // F: 이메일
        inquiry.contact_method,                     // G: 연락방법
        industryStr,                                // H: 업종
        inquiry.purpose,                            // I: 목적
        inquiry.current_assets.join(', '),          // J: 보유항목
        inquiry.has_quote,                          // K: 견적경험
        linksStr,                                   // L: 추가링크
        noteStr,                                    // M: 요청사항
        inquiry.status,                             // N: 상태
    ]];

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${SHEET_TAB}!A:N`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
    });
}

/**
 * Initialize sheet with headers (run once)
 */
export async function initializeSheetHeaders(): Promise<void> {
    const { sheets, sheetId } = await getSheetsClient();

    const headers = [[
        '날짜',
        '시간',
        '견적번호',
        '고객명',
        '전화번호',
        '이메일',
        '연락방법',
        '업종',
        '목적',
        '보유항목',
        '견적경험',
        '추가링크',
        '요청사항',
        '상태',
    ]];

    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${SHEET_TAB}!A1:N1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: headers },
    });
}

/**
 * Update inquiry status in sheet
 */
export async function updateInquiryStatusInSheet(
    quoteNumber: string,
    newStatus: string
): Promise<void> {
    const { sheets, sheetId } = await getSheetsClient();

    // Find the row with matching quote number
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${SHEET_TAB}!C:C`, // Quote number column
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === quoteNumber);

    if (rowIndex > 0) { // Skip header row
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${SHEET_TAB}!N${rowIndex + 1}`, // Status column is now N
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[newStatus]] },
        });
    }
}

/**
 * Update optional fields (links, notes) for an existing inquiry
 */
export async function updateInquiryOptionalFields(
    quoteNumber: string,
    linksStr: string,
    noteStr: string
): Promise<boolean> {
    const { sheets, sheetId } = await getSheetsClient();

    // Find the row with matching quote number (column C)
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${SHEET_TAB}!C:C`,
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === quoteNumber);

    if (rowIndex <= 0) { // Not found or is header row
        console.log('[GoogleSheets] Quote not found:', quoteNumber);
        return false;
    }

    // Update columns L (links) and M (notes)
    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${SHEET_TAB}!L${rowIndex + 1}:M${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[linksStr, noteStr]] },
    });

    console.log('[GoogleSheets] Updated optional fields for:', quoteNumber);
    return true;
}

// ═══════════════════════════════════════════════════════════════
// Sheet2: Admin Config (Quote Settings)
// ═══════════════════════════════════════════════════════════════

const CONFIG_SHEET_TAB = process.env.GOOGLE_SHEET_CONFIG_TAB || '설정';

// Raw config from Sheet2
export interface RawQuoteConfig {
    [key: string]: string;
}

/**
 * Read quote settings from Sheet2 (Admin Config)
 * Sheet format: Column A = key, Column B = value
 */
export async function getQuoteSettingsFromSheet(): Promise<RawQuoteConfig> {
    const { sheets, sheetId } = await getSheetsClient();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${CONFIG_SHEET_TAB}!A:B`,
        });

        const rows = response.data.values || [];
        const config: RawQuoteConfig = {};

        // Skip header row (index 0), parse key-value pairs
        for (let i = 1; i < rows.length; i++) {
            const [key, value] = rows[i];
            if (key && value !== undefined) {
                config[key.trim()] = value.toString().trim();
            }
        }

        console.log('[GoogleSheets] Loaded config from Sheet2:', Object.keys(config).length, 'keys');
        return config;
    } catch (error) {
        console.error('[GoogleSheets] Failed to load config from Sheet2:', error);
        throw error;
    }
}

/**
 * Initialize Sheet2 with default config headers and values
 */
export async function initializeConfigSheet(): Promise<void> {
    const { sheets, sheetId } = await getSheetsClient();

    const defaultConfig = [
        ['키', '값', '설명'],
        ['page_cost_1_15', '400000', '1~15블록 페이지 비용'],
        ['page_cost_15_30', '500000', '15~30블록 페이지 비용'],
        ['page_cost_30_45', '600000', '30~45블록 페이지 비용'],
        ['page_cost_extra', '30000', '45 초과 시 2페이지당 추가'],
        ['uiux_normal', '1.0', '일반 스타일 배율'],
        ['uiux_fancy', '1.2', '화려한 스타일 배율'],
        ['feature_board', '100000', '게시판 비용'],
        ['feature_shopping', '200000', '쇼핑 기본 비용'],
        ['feature_product_extra', '10000', '상품 추가 비용 (1개당)'],
        ['feature_product_base', '20', '기본 포함 상품 수'],
        ['server_1year', '150000', '서버 1년'],
        ['server_2year', '250000', '서버 2년'],
        ['server_3year', '300000', '서버 3년'],
        ['domain_per_year', '30000', '도메인 연 비용'],
        ['domain_transfer', '30000', '도메인 이전비'],
        ['revision_content', '50000', '콘텐츠 수정 비용'],
        ['revision_layout', '100000', '레이아웃 수정 비용'],
        ['company_name', 'Invisible Works', '회사명'],
        ['company_rep', '오유택', '대표자'],
        ['company_biznum', '377-44-01126', '사업자등록번호'],
        ['company_email', 'invisibleworks.office@gmail.com', '이메일'],
        ['company_address', '대구광역시 중구 남산동 677-58, 명륜로21길 33-11', '주소'],
        ['company_website', 'invisibleworks.co', '웹사이트'],
        ['bank_name', '카카오뱅크', '은행명'],
        ['bank_account', '3333-14-9478697', '계좌번호'],
        ['bank_holder', '오유택(엠지쓰studio)', '예금주'],
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${CONFIG_SHEET_TAB}!A1:C${defaultConfig.length}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: defaultConfig },
    });

    console.log('[GoogleSheets] Initialized config sheet with default values');
}

