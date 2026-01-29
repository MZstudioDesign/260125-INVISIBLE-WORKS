// KakaoService - Infrastructure Layer
// Uses Solapi SDK for Kakao AlimTalk and SMS fallback

import { SolapiMessageService } from 'solapi';

// Environment variables (loaded at runtime to support hot reload)
function getEnvConfig() {
  return {
    apiKey: process.env.SOLAPI_API_KEY,
    apiSecret: process.env.SOLAPI_API_SECRET,
    senderNumber: process.env.SOLAPI_SENDER_NUMBER,
    pfId: process.env.SOLAPI_PF_ID,
    templateReception: process.env.SOLAPI_TEMPLATE_ID_RECEPTION,
    templateDelivery: process.env.SOLAPI_TEMPLATE_ID_DELIVERY,
  };
}

// Template IDs (from BACKEND-PLAN.md)
// Reception: KA01TP260129080638834BvwT8r0XZTt
// Delivery: KA01TP260129080552372jBUT7B3KgbW

/**
 * Get Solapi message service instance
 */
function getMessageService(): SolapiMessageService {
  const config = getEnvConfig();
  if (!config.apiKey || !config.apiSecret) {
    throw new Error('Solapi credentials not configured. Set SOLAPI_API_KEY and SOLAPI_API_SECRET.');
  }
  return new SolapiMessageService(config.apiKey, config.apiSecret);
}

/**
 * Validate required environment variables
 */
function validateKakaoConfig(): { senderNumber: string; pfId: string; templateReception: string; templateDelivery: string } {
  const config = getEnvConfig();
  if (!config.senderNumber) {
    throw new Error('SOLAPI_SENDER_NUMBER not configured.');
  }
  if (!config.pfId) {
    throw new Error('SOLAPI_PF_ID (Kakao Channel ID) not configured.');
  }
  if (!config.templateReception) {
    throw new Error('SOLAPI_TEMPLATE_ID_RECEPTION not configured.');
  }
  if (!config.templateDelivery) {
    throw new Error('SOLAPI_TEMPLATE_ID_DELIVERY not configured.');
  }
  return {
    senderNumber: config.senderNumber,
    pfId: config.pfId,
    templateReception: config.templateReception,
    templateDelivery: config.templateDelivery,
  };
}

/**
 * Clean phone number (remove hyphens)
 */
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/-/g, '');
}

// ============================================
// AlimTalk Interfaces
// ============================================

export interface SendReceptionNotificationParams {
  to: string;
  clientName: string;
}

export interface SendQuoteDeliveryParams {
  to: string;
  clientName: string;
  price: string; // e.g., "400,000원 ~ 500,000원"
  validity: string; // e.g., "발송일로부터 7일"
  quoteUrl: string; // e.g., "quote/IW-ABC123"
}

export interface AlimTalkResult {
  success: boolean;
  messageId?: string;
  fallbackUsed?: boolean;
  error?: string;
}

// ============================================
// AlimTalk Sending Functions
// ============================================

/**
 * Send reception notification via AlimTalk (Template 1)
 * Automatically falls back to SMS if AlimTalk fails
 *
 * Template content:
 * [접수 완료 안내 문자]
 * INVISIBLE WORKS
 * 요청하신 견적이 정상적으로 시스템에 등록되었습니다. (방긋)
 * 1시간 이내로 연락드리겠습니다.
 * 감사합니다!
 */
export async function sendReceptionNotification(
  params: SendReceptionNotificationParams
): Promise<AlimTalkResult> {
  const config = validateKakaoConfig();
  const messageService = getMessageService();
  const cleanedPhone = cleanPhoneNumber(params.to);

  try {
    // Send AlimTalk with SMS fallback enabled
    // Solapi SDK v5.x uses array directly, not {messages: [...]}
    const result = await messageService.send([
      {
        to: cleanedPhone,
        from: cleanPhoneNumber(config.senderNumber),
        kakaoOptions: {
          pfId: config.pfId,
          templateId: config.templateReception,
          disableSms: false, // Enable SMS fallback
        },
      },
    ]);

    console.log('[KakaoService] Reception notification sent:', result);

    return {
      success: true,
      messageId: result?.groupInfo?.groupId,
      fallbackUsed: false,
    };
  } catch (error) {
    console.error('[KakaoService] AlimTalk failed, attempting SMS fallback:', error);

    // SMS Fallback
    return sendFallbackSMS({
      to: params.to,
      message: `[Invisible Works] ${params.clientName}님, 견적 요청이 정상적으로 접수되었습니다. 1시간 이내로 연락드리겠습니다. 감사합니다!`,
    });
  }
}

