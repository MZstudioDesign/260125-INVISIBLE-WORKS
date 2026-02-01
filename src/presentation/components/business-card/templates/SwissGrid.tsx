'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

/**
 * 스위스 그리드 (Swiss Grid)
 * - 국제 타이포그래피 스타일 (Swiss Style)
 * - 앞면: 강렬한 배경색 + 압도적인 타이포그래피 (좌측 정렬)
 * - 뒷면: 엄격한 4분할 그리드 라인 + 정보의 체계적 배치
 * - 무드: Professional, Modern, Structured
 */
export function SwissGrid({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;

    // Helper for contrast
    const getContrastColor = (hex: string) => {
        // Simple logic: if bright, return black, else white
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128 ? '#1a1a1a' : '#ffffff';
    };

    const textColor = getContrastColor(data.primaryColor);

    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#ffffff',
        fontFamily: 'Pretendard, Helvetica Neue, Helvetica, Arial, sans-serif',
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
            <div style={{ ...containerStyle, backgroundColor: data.primaryColor }}>
                {bleedIndicator}

                <div
                    style={{
                        position: 'absolute',
                        top: `${bleedPx}px`,
                        left: `${bleedPx}px`,
                        right: `${bleedPx}px`,
                        bottom: `${bleedPx}px`,
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Top: Logo (Small) */}
                    <div style={{ height: '24px' }}>
                        {data.logo && (
                            <img
                                src={data.logo}
                                alt="Logo"
                                style={{
                                    height: '100%',
                                    width: 'auto',
                                    filter: textColor === '#ffffff' ? 'brightness(0) invert(1)' : 'none'
                                }}
                            />
                        )}
                    </div>

                    {/* Bottom: Huge Typography */}
                    <div>
                        <h1
                            style={{
                                fontSize: '42px',
                                fontWeight: 800,
                                color: textColor,
                                lineHeight: 0.9,
                                letterSpacing: '-0.03em',
                                margin: '0 0 16px 0',
                                wordBreak: 'keep-all', // Ensure korean names don't break weirdly
                            }}
                        >
                            {data.name || 'HELVETICA'}
                        </h1>

                        <div style={{ width: '60px', height: '4px', background: textColor, opacity: 0.5, marginBottom: '16px' }} />

                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: textColor,
                                margin: 0,
                                opacity: 0.8,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {data.title || 'DESIGNER'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Back Side: Grid Layout
    const gridLineColor = '#e5e5e5';

    return (
        <div style={containerStyle}>
            {bleedIndicator}

            <div
                style={{
                    position: 'absolute',
                    top: `${bleedPx}px`,
                    left: `${bleedPx}px`,
                    right: `${bleedPx}px`,
                    bottom: `${bleedPx}px`,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                }}
            >
                {/* Horizontal Line */}
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: gridLineColor }} />
                {/* Vertical Line */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: gridLineColor }} />

                {/* Q1: Company Info */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0', color: '#1a1a1a' }}>
                        {data.company}
                    </h2>
                    {data.slogan && (
                        <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>{data.slogan}</p>
                    )}
                </div>

                {/* Q2: Address */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 700, color: '#999', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Address</h3>
                    <p style={{ fontSize: '10px', color: '#333', lineHeight: 1.4, margin: 0 }}>
                        {data.address}
                    </p>
                </div>

                {/* Q3: Contact */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {data.phone && <p style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>{data.phone}</p>}
                        {data.email && <p style={{ fontSize: '11px', color: '#1a1a1a', margin: 0 }}>{data.email}</p>}
                        {data.website && <p style={{ fontSize: '11px', color: data.primaryColor, margin: 0 }}>{data.website}</p>}
                    </div>
                </div>

                {/* Q4: QR Code */}
                <div style={{ padding: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    {(data.website || data.email) && (
                        <QRCode
                            value={data.website || `mailto:${data.email}`}
                            size={56}
                            level="M"
                            bgColor="transparent"
                            fgColor="#1a1a1a"
                        />
                    )}
                </div>

            </div>
        </div>
    );
}
