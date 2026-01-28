// Email Service - Infrastructure Layer
// Uses Nodemailer with Gmail OAuth2

import nodemailer from 'nodemailer';
import { QuoteSubmission } from '@/domain/entities/QuoteSubmission';

// Create OAuth2 transporter for Gmail
async function createTransporter() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error('Gmail OAuth2 credentials not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN.');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'mzstudio104@gmail.com',
            clientId,
            clientSecret,
            refreshToken,
        },
    });
}

export interface SendQuotePDFParams {
    to: string;
    clientName: string;
    pdfBuffer: Buffer;
    quoteNumber: string;
    introMessage: string;
    oneDriveLink?: string;
}

/**
 * Send quote PDF to client via email
 */
export async function sendQuotePDFEmail(params: SendQuotePDFParams): Promise<void> {
    const transporter = await createTransporter();

    const htmlContent = `
    <div style="font-family: 'Pretendard', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1e3a8a;">안녕하세요, ${params.clientName}님</h2>
      <p style="line-height: 1.8; color: #374151;">${params.introMessage.replace(/\n/g, '<br>')}</p>
      ${params.oneDriveLink ? `
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e3a8a;">
          <p style="margin: 0 0 8px; font-weight: 600;">📁 자료 업로드 폴더:</p>
          <a href="${params.oneDriveLink}" style="color: #1e3a8a; word-break: break-all;">${params.oneDriveLink}</a>
          <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280;">폴더 내 '자료 전달 방법 안내서.pdf'를 참고해 주세요.</p>
        </div>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
      <p style="color: #6b7280; font-size: 14px;">
        감사합니다.<br>
        <strong style="color: #1e3a8a;">Invisible Works</strong><br>
        invisibleworks.studio
      </p>
    </div>
  `;

    await transporter.sendMail({
        from: '"Invisible Works" <mzstudio104@gmail.com>',
        to: params.to,
        subject: `[Invisible Works] 견적서 #${params.quoteNumber}`,
        html: htmlContent,
        attachments: [{
            filename: `quote-${params.quoteNumber}.pdf`,
            content: params.pdfBuffer,
            contentType: 'application/pdf',
        }],
    });
}

/**
 * Send new inquiry notification to admin
 */
export async function sendNewInquiryNotification(inquiry: QuoteSubmission): Promise<void> {
    const transporter = await createTransporter();

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px;">
        🔔 새로운 견적 문의
      </h2>
      <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; width: 30%;">견적번호</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.quote_number}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">고객명</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.client_name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">연락처</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.client_phone || inquiry.client_email || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">연락 방법</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.contact_method}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">스크린 블록</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.screen_blocks.min} ~ ${inquiry.screen_blocks.max}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">UI/UX 스타일</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.uiux_style}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">기능</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.features.join(', ') || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">특이사항</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.special_notes.join(', ') || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">예상 금액</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb; color: #1e3a8a; font-weight: 600;">
            ${inquiry.estimated_price_min.toLocaleString()}원 ~ ${inquiry.estimated_price_max.toLocaleString()}원
          </td>
        </tr>
      </table>
      <p style="margin-top: 16px; color: #6b7280; font-size: 14px;">
        33분 후 자동으로 견적서가 발송됩니다.
      </p>
    </div>
  `;

    await transporter.sendMail({
        from: '"Quote System" <mzstudio104@gmail.com>',
        to: 'mzstudio104@gmail.com',
        subject: `[새 문의] ${inquiry.client_name}님 - ${inquiry.quote_number}`,
        html: htmlContent,
    });
}
