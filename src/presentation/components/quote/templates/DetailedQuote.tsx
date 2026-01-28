'use client';

import QRCode from 'react-qr-code';
import {
  QuoteData,
  calculateSubtotal,
  calculateVAT,
  calculateTotal,
  calculateBalanceDue,
  calculateItemTotal,
  formatCurrency,
  formatDate,
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
} from '@/lib/quote/types';
import { formatWon } from '@/lib/quote/settings';

interface TemplateProps {
  data: QuoteData;
  pageNumber?: number;
}

// 압축형 약관 (1페이지용)
const COMPACT_TERMS = [
  '이 견적은 최종 확정 전까지 \'예상 범위\'입니다. 제공해주신 정보 기준으로 산출된 금액이며, 착수 전 상담과 자료 확인 이후 최종 금액이 확정됩니다. 본 안내는 이해를 돕기 위한 요약이며, 상세 내용은 \'세부 약관\'을 따릅니다.',
  '페이지 분량은 제작사가 산정합니다. 한 화면 단위를 기준(스크린 블록)으로 제작사가 직접 분량을 산정하며, 최종 분량에 따라 금액이 달라질 수 있습니다.',
  '포함 범위와 추가 범위는 명확히 구분됩니다. 단순한 텍스트·이미지 수정은 기본 수정에 포함되지만, 디자인 변경·구조 변경·기능 추가는 추가 비용 대상입니다.',
  '수정은 기본 1회 제공됩니다. 작업 완료 후 한 번에 모아서 전달해주신 수정 요청에 대해 무제한으로 1회 반영됩니다.',
  '결제/쇼핑 기능이 포함되면 추가 상담이 필요합니다. 보안 수준과 서버 구조가 달라지기 때문에, 기능 포함 여부에 따라 추가 비용이 발생할 수 있습니다.',
  '서버와 도메인 비용은 제작비와 별개입니다. 서버 유지관리비와 도메인 비용은 선택 항목이며, 선택 후 최종 금액이 확정됩니다.',
  '제공 자료의 권리와 책임은 고객에게 있습니다. 이미지, 로고, 텍스트 등 고객이 제공한 자료의 저작권 문제는 고객 책임입니다.',
  '제작사는 결과물의 \'성과\'를 보장하지 않습니다. 매출, 검색 순위, 광고 성과 등 사업 성과는 보장 대상이 아니며, 제작 범위에 대한 결과물만 제공합니다.',
];

