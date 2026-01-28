'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
  data: BusinessCardData;
  side: 'front' | 'back';
  showBleed?: boolean;
}

/**
 * 도트 매트릭스 (Dot Matrix)
 * - 돈트 패턴, 레트로-퓨처리즘
 * - 앞면: 돈트 패턴 배경 + 네온 느낌 폰트
 * - 뒷면: 심플 로고 + 최소 정보
 * - 무드: Retro, Tech, Creative
 */
export function DotMatrix({ data, side, showBleed = true }: TemplateProps) {
  const bleedPx = showBleed ? 12 : 0;
  
  // Generate dot pattern
  const generateDots = () => {
    const dots = [];
    const spacing = 8;
    for (let y = 0; y < 30; y++) {
      for (let x = 0; x < 50; x++) {
        const opacity = Math.random() * 0.15 + 0.05;
        dots.push(
          <circle
            key={`${x}-${y}`}
            cx={x * spacing + 4}
            cy={y * spacing + 4}
            r={1.5}
            fill={data.primaryColor}
            opacity={opacity}
          />
        );
      }
    }
    return dots;
  };

  const containerStyle: React.CSSProperties = {
    width: `${360 + bleedPx * 2}px`,
    height: `${200 + bleedPx * 2}px`,
    padding: `${bleedPx}px`,
    backgroundColor: '#0a0a0a',
    fontFamily: '"SF Mono", "Fira Code", monospace',
    position: 'relative',
    overflow: 'hidden',
  };

  const bleedIndicator = showBleed && (
    <div
      style={{
        position: 'absolute',
        inset: `${bleedPx}px`,
        border: '1px dashed rgba(255,255,255,0.2)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );

  if (side === 'front') {
    return (
      <div style={containerStyle}>
        {bleedIndicator}
        
        {/* Dot Pattern Background */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {generateDots()}
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
            padding: '24px 28px',
            boxSizing: 'border-box',
          }}
        >
          {/* Logo */}
          {data.logo && (
            <img
              src={data.logo}
              alt="Logo"
              style={{
                height: '28px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '12px',
                filter: 'brightness(1.1)',
              }}
            />
          )}

          {/* Name with Glow Effect */}
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: data.primaryColor,
              margin: 0,
              textShadow: `0 0 20px ${data.primaryColor}60, 0 0 40px ${data.primaryColor}30`,
              letterSpacing: '0.05em',
            }}
          >
            {data.name || '홍길동'}
          </h1>

          {data.title && (
            <p
              style={{
                fontSize: '10px',
                color: '#888',
                margin: '6px 0 0 0',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
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
                margin: '16px 0 0 0',
                opacity: 0.7,
              }}
            >
              @ {data.company}
            </p>
          )}
        </div>

        {/* Decorative Line */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '28px',
            right: '28px',
            height: '1px',
            background: `linear-gradient(90deg, ${data.primaryColor}00, ${data.primaryColor}40, ${data.primaryColor}00)`,
          }}
        />
      </div>
    );
  }

  // Back side - Minimal with subtle pattern
  return (
    <div style={containerStyle}>
      {bleedIndicator}
      
      {/* Subtle Dot Pattern */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3,
        }}
      >
        {generateDots()}
      </svg>

      <div
        style={{
          position: 'relative',
          width: '360px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.phone && (
            <p style={{ fontSize: '10px', color: '#666', margin: 0, fontFamily: 'monospace' }}>
              <span style={{ color: data.primaryColor, marginRight: '8px' }}>//</span>
              {data.phone}
            </p>
          )}
          {data.email && (
            <p style={{ fontSize: '10px', color: '#666', margin: 0, fontFamily: 'monospace' }}>
              <span style={{ color: data.primaryColor, marginRight: '8px' }}>//</span>
              {data.email}
            </p>
          )}
          {data.website && (
            <p style={{ fontSize: '10px', color: '#888', margin: 0, fontFamily: 'monospace' }}>
              <span style={{ color: data.primaryColor, marginRight: '8px' }}>//</span>
              {data.website}
            </p>
          )}
        </div>

        {/* QR Code with Glow */}
        {(data.email || data.website) && (
          <div
            style={{
              padding: '8px',
              backgroundColor: '#0a0a0a',
              borderRadius: '4px',
              boxShadow: `0 0 20px ${data.primaryColor}30`,
            }}
          >
            <QRCode
              value={data.website || `mailto:${data.email}`}
              size={56}
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
