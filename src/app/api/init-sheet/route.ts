// Initialize Sheet Headers API
// GET /api/init-sheet - Run once to set up column headers

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || '시트1';

export async function GET() {
    try {
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!email || !privateKey || !sheetId) {
            return NextResponse.json({ error: 'Google credentials not configured' }, { status: 500 });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: email,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

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
            '예상금액',
        ]];

        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${SHEET_TAB}!A1:O1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: headers },
        });

        return NextResponse.json({
            success: true,
            message: 'Sheet headers initialized successfully',
            sheetTab: SHEET_TAB,
            columns: headers[0],
        });
    } catch (error: any) {
        console.error('Sheet init failed:', error);
        console.error('Target Sheet Tab:', SHEET_TAB);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                targetTab: SHEET_TAB,
                details: error.response?.data?.error,
            },
            { status: 500 }
        );
    }
}