// 실효형 약관 (2페이지용)
const DETAILED_TERMS = {
  title: 'Invisible Works 웹사이트 제작 견적서 부속 약관',
  intro: '본 약관은 Invisible Works(이하 "제작사")가 제공하는 웹사이트 제작 서비스와 관련하여, 견적서와 함께 적용되는 기본 조건을 규정한다.',
  sections: [
    {
      title: '제1조 (문서의 성격 및 적용 범위)',
      content: [
        '① 본 견적서는 고객이 제공한 정보 및 협의된 요구사항을 기준으로 산정된 예상 범위 견적이며, 착수 전 상세 기획 및 자료 확인 결과에 따라 범위 및 금액이 조정될 수 있다.',
        '② 견적서에 기재된 스크린 블록(페이지 분량)은 제작사의 산정 기준을 따른다.',
        '③ 스크린 블록의 정의는 다음과 같다: 브라우저 배율 67% 기준에서 화면을 가득 채우는 하나의 화면 단위로, 스크롤 시 한 번에 인지되는 콘텐츠 묶음을 의미한다.',
        '④ 최소~최대 범위로 제시된 견적은 정보가 확정되기 전까지 확정 금액으로 간주되지 않는다.',
      ],
    },
    {
      title: '제2조 (작업 범위)',
      content: [
        '① 포함 항목: 견적서에 명시된 페이지 제작, 기본 보안 적용, 협의된 기능 구현, 오픈(배포) 지원.',
        '② 다음 각 호의 항목은 기본 견적에 포함되지 않으며, 필요 시 별도 견적 대상이다:',
        '   • 신규 로고 및 브랜드 개발, 대규모 카피라이팅 작성',
        '   • 사진·영상 촬영 및 전문 편집',
        '   • 외부 서비스(API) 연동 중 정책·권한·승인 이슈가 있는 경우',
        '   • 레이아웃 변경, 리디자인, 정보구조(IA) 재설계',
        '   • 다국어 구축 및 번역 포함 작업',
        '   • 법무·세무·의료 등 고위험 업종 문구 검수',
        '   • 접근성·보안 인증(ISMS 등) 대응',
        '③ 견적서의 "특이사항" 항목은 비용에 즉시 반영되지 않으며, 상담 이후 확정된다.',
      ],
    },
    {
      title: '제3조 (일정 및 납기)',
      content: [
        '① 전체 일정은 착수일, 자료 수급일, 피드백 회신 속도, 외부 서비스 승인 여부에 따라 변동될 수 있다.',
        '② 고객의 자료 제공 지연, 피드백 지연, 요구사항 변경, 외부 승인 지연이 발생한 경우 납기는 자동 연장될 수 있다.',
        '③ 촉박한 일정의 프로젝트는 별도 협의 없이는 확정 납기를 보장하지 않는다.',
      ],
    },
    {
      title: '제4조 (고객 제공 자료 및 권리 책임)',
      content: [
        '① 고객은 제작에 필요한 텍스트, 이미지, 영상, 로고, 상표, 정보 등을 기한 내 제공해야 한다.',
        '② 고객이 제공하는 모든 자료는 저작권, 초상권, 상표권, 라이선스 사용 권한을 적법하게 보유해야 하며, 관련 분쟁 발생 시 책임은 고객에게 있다.',
        '③ 고객이 외부 계정(도메인, 서버, 결제, SNS 등)의 접근 권한을 제공하지 않거나 지연 제공하는 경우 작업은 제한될 수 있다.',
      ],
    },
    {
      title: '제5조 (수정 정책)',
      content: [
        '① 기본 수정 1회 제공: 작업 완료 후 전달된 결과물을 기준으로, 텍스트 수정, 이미지·영상 교체, 삭제 등 콘텐츠 변경 범위 내에서 무제한 1회 제공한다.',
        '② 수정 1회의 기준은 고객이 취합하여 1회로 전달한 수정 요청 묶음을 기준으로 한다.',
        '③ 기본 수정은 전달일로부터 7일 이내 접수된 건에 한해 적용된다.',
        '④ 수정 처리 기간은 접수 후 3영업일 이내 전달을 원칙으로 하며, 요청량 및 외부 승인 필요 시 변동될 수 있다.',
        '⑤ 다음 각 호는 범위 변경으로 간주되어 추가 견적 대상이다: 레이아웃 변경, 스타일 전면 수정, 기능 변경 및 추가',
      ],
    },
    {
      title: '제6조 (추가 수정 비용)',
      content: [
        '① 텍스트·이미지·영상 무제한 수정 1회 이용권: 5만원',
        '② 레이아웃 수정 및 리디자인(1회 미팅 포함): 10만원',
      ],
    },
    {
      title: '제7조 (기능 및 외부 서비스)',
      content: [
        '① 쇼핑·결제·거래 기능이 포함되는 경우, 결제대행(PG), 개인정보 처리, 보안 등급, 서버 구조에 따라 추가 비용이 발생할 수 있으며 추가 상담이 필요하다.',
        '② 외부 서비스 연동은 해당 서비스의 정책, 요금, 승인 절차에 따라 구현 가능 범위가 달라질 수 있다.',
      ],
    },
    {
      title: '제8조 (서버 유지관리 및 도메인 비용)',
      content: [
        '① 서버 유지관리비 및 도메인 비용은 제작비와 별개의 고정 비용이다.',
        '② 서버 유지관리비: 1년 15만원 / 2년 25만원 / 3년 30만원',
        '③ 도메인 비용: 신규 등록 연 3만원 × 사용 연수 / 기존 도메인 이전 (연 3만원 × 사용 연수) + 이전비 3만원',
        '④ 고객 보유 서버 및 도메인을 사용하는 경우, 관련 정보 제공 및 설정 책임은 고객에게 있다.',
        '⑤ 서버 및 도메인 비용은 공급사 정책 변경 시 실비 정산을 원칙으로 한다.',
      ],
    },
    {
      title: '제9조 (보안 및 운영)',
      content: [
        '① 본 견적에는 일반적인 검색 노출에 문제가 없는 기본 보안 설정이 포함된다.',
        '② 결제·거래·민감정보 처리가 필요한 경우 상급 보안이 요구되며, 별도 상담 및 추가 견적이 필요하다.',
        '③ 고객의 운영 방식(플러그인 추가 설치, 계정 공유, 약한 비밀번호 사용 등)으로 발생하는 문제에 대해 제작사는 책임지지 않는다.',
      ],
    },
    {
      title: '제10조 (검수 및 납품)',
      content: [
        '① 납품물은 견적서 및 협의된 범위에 따라 제작된 웹사이트 및 관련 산출물이다.',
        '② 고객은 전달일로부터 7일 이내 검수를 진행해야 하며, 기한 내 회신이 없는 경우 납품 승인으로 간주할 수 있다.',
        '③ 브라우저 및 디바이스 호환은 주요 최신 버전을 기준으로 대응한다.',
      ],
    },
    {
      title: '제11조 (비용 및 결제)',
      content: [
        '① 견적 금액은 협의된 범위를 기준으로 하며, 범위 변경 시 추가 견적이 발생한다.',
        '② 외부 유료 서비스(플러그인, 폰트, 이미지, API, 번역, 결제 수수료 등)는 고객 부담이다.',
        '③ 부가세 포함 여부는 견적서에 따른다.',
      ],
    },
    {
      title: '제12조 (저작권 및 산출물 권리)',
      content: [
        '① 고객이 제공한 자료의 권리는 고객에게 있다.',
        '② 제작 결과물의 사용 권리는 결제 완료를 전제로 고객에게 귀속된다.',
        '③ 제작사가 보유한 템플릿, 프레임워크, 공용 컴포넌트, 노하우는 제작사의 자산이며 고객에게는 프로젝트 목적 범위 내 사용권만 부여된다.',
      ],
    },
    {
      title: '제13조 (비밀유지)',
      content: [
        '① 당사자는 프로젝트 수행 과정에서 알게 된 상대방의 비공개 정보를 제3자에게 공개하지 않는다.',
        '② 법령 또는 수사기관 요청에 의한 공개는 예외로 한다.',
      ],
    },
    {
      title: '제14조 (책임 제한)',
      content: [
        '① 제작사는 고객의 사업 성과, 매출, 검색 순위, 광고 성과를 보장하지 않는다.',
        '② 간접손해 및 기대이익에 대해서는 책임을 지지 않으며, 제작사의 책임이 인정되는 경우에도 책임 한도는 고객이 실제 지급한 제작비 범위로 제한된다.',
      ],
    },
    {
      title: '제15조 (계약 변경 및 해지)',
      content: [
        '① 진행 중 범위 변경이 발생할 경우 추가 견적 합의 후 진행한다.',
        '② 고객 사정으로 프로젝트가 중단 또는 해지되는 경우, 진행 단계에 따라 이미 수행된 작업 비용은 정산 대상이 될 수 있다.',
        '③ 고객이 결제 의무를 이행하지 않거나 자료 제공이 장기간 지연되는 경우, 제작사는 작업을 중단할 수 있다.',
      ],
    },
    {
      title: '제16조 (분쟁 해결 및 관할)',
      content: [
        '① 본 약관 및 견적서와 관련한 분쟁은 대한민국 법률에 따라 해석되며, 관할 법원은 제작사 소재지 관할 법원으로 한다.',
      ],
    },
  ],
};

