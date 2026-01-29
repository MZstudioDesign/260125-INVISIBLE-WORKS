// Quote Update API Route
// PUT /api/quote/update
//
// Updates optional fields (links, notes) for an existing quote

import { NextRequest, NextResponse } from 'next/server';
import { updateInquiryOptionalFields } from '@/infrastructure/services/GoogleSheetsService';

interface UpdateRequestBody {
    quoteNumber: string;
    additionalLinks?: { type: string; customType?: string; url: string }[];
    additionalNote?: string;
}

export async function PUT(request: NextRequest) {
    try {
        const body: UpdateRequestBody = await request.json();

        // Validate quote number
        if (!body.quoteNumber || typeof body.quoteNumber !== 'string') {
            return NextResponse.json(
                { success: false, error: 'quoteNumber is required' },
                { status: 400 }
            );
        }

        // Format links for storage
        const linksStr = body.additionalLinks
            ? body.additionalLinks.map(l => {
                const typeLabel = l.type === 'other' && l.customType ? l.customType : l.type;
                return `[${typeLabel}] ${l.url}`;
            }).join('\n')
            : '';

        // Update the sheet
        const updated = await updateInquiryOptionalFields(
            body.quoteNumber,
            linksStr,
            body.additionalNote || ''
        );

        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'Quote not found or update failed' },
                { status: 404 }
            );
        }

        console.log('[QuoteUpdate] Updated optional fields for:', body.quoteNumber);

        return NextResponse.json({
            success: true,
            message: 'Optional fields updated successfully',
        });

    } catch (error) {
        console.error('Quote update failed:', error);
        const message = error instanceof Error ? error.message : 'Unexpected error';

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update quote',
                details: process.env.NODE_ENV === 'development' ? message : undefined,
            },
            { status: 500 }
        );
    }
}
