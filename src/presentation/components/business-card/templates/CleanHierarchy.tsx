'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
  data: BusinessCardData;
  side: 'front' | 'back';
  showBleed?: boolean;
}

/**
 * 깔끔한 계층 (Clean Hierarchy)
 * - 명확한 정보 계층, 그리드 기반 레이아웃
 * - 앞면: 상단 로고 + 하단 연락처
 * - 뒷면: 채도 낮은 키컬러 + 슬로건
 * - 무드: Corporate, Professional, Organized
 */
export function CleanHierarchy({ data, side, showBleed = true }: TemplateProps) {
  const bleedPx = showBleed ? 12 : 0;
  
  // Light version of primary color
  const getLightColor = (hex: string, opacity: number = 0.08) => {
    return `${hex}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  const containerStyle: React.CSSProperties = {
    width: `${360 + bleedPx * 2}px`,
    height: `${200 + bleedPx * 2}px`,
    padding: `${bleedPx}px`,
    backgroundColor: '#ffffff',
    fontFamily: 'Pretendard, -apple-system, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  };

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
        
        <div
          style={{
            width: '360px',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 28px',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Section - Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              {data.logo && (
                <img
                  src={data.logo}
                  alt="Logo"
                  style={{
                    height: '32px',
                    width: 'auto',
                    objectFit: 'contain',
                    marginBottom: '12px',
                  }}
                />
              )}
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  margin: 0,
                }}
              >
                {data.name || '홍길동'}
              </h1>
              {data.title && (
                <p
                  style={{
                    fontSize: '11px',
                    color: data.primaryColor,
                    margin: '4px 0 0 0',
                    fontWeight: 600,
                  }}
                >
                  {data.title}
                </p>
              )}
            </div>
            
            {data.company && (
              <p
                style={{
                  fontSize: '10px',
                  color: '#888',
                  margin: 0,
                  textAlign: 'right',
                  fontWeight: 500,
                }}
              >
                {data.company}
              </p>
            )}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bottom Section - Contact Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '4px 24px',
              borderTop: `2px solid ${data.primaryColor}`,
              paddingTop: '12px',
            }}
          >
            {data.phone && (
              <p style={{ fontSize: '10px', color: '#333', margin: 0 }}>
                <span style={{ color: '#999', marginRight: '6px' }}>T</span>
                {data.phone}
              </p>
            )}
            {data.email && (
              <p style={{ fontSize: '10px', color: '#333', margin: 0 }}>
                <span style={{ color: '#999', marginRight: '6px' }}>E</span>
                {data.email}
              </p>
            )}
            {data.website && (
              <p style={{ fontSize: '10px', color: '#333', margin: 0 }}>
                <span style={{ color: '#999', marginRight: '6px' }}>W</span>
                {data.website}
              </p>
            )}
            {data.address && (
              <p style={{ fontSize: '9px', color: '#666', margin: 0, gridColumn: 'span 2' }}>
                <span style={{ color: '#999', marginRight: '6px' }}>A</span>
                {data.address}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Back side - Light colored background
  return (
    <div style={{ ...containerStyle, backgroundColor: getLightColor(data.primaryColor, 0.06) }}>
      {bleedIndicator}
      
      <div
        style={{
          width: '360px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 28px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Logo Center */}
        {data.logo && (
          <img
            src={data.logo}
            alt="Logo"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '16px',
              opacity: 0.9,
            }}
          />
        )}

        {/* Slogan */}
        {data.slogan && (
          <p
            style={{
              fontSize: '12px',
              color: data.primaryColor,
              textAlign: 'center',
              fontWeight: 500,
              maxWidth: '80%',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            "{data.slogan}"
          </p>
        )}

        {/* QR Code - Bottom Right */}
        {(data.email || data.website) && (
          <div style={{ position: 'absolute', bottom: '20px', right: '24px' }}>
            <QRCode
              value={data.website || `mailto:${data.email}`}
              size={36}
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
