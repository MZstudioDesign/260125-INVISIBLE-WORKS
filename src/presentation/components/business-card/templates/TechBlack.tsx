'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

/**
 * 테크 블랙 (Tech Black)
 * - 프리미엄 메탈 카드 / 신용카드 모티브
 * - 앞면: 매트 블랙 배경, IC 칩 그래픽, 미니멀한 배치
 * - 뒷면: 마그네틱 스트라이프 컨셉, 서명란 디테일
 * - 무드: Premium, Dark, Luxury
 */
export function TechBlack({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;

    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#111111',
        fontFamily: 'Pretendard, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };

    const bleedIndicator = showBleed && (
        <div
            style={{
                position: 'absolute',
                inset: `${bleedPx}px`,
                border: '1px dashed rgba(255,255,255,0.1)',
                pointerEvents: 'none',
                zIndex: 10,
            }}
        />
    );

    // Simulated Metallic Grain/Noise
    const NoiseLayer = () => (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.05,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                pointerEvents: 'none',
            }}
        />
    );

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <NoiseLayer />

                {/* Content Container */}
                <div
                    style={{
                        position: 'absolute',
                        inset: `${bleedPx}px`,
                        padding: '24px 32px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Top Row: Logo & Chip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Fake IC Chip */}
                        <div
                            style={{
                                width: '44px',
                                height: '32px',
                                background: 'linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 100%)',
                                borderRadius: '4px',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                            }}
                        >
                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.2)' }} />
                            <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.2)' }} />
                            <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.2)' }} />
                            <div style={{ position: 'absolute', top: '30%', left: '33%', right: '33%', height: '40%', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '2px' }} />
                        </div>

                        {/* Network Icon / Logo */}
                        {data.logo ? (
                            <img src={data.logo} alt="logo" style={{ height: '24px', filter: 'brightness(0) invert(1)' }} />
                        ) : (
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>
                                INFINITE
                            </div>
                        )}
                    </div>

                    {/* Name & Title */}
                    <div>
                        <h1
                            style={{
                                fontSize: '20px',
                                fontWeight: 500,
                                color: '#ffffff',
                                margin: '0 0 4px 0',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            }}
                        >
                            {data.name || 'JAEWON LEE'}
                        </h1>
                        <p
                            style={{
                                fontSize: '10px',
                                color: 'rgba(255,255,255,0.6)',
                                margin: 0,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {data.title || 'MEMBER SINCE 2024'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Back Side
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <NoiseLayer />

            {/* Magnetic Stripe */}
            <div
                style={{
                    position: 'absolute',
                    top: `${bleedPx + 20}px`,
                    left: 0,
                    right: 0,
                    height: '40px',
                    background: '#000000',
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    inset: `${bleedPx}px`,
                    padding: '70px 32px 24px 32px', // Top padding clears stripe
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                }}
            >
                {/* Info Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '9px', color: '#666', marginBottom: '8px' }}>
                        AUTHORIZED SIGNATURE NOT REQUIRED
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#ccc' }}>
                        <span style={{ color: '#888' }}>M.</span> {data.phone}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#ccc' }}>
                        <span style={{ color: '#888' }}>E.</span> {data.email}
                    </div>
                    {data.website && (
                        <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#ccc' }}>
                            <span style={{ color: '#888' }}>W.</span> {data.website}
                        </div>
                    )}
                </div>

                {/* QR Code */}
                <div style={{ background: '#fff', padding: '4px', borderRadius: '4px' }}>
                    <QRCode
                        value={data.website || `mailto:${data.email}`}
                        size={48}
                        level="L"
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                </div>
            </div>
        </div>
    );
}
