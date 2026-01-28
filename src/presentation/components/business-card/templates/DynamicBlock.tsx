'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
  data: BusinessCardData;
  side: 'front' | 'back';
  showBleed?: boolean;
}

/**
 * 다이나믹 블록 (Dynamic Block)
 * - 강렬한 색면 대비, 기하학적 파티션
 * - 앞면: 키컬러 바탕 + 한쪽 대비 정보
 * - 뒷면: 전체 키컬러 배경 + QR코드
 * - 무드: Bold, Modern, Energetic
 */
export function DynamicBlock({ data, side, showBleed = true }: TemplateProps) {
  const bleedPx = showBleed ? 12 : 0;
  
  // Calculate contrast color
  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
  };

  const contrastColor = getContrastColor(data.primaryColor);

  const containerStyle: React.CSSProperties = {
    width: `${360 + bleedPx * 2}px`,
    height: `${200 + bleedPx * 2}px`,
    padding: `${bleedPx}px`,
    backgroundColor: data.primaryColor,
    fontFamily: 'Pretendard, -apple-system, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  };

  const bleedIndicator = showBleed && (
    <div
      style={{
        position: 'absolute',
        inset: `${bleedPx}px`,
        border: '1px dashed rgba(255,255,255,0.3)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );

  if (side === 'front') {
    return (
      <div style={containerStyle}>
        {bleedIndicator}
        
        {/* White Block - Right Side */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '45%',
            height: '100%',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          {/* Logo */}
          {data.logo && (
            <img
              src={data.logo}
              alt="Logo"
              style={{
                height: '24px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '12px',
              }}
            />
          )}
          
          <h1
            style={{
              fontSize: '20px',
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
                fontSize: '10px',
                color: '#666',
                margin: '4px 0 0 0',
                fontWeight: 500,
              }}
            >
              {data.title}
            </p>
          )}
          
          {data.company && (
            <p
              style={{
                fontSize: '9px',
                color: data.primaryColor,
                margin: '8px 0 0 0',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {data.company}
            </p>
          )}
        </div>

        {/* Colored Side - Slogan */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '24px',
            transform: 'translateY(-50%)',
            width: '45%',
          }}
        >
          {data.slogan && (
            <p
              style={{
                fontSize: '11px',
                color: contrastColor,
                opacity: 0.9,
                fontWeight: 300,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {data.slogan}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Back side - Full color with QR
  return (
    <div style={containerStyle}>
      {bleedIndicator}
      
      {/* Center Content */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo or QR */}
        <div style={{ marginBottom: '16px' }}>
          <QRCode
            value={data.website || data.email ? `mailto:${data.email}` : 'https://invisible.works'}
            size={64}
            level="H"
            bgColor="transparent"
            fgColor={contrastColor}
          />
        </div>

        {/* Contact Strip */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            fontSize: '9px',
            color: contrastColor,
            opacity: 0.85,
          }}
        >
          {data.phone && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
        </div>

        {data.website && (
          <p
            style={{
              fontSize: '10px',
              color: contrastColor,
              marginTop: '8px',
              fontWeight: 500,
            }}
          >
            {data.website}
          </p>
        )}
      </div>
    </div>
  );
}
