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
        inquiry.preferred_color || '',              // J: 선호색상
        inquiry.tone_and_manner || '',              // K: 톤앤매너
        inquiry.current_assets.join(', '),          // L: 보유항목
        inquiry.has_quote,                          // M: 견적경험
        linksStr,                                   // N: 추가링크
        noteStr,                                    // O: 요청사항
        inquiry.status,                             // P: 상태
    ]];

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${SHEET_TAB}!A:P`,
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
        '선호색상',
        '톤앤매너',
        '보유항목',
        '견적경험',
        '추가링크',
        '요청사항',
        '상태',
    ]];

    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${SHEET_TAB}!A1:P1`,
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
            range: `${SHEET_TAB}!P${rowIndex + 1}`, // Status column is now P
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

    // Update columns N (links) and O (notes)
    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${SHEET_TAB}!N${rowIndex + 1}:O${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[linksStr, noteStr]] },
    });

    console.log('[GoogleSheets] Updated optional fields for:', quoteNumber);
    return true;
}

