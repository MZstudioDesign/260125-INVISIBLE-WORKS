import {
  QuoteData,
  QuoteLanguage,
  calculateSubtotal,
  calculateVAT,
  calculateTotal,
  calculateItemTotal,
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
} from '@/lib/quote/types';
import { getServerOptionsText, getDomainOptionsText, formatWon, generateEstimateQuoteItems, DEFAULT_SETTINGS, getCompanyInfo, getBankInfo } from '@/lib/quote/settings';
import { getTranslations, formatCurrencyByLanguage, formatDateByLanguage } from '@/lib/quote/translations';
import { getPageInfo } from '@/lib/quote/pagination';

// Helper for multi-line currency with language support
function MultiLineCurrency({
  amount,
  isTotal = false,
  language = 'ko'
}: {
  amount: number | { min: number; max: number };
  isTotal?: boolean;
  language?: QuoteLanguage;
}) {
  if (typeof amount === 'number') {
    return <>{formatCurrencyByLanguage(amount, language)}</>;
  }
  if (amount.min === amount.max) {
    return <>{formatCurrencyByLanguage(amount.min, language)}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.3 }}>
      <span>{formatCurrencyByLanguage(amount.min, language)}</span>
      <span style={{ fontSize: isTotal ? '12px' : '9px', color: '#666' }}>~ {formatCurrencyByLanguage(amount.max, language)}</span>
    </div>
  );
}

interface TemplateProps {
  data: QuoteData;
  pageNumber?: number;
  language?: QuoteLanguage;
}

/**
 * 간단 견적서 템플릿
 * - 모노톤 블랙 & 화이트
 * - 프로젝트 정보 기반 자동 항목 + 수동 항목 합산
 * - 범위 견적 지원
 * - 다국어 지원 (한글/영어)
 */