/**
 * 세부 견적서 템플릿 (Detailed Quote)
 * - 브루탈리스트 / 인더스트리얼 스타일
 * - 블랙 & 화이트 모노톤
 * - Pretendard 폰트
 * - 대괄호 [] 스타일 강조
 */
export function DetailedQuote({ data, pageNumber = 1 }: TemplateProps) {
  const subtotal = calculateSubtotal(data.items);
  const vat = calculateVAT(subtotal, data.vatRate);
  const total = calculateTotal(subtotal, vat);
  const balanceDue = calculateBalanceDue(subtotal, vat, data.discount || 0);

  // QR 값 - invisibleworks.studio 웹사이트로 고정
  const qrValue = 'https://invisibleworks.studio';

  // 2페이지: 세부 약관
  if (pageNumber === 2) {
    return <DetailedQuotePage2 data={data} />;
  }

  return (
    <div
      style={{
        width: `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        backgroundColor: '#ffffff',
        fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        color: '#000000',
        padding: '32px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontSize: '9px',
        lineHeight: 1.4,
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          LOGO - 대형 로고 (좌우 마진 기준 100px)
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          marginBottom: '28px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src="/user_source/logo/logo-horizontal-black.png"
          alt="Invisible Works"
          style={{
            height: '100px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HEADER - 날짜/고객 | 번호/제목 | INVOICE
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 1fr',
          gap: '16px',
          marginBottom: '20px',
          alignItems: 'start',
        }}
      >
        {/* 좌측: 날짜 + 고객 정보 */}
        <div>
          <div style={{ marginBottom: '4px' }}>
            [{formatDate(data.date) || '0000년 0월 0일'}]
          </div>
          <div style={{ marginBottom: '2px' }}>[{data.clientName || '고객명'}]</div>
          {data.clientAddress && (
            <div style={{ color: '#666', fontSize: '8px' }}>{data.clientAddress}</div>
          )}
          {data.clientPhone && (
            <div style={{ color: '#666', fontSize: '8px' }}>T: {data.clientPhone}</div>
          )}
          {data.clientEmail && (
            <div style={{ color: '#666', fontSize: '8px' }}>E: {data.clientEmail}</div>
          )}
        </div>

        {/* 중앙: 견적번호 + 제목 */}
        <div>
          <div style={{ marginBottom: '4px' }}>
            [#{data.quoteNumber?.padStart(6, '0') || '000001'}]
          </div>
          <div>[{data.invoiceSubject || '견적서 제목'}]</div>
        </div>

        {/* 우측: INVOICE 타이틀 */}
        <div
          style={{
            textAlign: 'right',
            fontSize: '36px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          INVOICE
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TABLE HEADER
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 0.5fr 1fr 1fr',
          borderTop: '1px solid #000',
          borderBottom: '1px solid #000',
          padding: '6px 0',
          fontWeight: 600,
          marginBottom: '0',
        }}
      >
        <div>항목</div>
        <div style={{ textAlign: 'center' }}>수량</div>
        <div style={{ textAlign: 'right' }}>단가</div>
        <div style={{ textAlign: 'right' }}>금액</div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TABLE BODY - 항목들
      ═══════════════════════════════════════════════════════════════ */}
      <div style={{ flex: '0 0 auto', minHeight: '160px' }}>
        {data.items.map((item, index) => (
          <div key={item.id}>
            {/* 메인 항목 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 0.5fr 1fr 1fr',
                padding: '8px 0',
                borderBottom: '1px solid #eee',
              }}
            >
              {/* Description */}
              <div style={{ fontWeight: 500 }}>
                {item.description || `프로젝트 항목 ${index + 1}`}
                {item.inputType === 'text' && item.textValue && (
                  <span style={{ fontSize: '8px', color: '#666', marginLeft: '6px' }}>
                    [{item.textValue}]
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div style={{ textAlign: 'center' }}>
                {item.inputType === 'text' ? '-' : item.quantity}
              </div>

              {/* Unit Price */}
              <div style={{ textAlign: 'right', fontFeatureSettings: '"tnum"' }}>
                {item.inputType === 'text' ? (
                  '-'
                ) : item.inputType === 'percent' ? (
                  `${item.ratio}%`
                ) : item.inputType === 'range' ? (
                  formatCurrency({ min: item.unitPrice, max: item.maxPrice || item.unitPrice })
                ) : (
                  formatCurrency(item.unitPrice)
                )}
              </div>

              {/* Total Amount */}
              <div style={{ textAlign: 'right', fontWeight: 500, fontFeatureSettings: '"tnum"' }}>
                {item.inputType === 'text' ? (
                  item.textValue || '별도 상담'
                ) : (
                  formatCurrency(calculateItemTotal(item))
                )}
              </div>
            </div>

            {/* 서브 항목들 */}
            {item.subItems?.map((subItem, subIndex) => (
              <div
                key={`${item.id}-sub-${subIndex}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 0.5fr 0.8fr 0.6fr 1fr',
                  padding: '4px 0',
                  paddingLeft: '16px',
                  color: '#666',
                  fontSize: '8px',
                }}
              >
                <div>{subItem}</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TOTALS - 합계 영역 (좌: 결제정보, 우: 합계)
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '16px',
          marginBottom: '20px',
          gap: '40px',
        }}
      >
        {/* 좌측: 결제 정보 */}
        <div style={{ flex: 1 }}>
          {/* 결제 분할 정보 */}
          {data.paymentSplit && data.paymentSplit.type !== 'full' && (
            <div
              style={{
                padding: '8px',
                backgroundColor: '#f8f8f8',
                borderRadius: '2px',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '6px' }}>
                [분할 결제 안내]
              </div>
              {data.paymentSplit.labels.map((label, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '7px',
                    padding: '2px 0',
                  }}
                >
                  <span>{label} ({data.paymentSplit.ratios[index]}%)</span>
                  <span style={{ fontFeatureSettings: '"tnum"' }}>
                    {formatCurrency({
                      min: Math.round(balanceDue.min * data.paymentSplit.ratios[index] / 100),
                      max: Math.round(balanceDue.max * data.paymentSplit.ratios[index] / 100)
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 계좌 정보 */}
          {data.bankName && data.bankAccountNumber && (
            <div
              style={{
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '2px',
                fontSize: '7px',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>[입금 계좌]</div>
              <div>{data.bankName} {data.bankAccountNumber}</div>
              <div style={{ color: '#666' }}>예금주: {data.bankAccountName}</div>
            </div>
          )}
        </div>

        {/* 우측: 합계 */}
        <div style={{ width: '200px' }}>
          {/* SUBTOTAL */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
            }}
          >
            <span style={{ fontWeight: 600 }}>SUBTOTAL:</span>
            <span style={{ fontFeatureSettings: '"tnum"' }}>{formatCurrency(subtotal)}</span>
          </div>

          {/* TAX */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
            }}
          >
            <span style={{ fontWeight: 600 }}>TAX ({data.vatRate}%):</span>
            <span style={{ fontFeatureSettings: '"tnum"' }}>{formatCurrency(vat)}</span>
          </div>

          {/* TOTAL */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
            }}
          >
            <span style={{ fontWeight: 600 }}>TOTAL:</span>
            <span style={{ fontFeatureSettings: '"tnum"' }}>{formatCurrency(total)}</span>
          </div>

          {/* DISCOUNT */}
          {(data.discount || 0) > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0',
              }}
            >
              <span style={{ fontWeight: 600 }}>DISCOUNT:</span>
              <span style={{ fontFeatureSettings: '"tnum"' }}>-{formatCurrency(data.discount || 0)}</span>
            </div>
          )}

          {/* BALANCE DUE */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              marginTop: '8px',
              borderTop: '2px solid #000',
              fontWeight: 700,
              fontSize: '11px',
            }}
          >
            <span>BALANCE DUE:</span>
            <span style={{ fontFeatureSettings: '"tnum"' }}>{formatCurrency(balanceDue)}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER AREA (하단 고정) - WEBSITE + TERMS + 회사정보
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '36px',
          right: '36px',
        }}
      >
        {/* WEBSITE & TERMS SECTION */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #000',
            marginBottom: '16px',
          }}
        >
          {/* 좌측: WEBSITE + QR */}
          <div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
              }}
            >
              WEBSITE
              <span style={{ fontSize: '8px', fontWeight: 400 }}>
                [INV NO. {data.quoteNumber}]
              </span>
            </div>

            <div style={{ marginBottom: '8px', fontSize: '8px' }}>
              {data.paymentTerms && (
                <div>
                  <span style={{ color: '#666' }}>[TERMS]</span> {data.paymentTerms}
                </div>
              )}
            </div>

            {/* QR Code - 웹사이트 링크 */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '7px', color: '#666', marginBottom: '3px' }}>
                SCAN TO VISIT WEBSITE
              </div>
              <QRCode
                value={qrValue}
                size={50}
                level="L"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
          </div>

          {/* 우측: TERMS & CONDITIONS (압축형 약관) */}
          <div>
            <div
              style={{
                fontSize: '8px',
                fontWeight: 700,
                marginBottom: '8px',
                textDecoration: 'underline',
              }}
            >
              TERMS & CONDITIONS
            </div>
            <div style={{ fontSize: '5.5px', color: '#444', lineHeight: 1.4 }}>
              {COMPACT_TERMS.map((term, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>
                  {index + 1}. {term}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 회사 정보 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid #000',
            fontSize: '8px',
            color: '#666',
          }}
        >
          <div style={{ fontWeight: 600 }}>
            Invisible Works
          </div>
          <div style={{ textAlign: 'center' }}>
            {data.companyAddress}
          </div>
          <div style={{ textAlign: 'right' }}>
            invisibleworks.studio
          </div>
        </div>

        {/* 페이지 번호 */}
        <div
          style={{
            position: 'absolute',
            bottom: '-12px',
            right: '0',
            fontSize: '8px',
            color: '#999',
          }}
        >
          1 / 2
        </div>
      </div>
    </div>
  );
}

