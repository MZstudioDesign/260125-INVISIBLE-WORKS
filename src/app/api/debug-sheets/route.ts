// Debug API - Check Google Sheets connection
// GET /api/debug-sheets

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
    try {
        const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        // Check environment variables
        if (!email) {
            return NextResponse.json({ error: 'GOOGLE_SERVICE_ACCOUNT_EMAIL not set' }, { status: 500 });
        }
        if (!privateKey) {
            return NextResponse.json({ error: 'GOOGLE_PRIVATE_KEY not set' }, { status: 500 });
        }
        if (!sheetId) {
            return NextResponse.json({ error: 'GOOGLE_SHEET_ID not set' }, { status: 500 });
        }

        // Try to authenticate
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: email,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        // Try to access the sheet
        const sheets = google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.get({
            spreadsheetId: sheetId,
        });

        // Get all sheet names
        const sheetNames = response.data.sheets?.map(s => s.properties?.title) || [];

        return NextResponse.json({
            success: true,
            sheetTitle: response.data.properties?.title,
            sheetId: sheetId,
            serviceAccount: email,
            availableSheets: sheetNames, // Show all tab names
        });

    } catch (error: any) {
        console.error('Debug sheets error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code,
        }, { status: 500 });
    }
}
