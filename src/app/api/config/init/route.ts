// POST /api/config/init
// Initialize Sheet2 with default quote settings

import { NextResponse } from 'next/server';
import { initializeConfigSheet } from '@/infrastructure/services/GoogleSheetsService';

export async function POST() {
    try {
        await initializeConfigSheet();

        return NextResponse.json({
            success: true,
            message: 'Config sheet initialized with default values',
        });
    } catch (error) {
        console.error('[API] Failed to initialize config sheet:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
