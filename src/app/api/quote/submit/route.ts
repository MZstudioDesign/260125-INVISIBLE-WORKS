// Quote Submit API Route
// POST /api/quote/submit
//
// Uses Google Sheets as the primary data store
// Sends notifications via KakaoTalk (AlimTalk), SMS, or Email

import { NextRequest, NextResponse } from 'next/server';
import { appendInquiryToSheet } from '@/infrastructure/services/GoogleSheetsService';
import { generateQuoteNumber, QuoteSubmission } from '@/domain/entities/QuoteSubmission';
import { sendNewInquiryNotification, sendReceptionConfirmationEmail } from '@/infrastructure/services/EmailService';
import { sendReceptionNotification, isKakaoConfigured } from '@/infrastructure/services/KakaoService';

// Validation
interface ValidationResult {
    valid: boolean;
    errors: string[];
}

function validateInput(body: any): ValidationResult {
    const errors: string[] = [];

    // Client Name (Usually Industry or Company Name from frontend)
    if (!body.clientName || typeof body.clientName !== 'string' || body.clientName.trim().length === 0) {
        errors.push('clientName is required');
    }

    // Contact Method
    if (!body.contactMethod || !['email', 'sms', 'kakao'].includes(body.contactMethod)) {
        errors.push('contactMethod must be one of: email, sms, kakao');
    }

    if (body.contactMethod === 'email' && !body.clientEmail) {
        errors.push('clientEmail is required when contactMethod is email');
    }
    if ((body.contactMethod === 'sms' || body.contactMethod === 'kakao') && !body.clientPhone) {
        errors.push('clientPhone is required when contactMethod is sms or kakao');
    }

    // New Fields Validation
    if (!body.industry) errors.push('industry is required');
    if (!body.purpose) errors.push('purpose is required');
    if (!body.currentAssets || !Array.isArray(body.currentAssets)) errors.push('currentAssets array is required');
    if (!body.hasQuote) errors.push('hasQuote is required');

    return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Honeypot check
        if (body._gotcha && body._gotcha.trim() !== '') {
            console.log('[AntiSpam] Honeypot triggered');
            return NextResponse.json({
                success: true,
                quoteNumber: 'IW-BLOCKED',
                message: '문의가 접수되었습니다.',
            });
        }

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

        // Calculate price (Optional, use defaults if not provided)
        const screenBlocks = body.screenBlocks || { min: 1, max: 15 };
        const uiuxStyle = body.uiuxStyle || 'normal';

        // Prepare inquiry data matching QuoteSubmission interface
        const inquiry: QuoteSubmission = {
            // Contact Form Data
            client_name: body.clientName.trim(),
            client_phone: body.clientPhone?.trim() || '',
            client_email: body.clientEmail?.trim().toLowerCase() || '',
            contact_method: body.contactMethod,

            industry: body.industry,
            industry_custom: body.industryCustom,
            purpose: body.purpose,
            preferred_color: body.preferredColor || 'auto',
            tone_and_manner: body.toneAndManner || 'auto',
            current_assets: body.currentAssets,
            has_quote: body.hasQuote,
            additional_links: body.additionalLinks || [],
            additional_note: body.additionalNote || '',

            // Project Info (Optional/Defaults)
            screen_blocks: screenBlocks,
            uiux_style: uiuxStyle,
            features: body.features || [],
            special_notes: body.specialNotes || [],
            server_option: body.serverOption || { status: 'pending' },
            domain_option: body.domainOption || { status: 'pending' },

            // Generated Data
            quote_number: quoteNumber,
            status: 'pending',
        };

        // Save to Google Sheets
        await appendInquiryToSheet(inquiry);
        console.log('[QuoteSubmit] Saved to Google Sheets:', quoteNumber);

        // Send Notifications (Fire and forget)
        (async () => {
            try {
                // 1. Send Admin Notification (Email)
                await sendNewInquiryNotification(inquiry);
                console.log('[QuoteSubmit] Admin notification sent');

                // 2. Send Client Confirmation
                if (inquiry.contact_method === 'email' && inquiry.client_email) {
                    await sendReceptionConfirmationEmail({
                        to: inquiry.client_email,
                        clientName: inquiry.client_name,
                        quoteNumber: inquiry.quote_number,
                    });
                    console.log('[QuoteSubmit] Client email confirmation sent');
                } else if (['sms', 'kakao'].includes(inquiry.contact_method) && inquiry.client_phone) {
                    if (isKakaoConfigured()) {
                        await sendReceptionNotification({
                            to: inquiry.client_phone,
                            clientName: inquiry.client_name,
                        });
                        console.log('[QuoteSubmit] Client Kakao/SMS confirmation sent');
                    }
                }
            } catch (notifyError) {
                console.error('[QuoteSubmit] Notification failed:', notifyError);
            }
        })();

        return NextResponse.json({
            success: true,
            quoteNumber,
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
