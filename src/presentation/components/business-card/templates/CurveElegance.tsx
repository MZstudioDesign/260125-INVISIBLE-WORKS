'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
  data: BusinessCardData;
  side: 'front' | 'back';
  showBleed?: boolean;
}

/**
 * 커브 엘레강스 (Curve Elegance)
 * - 부드러운 곡선, 유려한 그라디언트
 * - 앞면: 대각선 디바이더 + 비대칭 배치
 * - 뒷면: 곡선 그래픽 + 키컬러 그라디언트
 * - 무드: Artistic, Premium, Sophisticated
 */
export function CurveElegance({ data, side, showBleed = true }: TemplateProps) {
  const bleedPx = showBleed ? 12 : 0;
  
  // Generate lighter shade
  const getLighterShade = (hex: string, percent: number = 30) => {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + (255 - (num >> 16)) * (percent / 100));
    const g = Math.min(255, ((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * (percent / 100));
    const b = Math.min(255, (num & 0x0000ff) + (255 - (num & 0x0000ff)) * (percent / 100));
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
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
        
        {/* Curved Gradient Shape */}
        <svg
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '70%',
            height: '140%',
          }}
          viewBox="0 0 300 300"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={data.primaryColor} stopOpacity="0.15" />
              <stop offset="50%" stopColor={getLighterShade(data.primaryColor, 40)} stopOpacity="0.08" />
              <stop offset="100%" stopColor={data.primaryColor} stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <path
            d="M150,0 Q300,150 150,300 L300,300 L300,0 Z"
            fill="url(#curveGradient)"
          />
        </svg>

        {/* Content */}
        <div
          style={{
            position: 'relative',
            width: '360px',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px 32px',
            boxSizing: 'border-box',
          }}
        >
          {/* Logo - Top */}
          {data.logo && (
            <img
              src={data.logo}
              alt="Logo"
              style={{
                height: '26px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '16px',
              }}
            />
          )}

          {/* Name */}
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#1a1a1a',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {data.name || '홍길동'}
          </h1>

          {/* Title & Company */}
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {data.title && (
              <span
                style={{
                  fontSize: '11px',
                  color: data.primaryColor,
                  fontWeight: 500,
                }}
              >
                {data.title}
              </span>
            )}
            {data.title && data.company && (
              <span style={{ color: '#ccc' }}>|</span>
            )}
            {data.company && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#666',
                }}
              >
                {data.company}
              </span>
            )}
          </div>

          {/* Contact Row */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '16px',
              display: 'flex',
              gap: '20px',
              fontSize: '9px',
              color: '#888',
            }}
          >
            {data.phone && <span>{data.phone}</span>}
            {data.email && <span>{data.email}</span>}
          </div>
        </div>
      </div>
    );
  }

  // Back side - Full gradient with curves
  return (
    <div
      style={{
        ...containerStyle,
        background: `linear-gradient(135deg, ${data.primaryColor} 0%, ${getLighterShade(data.primaryColor, 30)} 100%)`,
      }}
    >
      {bleedIndicator}
      
      {/* Decorative Curves */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 Q100,150 200,180 T400,160"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="60"
        />
        <path
          d="M0,100 Q150,50 300,80 T400,60"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="40"
        />
      </svg>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          width: '360px',
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        {data.logo && (
          <img
            src={data.logo}
            alt="Logo"
            style={{
              height: '36px',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '12px',
              filter: 'brightness(0) invert(1)',
              opacity: 0.95,
            }}
          />
        )}

        {/* Slogan */}
        {data.slogan && (
          <p
            style={{
              fontSize: '12px',
              color: '#ffffff',
              textAlign: 'center',
              fontWeight: 400,
              fontStyle: 'italic',
              maxWidth: '80%',
              lineHeight: 1.5,
              margin: 0,
              opacity: 0.9,
            }}
          >
            {data.slogan}
          </p>
        )}

        {/* Website */}
        {data.website && (
          <p
            style={{
              position: 'absolute',
              bottom: '20px',
              fontSize: '10px',
              color: '#ffffff',
              opacity: 0.7,
              margin: 0,
            }}
          >
            {data.website}
          </p>
        )}

        {/* QR Code - Corner */}
        {(data.email || data.website) && (
          <div style={{ position: 'absolute', bottom: '16px', right: '24px' }}>
            <QRCode
              value={data.website || `mailto:${data.email}`}
              size={40}
              level="H"
              bgColor="transparent"
              fgColor="rgba(255,255,255,0.8)"
            />
          </div>
        )}
      </div>
    </div>
  );
}