export function SimpleQuote({ data, pageNumber = 1, language = 'ko' }: TemplateProps) {
  // Get translations
  const t = getTranslations(language);

  // 1. 자동 견적 항목 생성 (with Language)
  const estimateItems = generateEstimateQuoteItems(data, DEFAULT_SETTINGS, language);

  // 2. 수동 입력 항목 (description이 있는 것만)
  const manualItems = data.items.filter(item => item.description.trim() !== '');

  // 3. 합치기
  const allItems = [...estimateItems, ...manualItems];

  // Localized Info
  const companyInfo = getCompanyInfo(language, {
    name: data.companyName,
    representative: data.companyRepresentative,
    businessNumber: data.companyBusinessNumber,
    email: data.companyEmail,
    address: data.companyAddress,
    website: data.companyWebsite,
  });

  const bankInfo = getBankInfo(language, {
    bankName: data.bankName,
    accountNumber: data.bankAccountNumber,
    accountHolder: data.bankAccountName,
  });

  const subtotal = calculateSubtotal(allItems);

  // Pagination
  // SimpleQuote has a smaller footer (just page num & company info), so we can use less padding (e.g., 80px)
  // compared to DetailedQuote which requires ~180px.
  const pageInfo = getPageInfo(allItems, pageNumber, false, 80);
  const { items: pageItems, showTotals, totalPages } = pageInfo;

  const pageItem = allItems.find(item => item.id === 'auto-page-cost');
  const baseCost = pageItem ? { min: pageItem.unitPrice, max: pageItem.maxPrice || pageItem.unitPrice } : { min: 0, max: 0 };

  // 4. percent 항목 금액 계산 함수
  const getPercentAmount = (ratio: number) => ({
    min: Math.round(baseCost.min * ratio / 100),
    max: Math.round(baseCost.max * ratio / 100),
  });

  // 5. 합계 계산 (범위 지원 + percent 반영)
  // Subtotal is calculated above using calculateSubtotal(allItems)

  const vat = calculateVAT(subtotal, data.vatRate);
  const total = calculateTotal(subtotal, vat);

  // 스타일 변수 - 모노톤 블랙/화이트
  const primaryColor = '#000000';
  const mutedColor = '#666666';
  const borderColor = '#e5e5e5';

  return (
    <div
      style={{
        width: `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        backgroundColor: '#ffffff',
        fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        color: '#1a1a1a',
        padding: '40px 48px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          HEADER: 로고 + 타이틀 + 번호
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
        }}
      >
        {/* 좌측: 로고 */}
        <div style={{ height: '48px' }}>
          <img
            src="/user_source/logo/logo-black.png"
            alt="Invisible Works"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* 우측: 견적서 타이틀 + 번호 */}
        <div style={{ textAlign: 'right' }}>
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 800,
              color: primaryColor,
              margin: 0,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {t.title}
          </h1>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: mutedColor,
              display: 'block',
              marginTop: '8px',
            }}
          >
            {t.quoteNumber} {data.quoteNumber.padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DATE + VALID UNTIL
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: mutedColor,
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <span>{t.issueDate}: {formatDateByLanguage(data.date, language) || (language === 'ko' ? '0000년 0월 0일' : 'TBD')}</span>
        {data.validUntil && (
          <span>{t.validUntil}: {formatDateByLanguage(data.validUntil, language)}</span>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          INFO GRID: 수신 / 발신
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginBottom: '32px',
        }}
      >
        {/* 수신인 */}
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: primaryColor,
              marginBottom: '8px',
              letterSpacing: '0.05em',
            }}
          >
            {t.to}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
            {data.clientName || '고객명'}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {data.clientAddress || ''}
            {data.clientPhone && <><br />{data.clientPhone}</>}
            {data.clientEmail && <><br />{data.clientEmail}</>}
          </div>
        </div>

        {/* 발신인 */}
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: primaryColor,
              marginBottom: '8px',
              letterSpacing: '0.05em',
            }}
          >
            {t.from}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
            {data.companyName || 'Invisible Works'}
          </div>
          <div style={{ fontSize: '11px', color: mutedColor, lineHeight: 1.6 }}>
            {companyInfo.address}
            {data.companyPhone && <><br />{data.companyPhone}</>}
            {data.companyEmail && <><br />{data.companyEmail}</>}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TABLE HEADER
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 0.6fr 1fr 1fr',
          borderTop: `2px solid ${primaryColor}`,
          borderBottom: `1px solid ${borderColor}`,
          padding: '10px 0',
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.03em',
          color: primaryColor,
        }}
      >
        <div>{t.description}</div>
        <div style={{ textAlign: 'center' }}>{t.quantity}</div>
        <div style={{ textAlign: 'right' }}>{t.unitPrice}</div>
        <div style={{ textAlign: 'right' }}>{t.amount}</div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TABLE BODY
      ═══════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, minHeight: '180px' }}>
        {pageItems.map((item, index) => {
          const itemTotal = calculateItemTotal(item);
          return (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 0.6fr 1fr 1fr',
                padding: '12px 0',
                borderBottom: `1px solid ${borderColor}`,
                fontSize: '11px',
              }}
            >
              <div style={{ fontWeight: 500, color: '#1a1a1a' }}>
                {/* Description & Sub Items */}
                {item.description || (item.id.startsWith('auto') ? (language === 'ko' ? '자동 항목' : 'Auto Item') : `${language === 'ko' ? '항목' : 'Item'} ${index + 1}`)}
                {item.inputType === 'text' && item.textValue && (
                  <span style={{ fontSize: '10px', color: mutedColor, marginLeft: '6px' }}>
                    [{item.textValue}]
                  </span>
                )}
                {item.subItems && item.subItems.length > 0 && (
                  <div style={{ fontSize: '10px', color: mutedColor, marginTop: '4px' }}>
                    {item.subItems.map((sub, i) => (
                      <div key={i}>• {sub}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div style={{ textAlign: 'center', color: mutedColor, fontFeatureSettings: '"tnum"' }}>
                {item.inputType === 'text' ? '-' : item.quantity}
              </div>

              <div style={{ textAlign: 'right', color: mutedColor, fontFeatureSettings: '"tnum"' }}>
                {item.inputType === 'text' ? (
                  '-'
                ) : item.inputType === 'percent' ? (
                  `${item.ratio}%`
                ) : item.inputType === 'range' ? (
                  <MultiLineCurrency amount={{ min: item.unitPrice, max: item.maxPrice || item.unitPrice }} language={language} />
                ) : (
                  formatCurrencyByLanguage(item.unitPrice, language)
                )}
              </div>

              {/* Total Amount */}
              <div style={{ textAlign: 'right', fontWeight: 600, color: '#1a1a1a', fontFeatureSettings: '"tnum"' }}>
                {item.inputType === 'text' ? (
                  item.textValue || t.tbd
                ) : (
                  <MultiLineCurrency amount={itemTotal} language={language} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TOTALS (Only on last page)
      ═══════════════════════════════════════════════════════════════ */}
      {showTotals && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '24px',
            paddingTop: '16px',
          }}
        >
          {/* 좌측: 비고 + 옵션 안내 (항목처럼 가로 레이아웃) */}
          <div style={{ flex: 1, paddingRight: '40px' }}>
            {/* 계좌 정보 (Localized) */}
            {bankInfo.bankName && bankInfo.accountNumber && (
              <div
                style={{
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '9px',
                  marginBottom: '16px', // Added margin-bottom for spacing
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '10px' }}>[{t.bankAccount}]</div>
                <div style={{ marginBottom: '2px' }}>{bankInfo.bankName} {bankInfo.accountNumber}</div>
                <div style={{ color: '#666' }}>{t.accountHolder}: {bankInfo.accountHolder}</div>
              </div>
            )}
            {/* 비고 - 항목처럼 한 줄 */}
            {data.notes && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '10px',
                  borderBottom: `1px solid ${borderColor}`,
                  paddingBottom: '10px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ width: '60px', fontWeight: 700, color: primaryColor, flexShrink: 0 }}>
                  {t.notes}
                </div>
                <div style={{ flex: 1, color: mutedColor, lineHeight: 1.5 }}>
                  {data.notes}
                </div>
              </div>
            )}

            {/* 서버/도메인 미정 시 옵션 가격표 - 한 줄씩 */}
            {(data.serverOption?.status === 'pending' || data.domainOption?.status === 'pending') && (
              <div style={{ fontSize: '10px' }}>
                {data.serverOption?.status === 'pending' && (
                  <div
                    style={{
                      display: 'flex',
                      borderBottom: `1px solid ${borderColor}`,
                      paddingBottom: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ width: '60px', fontWeight: 700, color: primaryColor, flexShrink: 0 }}>
                      {t.server}
                    </div>
                    <div style={{ flex: 1, color: mutedColor }}>
                      {getServerOptionsText(DEFAULT_SETTINGS, language)} ({t.pending})
                    </div>
                  </div>
                )}
                {data.domainOption?.status === 'pending' && (
                  <div
                    style={{
                      display: 'flex',
                      borderBottom: `1px solid ${borderColor}`,
                      paddingBottom: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ width: '60px', fontWeight: 700, color: primaryColor, flexShrink: 0 }}>
                      {t.domain}
                    </div>
                    <div style={{ flex: 1, color: mutedColor }}>
                      {getDomainOptionsText(DEFAULT_SETTINGS, language)} ({t.pending})
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 우측: 합계 - 강조 박스 */}
          <div
            style={{
              width: '220px',
              backgroundColor: '#fafafa',
              padding: '16px',
              borderRadius: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                fontSize: '11px',
                marginBottom: '10px',
                color: mutedColor,
              }}
            >
              <span>{t.subtotal}</span>
              <span style={{ fontFeatureSettings: '"tnum"', textAlign: 'right' }}>
                <MultiLineCurrency amount={subtotal} language={language} />
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                fontSize: '11px',
                marginBottom: '10px',
                color: mutedColor,
              }}
            >
              <span>{t.vat} ({data.vatRate}%)</span>
              <span style={{ fontFeatureSettings: '"tnum"', textAlign: 'right' }}>
                <MultiLineCurrency amount={vat} language={language} />
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                fontSize: '16px',
                fontWeight: 800,
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: `2px solid ${primaryColor}`,
                color: primaryColor,
              }}
            >
              <span>{t.total}</span>
              <span style={{ fontFeatureSettings: '"tnum"', textAlign: 'right' }}>
                <MultiLineCurrency amount={total} isTotal language={language} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Page Number */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '48px',
          fontSize: '10px',
          color: '#999',
        }}
      >
        {pageNumber} / {totalPages}
      </div>

    </div>
  );
}
