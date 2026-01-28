// SMS Service - Infrastructure Layer
// Uses Solapi API for Korean SMS delivery

import crypto from 'crypto';

const SOLAPI_API_URL = 'https://api.solapi.com';

/**
 * Generate Solapi authentication headers
 */
function generateSolapiAuth(): Record<string, string> {
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;

    if (!apiKey || !apiSecret) {
        throw new Error('Solapi credentials not configured. Set SOLAPI_API_KEY and SOLAPI_API_SECRET.');
    }

    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');
    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(date + salt)
        .digest('hex');

    return {
        'Authorization': `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        'Content-Type': 'application/json',
    };
}

export interface SendQuoteSMSParams {
    to: string;
    clientName: string;
    quoteNumber: string;
    pdfLink?: string;
    oneDriveLink?: string;
}

/**
 * Send quote notification via SMS (LMS for long messages)
 */
export async function sendQuoteSMS(params: SendQuoteSMSParams): Promise<any> {
    const senderNumber = process.env.SOLAPI_SENDER_NUMBER;

    if (!senderNumber) {
        throw new Error('SOLAPI_SENDER_NUMBER not configured.');
    }

    const message = `[Invisible Works]
${params.clientName}님, 안녕하세요.

문의하신 내용에 대한 예상 견적서를 준비했습니다.

📄 견적서: ${params.pdfLink || '이메일로 발송됨'}
📁 자료 업로드: ${params.oneDriveLink || '추후 안내'}

폴더 내 '자료 전달 방법 안내서.pdf'를 참고해 주세요.

궁금한 점은 언제든 연락 주세요.
감사합니다.`;

    const response = await fetch(`${SOLAPI_API_URL}/messages/v4/send`, {
        method: 'POST',
        headers: generateSolapiAuth(),
        body: JSON.stringify({
            message: {
                to: params.to.replace(/-/g, ''), // Remove hyphens
                from: senderNumber.replace(/-/g, ''),
                text: message,
                type: 'LMS', // Long Message Service for messages > 90 bytes
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`SMS send failed: ${error}`);
    }

    return response.json();
}

/**
 * Send simple notification SMS
 */
export async function sendNotificationSMS(params: {
    to: string;
    message: string;
}): Promise<any> {
    const senderNumber = process.env.SOLAPI_SENDER_NUMBER;

    if (!senderNumber) {
        throw new Error('SOLAPI_SENDER_NUMBER not configured.');
    }

    const messageType = new TextEncoder().encode(params.message).length > 90 ? 'LMS' : 'SMS';

    const response = await fetch(`${SOLAPI_API_URL}/messages/v4/send`, {
        method: 'POST',
        headers: generateSolapiAuth(),
        body: JSON.stringify({
            message: {
                to: params.to.replace(/-/g, ''),
                from: senderNumber.replace(/-/g, ''),
                text: params.message,
                type: messageType,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`SMS send failed: ${error}`);
    }

    return response.json();
}
