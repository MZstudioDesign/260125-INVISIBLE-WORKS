// Quote Submit API Route - Simplified Version
// POST /api/quote/submit
// 
// Uses Google Sheets as the only data store

import { NextRequest, NextResponse } from 'next/server';
import { appendInquiryToSheet } from '@/infrastructure/services/GoogleSheetsService';
import { sendNewInquiryNotification } from '@/infrastructure/services/EmailService';
import { calculateEstimatedPrice } from '@/infrastructure/services/PricingService';

// Generate unique quote number
function generateQuoteNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `IW-${timestamp}-${random}`;
}

// Validation
interface ValidationResult {
    valid: boolean;
    errors: string[];
}

function validateInput(body: any): ValidationResult {
    const errors: string[] = [];

    if (!body.clientName || typeof body.clientName !== 'string' || body.clientName.trim().length === 0) {
        errors.push('clientName is required');
    }

    if (!body.contactMethod || !['email', 'sms', 'phone'].includes(body.contactMethod)) {
        errors.push('contactMethod must be one of: email, sms, phone');
    }

    if (body.contactMethod === 'email' && !body.clientEmail) {
        errors.push('clientEmail is required when contactMethod is email');
    }
    if ((body.contactMethod === 'sms' || body.contactMethod === 'phone') && !body.clientPhone) {
        errors.push('clientPhone is required when contactMethod is sms or phone');
    }

    if (!body.screenBlocks || typeof body.screenBlocks.min !== 'number' || typeof body.screenBlocks.max !== 'number') {
        errors.push('screenBlocks with min and max numbers is required');
    }

    if (!body.uiuxStyle || !['normal', 'fancy'].includes(body.uiuxStyle)) {
        errors.push('uiuxStyle must be one of: normal, fancy');
    }

    return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate
        const validation = validateInput(body);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.errors },
                { status: 400 }
            );
        }

        // Generate quote number
        const quoteNumber = generateQuoteNumber();

        // Calculate price
        const estimate = calculateEstimatedPrice({
            screenBlocks: body.screenBlocks,
            uiuxStyle: body.uiuxStyle,
            features: body.features || [],
        });

        // Prepare inquiry data
        const inquiry = {
            client_name: body.clientName.trim(),
            client_phone: body.clientPhone?.trim() || '',
            client_email: body.clientEmail?.trim().toLowerCase() || '',
            contact_method: body.contactMethod,
            screen_blocks: body.screenBlocks,
            uiux_style: body.uiuxStyle,
            features: body.features || [],
            special_notes: body.specialNotes || [],
            server_option: body.serverOption || { status: 'pending' },
            domain_option: body.domainOption || { status: 'pending' },
            quote_number: quoteNumber,
            estimated_price_min: estimate.min,
            estimated_price_max: estimate.max,
            status: 'pending' as const,
        };

        // Save to Google Sheets (primary data store)
        await appendInquiryToSheet(inquiry);

        // Send admin notification (fire and forget)
        sendNewInquiryNotification(inquiry).catch(e => console.error('Admin notification failed:', e));

        return NextResponse.json({
            success: true,
            quoteNumber,
            estimatedPrice: {
                min: estimate.min,
                max: estimate.max,
                formatted: `${estimate.min.toLocaleString()}원 ~ ${estimate.max.toLocaleString()}원`,
            },
            message: '문의가 접수되었습니다.',
        });

    } catch (error) {
        console.error('Quote submission failed:', error);
        const message = error instanceof Error ? error.message : 'Unexpected error';

        return NextResponse.json(
            {
                success: false,
                error: '문의 접수 중 오류가 발생했습니다.',
                details: process.env.NODE_ENV === 'development' ? message : undefined,
            },
            { status: 500 }
        );
    }
}
