'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

/**
 * 글래스 프리즘 (Glass Prism)
 * - 투명한 유리 질감, 부드러운 오브(Orb) 그라디언트
 * - 앞면: 중앙 유리 카드에 정보 배치
 * - 뒷면: 전체 유리 질감 + QR 코드
 * - 무드: Trendy, Glass, Premium
 */
export function GlassPrism({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;

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

    // Background Gradient Orb
    const backgroundLayer = (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#f8f9fa',
                zIndex: 0,
            }}
        >
            {/* Orb 1 */}
            <div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '70%',
                    height: '140%',
                    background: `radial-gradient(circle, ${data.primaryColor}22 0%, transparent 70%)`,
                    filter: 'blur(30px)',
                }}
            />
            {/* Orb 2 */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-10%',
                    width: '60%',
                    height: '120%',
                    background: `radial-gradient(circle, ${data.primaryColor}15 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                }}
            />
        </div>
    );

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {backgroundLayer}
                {bleedIndicator}

                {/* Glass Card Container */}
                <div
                    style={{
                        position: 'absolute',
                        inset: `${bleedPx + 20}px`, // Slight margin inside bleed
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        zIndex: 1,
                        // Glass Effect
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                        // Note: backdrop-filter might be tricky with html2canvas but we try
                        // backdropFilter: 'blur(10px)', 
                    }}
                >
                    {/* Left: Logo/Visual Area */}
                    <div
                        style={{
                            width: '35%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRight: '1px solid rgba(0,0,0,0.03)'
                        }}
                    >
                        {data.logo ? (
                            <img
                                src={data.logo}
                                alt="Logo"
                                style={{
                                    maxWidth: '70%',
                                    maxHeight: '70%',
                                    objectFit: 'contain',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: data.primaryColor,
                                    opacity: 0.2
                                }}
                            />
                        )}
                    </div>

                    {/* Right: Info Area */}
                    <div
                        style={{
                            flex: 1,
                            padding: '0 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#1a1a1a',
                                margin: '0 0 4px 0',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            {data.name || 'Name'}
                        </h1>
                        <p
                            style={{
                                fontSize: '11px',
                                color: data.primaryColor,
                                fontWeight: 600,
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {data.title || 'Job Title'}
                        </p>

                        <div style={{ height: '16px' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {data.phone && (
                                <div style={{ fontSize: '10px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '9px', opacity: 0.5 }}>T.</span> {data.phone}
                                </div>
                            )}
                            {data.email && (
                                <div style={{ fontSize: '10px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '9px', opacity: 0.5 }}>E.</span> {data.email}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Back Side
    return (
        <div style={containerStyle}>
            {backgroundLayer}
            {bleedIndicator}

            <div
                style={{
                    position: 'absolute',
                    inset: `${bleedPx + 20}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    padding: '0 32px',
                }}
            >
                {/* Company Info */}
                <div style={{ flex: 1 }}>
                    {data.company && (
                        <h2
                            style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#1a1a1a',
                                margin: '0 0 8px 0',
                            }}
                        >
                            {data.company}
                        </h2>
                    )}

                    {data.slogan && (
                        <p
                            style={{
                                fontSize: '10px',
                                color: '#666',
                                fontStyle: 'italic',
                                margin: '0 0 16px 0',
                            }}
                        >
                            {data.slogan}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {data.address && (
                            <p style={{ fontSize: '9px', color: '#888', margin: 0 }}>
                                {data.address}
                            </p>
                        )}
                        {data.website && (
                            <p style={{ fontSize: '9px', color: '#888', margin: 0 }}>
                                {data.website}
                            </p>
                        )}
                    </div>
                </div>

                {/* QR Code */}
                {(data.website || data.email) && (
                    <div
                        style={{
                            padding: '8px',
                            background: 'rgba(255,255,255,0.5)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.8)',
                        }}
                    >
                        <QRCode
                            value={data.website || `mailto:${data.email}`}
                            size={64}
                            level="M"
                            bgColor="transparent"
                            fgColor="#1a1a1a"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
