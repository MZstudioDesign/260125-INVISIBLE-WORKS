'use client';

import { BusinessCardData, BLEED_MM, CARD_WIDTH_MM, CARD_HEIGHT_MM } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
  data: BusinessCardData;
  side: 'front' | 'back';
  showBleed?: boolean;
}

/**
 * 미니멀 코린티안 (Minimal Corinthian)
 * - 극단의 여백, 타이포그래피 중심
 * - 앞면: 좌측 로고 + 중앙 이름만
 * - 뒷면: 연락처 정보 좌측 정렬
 * - 무드: Luxury, Editorial
 */
export function MinimalCorinthian({ data, side, showBleed = true }: TemplateProps) {
  const bleedPx = showBleed ? 12 : 0; // ~3mm at preview scale
  
  const containerStyle: React.CSSProperties = {
    width: `${360 + bleedPx * 2}px`, // 90mm * 4 scale
    height: `${200 + bleedPx * 2}px`, // 50mm * 4 scale
    padding: `${bleedPx}px`,
    backgroundColor: '#ffffff',
    fontFamily: 'Pretendard, -apple-system, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  };

  const cardStyle: React.CSSProperties = {
    width: '360px',
    height: '200px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '24px 32px',
    boxSizing: 'border-box',
  };

  // Bleed indicator
  const bleedIndicator = showBleed && (
    <div
      style={{
        position: 'absolute',
        inset: `${bleedPx}px`,
        border: '1px dashed rgba(0,0,0,0.1)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );

  if (side === 'front') {
    return (
      <div style={containerStyle}>
        {bleedIndicator}
        <div style={cardStyle}>
          {/* Logo - Top Left */}
          {data.logo && (
            <div style={{ position: 'absolute', top: '24px', left: '32px' }}>
              <img
                src={data.logo}
                alt="Logo"
                style={{
                  height: '28px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
          
          {/* Name - Center */}
          <div style={{ textAlign: 'center', marginTop: data.logo ? '20px' : '0' }}>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: data.primaryColor,
                letterSpacing: '0.05em',
                margin: 0,
              }}
            >
              {data.name || '홍길동'}
            </h1>
            {data.title && (
              <p
                style={{
                  fontSize: '11px',
                  color: '#666666',
                  marginTop: '8px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {data.title}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Back side
  return (
    <div style={containerStyle}>
      {bleedIndicator}
      <div style={cardStyle}>
        {/* Contact Info - Left Aligned */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.company && (
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: data.primaryColor,
                margin: 0,
              }}
            >
              {data.company}
            </p>
          )}
          
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {data.phone && (
              <p style={{ fontSize: '11px', color: '#333', margin: 0 }}>
                {data.phone}
              </p>
            )}
            {data.email && (
              <p style={{ fontSize: '11px', color: '#333', margin: 0 }}>
                {data.email}
              </p>
            )}
            {data.website && (
              <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>
                {data.website}
              </p>
            )}
            {data.address && (
              <p style={{ fontSize: '10px', color: '#888', margin: 0, marginTop: '4px' }}>
                {data.address}
              </p>
            )}
          </div>
        </div>

        {/* QR Code - Bottom Right */}
        {(data.email || data.website) && (
          <div style={{ position: 'absolute', bottom: '24px', right: '32px' }}>
            <QRCode
              value={data.website || `mailto:${data.email}`}
              size={48}
              level="H"
              bgColor="transparent"
              fgColor={data.primaryColor}
            />
          </div>
        )}
      </div>
    </div>
  );
}