/**
 * Send quote delivery notification via AlimTalk (Template 2)
 * Automatically falls back to SMS if AlimTalk fails
 *
 * Template content:
 * [견적 안내문]
 * INVISIBLE WORKS
 * 기다려주셔서 감사합니다. (방긋)
 * 요청하신 견적서 작성이 완료되었습니다.
 * 아래 버튼을 눌러 상세 견적 내용을 확인해보세요.
 * ◼ 견적금액 : #{price}
 * ◼ 유효기간 : #{validity}
 */
export async function sendQuoteDeliveryNotification(
  params: SendQuoteDeliveryParams
): Promise<AlimTalkResult> {
  const config = validateKakaoConfig();
  const messageService = getMessageService();
  const cleanedPhone = cleanPhoneNumber(params.to);

  try {
    // Send AlimTalk with variables
    const result = await messageService.send([
      {
        to: cleanedPhone,
        from: cleanPhoneNumber(config.senderNumber),
        kakaoOptions: {
          pfId: config.pfId,
          templateId: config.templateDelivery,
          variables: {
            '#{price}': params.price,
            '#{validity}': params.validity,
            '#{url}': params.quoteUrl,
          },
          disableSms: false, // Enable SMS fallback
        },
      },
    ]);

    console.log('[KakaoService] Quote delivery notification sent:', result);

    return {
      success: true,
      messageId: result?.groupInfo?.groupId,
      fallbackUsed: false,
    };
  } catch (error) {
    console.error('[KakaoService] AlimTalk failed, attempting SMS fallback:', error);

    // SMS Fallback
    return sendFallbackSMS({
      to: params.to,
      message: `[Invisible Works] ${params.clientName}님, 견적서가 준비되었습니다.\n\n견적금액: ${params.price}\n유효기간: ${params.validity}\n\n확인하기: https://invisibleworks.co/${params.quoteUrl}`,
    });
  }
}

// ============================================
// SMS Fallback
// ============================================

interface FallbackSMSParams {
  to: string;
  message: string;
}

/**
 * Send SMS as fallback when AlimTalk fails
 */
async function sendFallbackSMS(params: FallbackSMSParams): Promise<AlimTalkResult> {
  const config = getEnvConfig();
  if (!config.senderNumber) {
    return { success: false, fallbackUsed: true, error: 'SOLAPI_SENDER_NUMBER not configured' };
  }

  const messageService = getMessageService();
  const cleanedPhone = cleanPhoneNumber(params.to);

  // Determine message type based on length (LMS for > 90 bytes)
  const messageBytes = new TextEncoder().encode(params.message).length;
  const messageType = messageBytes > 90 ? 'LMS' : 'SMS';

  try {
    const result = await messageService.send([
      {
        to: cleanedPhone,
        from: cleanPhoneNumber(config.senderNumber),
        text: params.message,
        type: messageType,
      },
    ]);

    console.log('[KakaoService] Fallback SMS sent:', result);

    return {
      success: true,
      messageId: result?.groupInfo?.groupId,
      fallbackUsed: true,
    };
  } catch (error) {
    console.error('[KakaoService] Fallback SMS also failed:', error);

    return {
      success: false,
      fallbackUsed: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if Kakao service is properly configured
 */
export function isKakaoConfigured(): boolean {
  const config = getEnvConfig();
  return !!(
    config.apiKey &&
    config.apiSecret &&
    config.senderNumber &&
    config.pfId &&
    config.templateReception &&
    config.templateDelivery
  );
}

/**
 * Format price for template variable
 */
export function formatPriceForTemplate(min: number, max: number): string {
  if (min === 0 && max === 0) {
    return '별도 상담 필요';
  }
  if (min === 0) {
    return '0원 (무료)';
  }
  if (min === max) {
    return `${min.toLocaleString()}원`;
  }
  return `${min.toLocaleString()}원 ~ ${max.toLocaleString()}원`;
}

/**
 * Get default validity string
 */
export function getDefaultValidity(): string {
  return '발송일로부터 7일';
}
