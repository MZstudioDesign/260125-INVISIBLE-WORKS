// Email Service - Infrastructure Layer
// Uses Nodemailer with Gmail OAuth2

import nodemailer from 'nodemailer';
import { QuoteSubmission } from '@/domain/entities/QuoteSubmission';

// Create OAuth2 transporter for Gmail
async function createTransporter() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const senderEmail = process.env.GMAIL_SENDER_EMAIL || 'invisibleworks.office@gmail.com';

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Gmail OAuth2 credentials not configured. Set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: senderEmail,
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
        invisibleworks.co
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Invisible Works" <${process.env.GMAIL_SENDER_EMAIL || 'invisibleworks.office@gmail.com'}>`,
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
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">업종</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.industry} ${inquiry.industry_custom ? `(${inquiry.industry_custom})` : ''}</td>
        </tr>
         <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">목적</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.purpose}</td>
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
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">보유 항목</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">${inquiry.current_assets.join(', ')}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">추가 링크</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">
             ${inquiry.additional_links?.map(l => `[${l.type}] <a href="${l.url}">${l.url}</a>`).join('<br>') || '-'}
          </td>
        </tr>
         <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">요청 사항</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">
             ${inquiry.additional_note || '-'}
             ${inquiry.special_notes?.length ? `<br><br>특이사항: ${inquiry.special_notes.join(', ')}` : ''}
          </td>
        </tr>

        ${inquiry.estimated_price_min ? `
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600;">예상 금액</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb; color: #1e3a8a; font-weight: 600;">
            ${inquiry.estimated_price_min.toLocaleString()}원 ~ ${inquiry.estimated_price_max?.toLocaleString()}원
          </td>
        </tr>
        ` : ''}
      </table>
      <p style="margin-top: 16px; color: #6b7280; font-size: 14px;">
        지금 관리자 페이지나 시트에서 확인해보세요.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Quote System" <${process.env.GMAIL_SENDER_EMAIL || 'invisibleworks.office@gmail.com'}>`,
    to: process.env.GMAIL_SENDER_EMAIL || 'invisibleworks.office@gmail.com',
    subject: `[새 문의] ${inquiry.client_name}님 - ${inquiry.quote_number}`,
    html: htmlContent,
  });
}

/**
 * Send reception confirmation to client (for email contact method)
 */
export async function sendReceptionConfirmationEmail(params: {
  to: string;
  clientName: string;
  quoteNumber: string;
}): Promise<void> {
  const transporter = await createTransporter();

  const htmlContent = `
    <div style="font-family: 'Pretendard', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin: 0;">INVISIBLE WORKS</h1>
      </div>

      <h2 style="color: #1e3a8a; margin-bottom: 16px;">안녕하세요, ${params.clientName}님!</h2>

      <p style="line-height: 1.8; color: #374151; font-size: 16px;">
        요청하신 견적이 정상적으로 시스템에 등록되었습니다. 😊
      </p>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; color: #374151;">
          <strong>견적 번호:</strong> ${params.quoteNumber}
        </p>
      </div>

      <p style="line-height: 1.8; color: #374151; font-size: 16px;">
        1시간 이내로 상세한 견적서를 보내드리겠습니다.<br>
        궁금한 점이 있으시면 언제든 답장해 주세요.
      </p>

      <p style="line-height: 1.8; color: #374151; font-size: 16px;">
        감사합니다!
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        <strong style="color: #1e3a8a;">Invisible Works</strong><br>
        <a href="https://invisibleworks.co" style="color: #1e3a8a;">invisibleworks.co</a>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Invisible Works" <${process.env.GMAIL_SENDER_EMAIL || 'invisibleworks.office@gmail.com'}>`,
    to: params.to,
    subject: `[Invisible Works] 견적 요청이 접수되었습니다 - ${params.quoteNumber}`,
    html: htmlContent,
  });
}