/**
 * 세부 견적서 2페이지 - 세부 약관
 */
function DetailedQuotePage2({ data }: { data: QuoteData }) {
  return (
    <div
      style={{
        width: `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        backgroundColor: '#ffffff',
        fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        color: '#000000',
        padding: '32px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        fontSize: '7.5px',
        lineHeight: 1.35,
      }}
    >
      {/* 헤더: 약관 제목 */}
      <div
        style={{
          borderBottom: '2px solid #000',
          paddingBottom: '12px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}
        >
          {DETAILED_TERMS.title}
        </div>
        <div style={{ fontSize: '7px', color: '#666' }}>
          {DETAILED_TERMS.intro}
        </div>
      </div>

      {/* 약관 내용 - 2열 레이아웃 */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          overflow: 'hidden',
        }}
      >
        {/* 왼쪽 열: 1-8조 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DETAILED_TERMS.sections.slice(0, 8).map((section, index) => (
            <div key={index}>
              <div
                style={{
                  fontSize: '7.5px',
                  fontWeight: 700,
                  marginBottom: '3px',
                  color: '#000',
                }}
              >
                {section.title}
              </div>
              <div style={{ fontSize: '6.5px', color: '#333' }}>
                {section.content.map((line, lineIndex) => (
                  <div key={lineIndex} style={{ marginBottom: '1px' }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽 열: 9-16조 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DETAILED_TERMS.sections.slice(8).map((section, index) => (
            <div key={index}>
              <div
                style={{
                  fontSize: '7.5px',
                  fontWeight: 700,
                  marginBottom: '3px',
                  color: '#000',
                }}
              >
                {section.title}
              </div>
              <div style={{ fontSize: '6.5px', color: '#333' }}>
                {section.content.map((line, lineIndex) => (
                  <div key={lineIndex} style={{ marginBottom: '1px' }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #000',
          fontSize: '8px',
          color: '#666',
        }}
      >
        <div style={{ fontWeight: 600 }}>
          Invisible Works
        </div>
        <div style={{ textAlign: 'center' }}>
          본 약관은 견적서 발행일 기준으로 적용됩니다.
        </div>
        <div style={{ textAlign: 'right' }}>
          invisibleworks.studio
        </div>
      </div>

      {/* 페이지 번호 */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '36px',
          fontSize: '8px',
          color: '#999',
        }}
      >
        2 / 2
      </div>
    </div>
  );
}
