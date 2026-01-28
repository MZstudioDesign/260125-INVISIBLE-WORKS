// Google Sheets Service - Infrastructure Layer
// Uses Google Sheets API v4 with Service Account

import { google } from 'googleapis';
import { QuoteSubmission } from '@/domain/entities/QuoteSubmission';

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

    const values = [[
        dateStr,                                    // A: 날짜
        timeStr,                                    // B: 시간
        inquiry.quote_number,                       // C: 견적번호
        inquiry.client_name,                        // D: 고객명
        inquiry.client_phone || '',                 // E: 전화번호
        inquiry.client_email || '',                 // F: 이메일
        inquiry.contact_method,                     // G: 연락방법
        `${inquiry.screen_blocks.min}~${inquiry.screen_blocks.max}`, // H: 스크린블록
        inquiry.uiux_style,                         // I: UI/UX스타일
        inquiry.features.join(', '),                // J: 기능
        inquiry.special_notes.join(', '),           // K: 특이사항
        `${inquiry.estimated_price_min.toLocaleString()}원 ~ ${inquiry.estimated_price_max.toLocaleString()}원`, // L: 예상금액
        inquiry.status,                             // M: 상태
    ]];

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet1!A:M',
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
        '스크린블록',
        'UI/UX스타일',
        '기능',
        '특이사항',
        '예상금액',
        '상태',
    ]];

    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Sheet1!A1:M1',
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
        range: 'Sheet1!C:C', // Quote number column
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === quoteNumber);

    if (rowIndex > 0) { // Skip header row
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `Sheet1!M${rowIndex + 1}`, // Status column
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[newStatus]] },
        });
    }
}
