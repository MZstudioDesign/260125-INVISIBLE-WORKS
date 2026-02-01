'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

/**
 * 바우하우스 지오 (Bauhaus Geo)
 * - 기하학적 도형과 원색의 조화
 * - 구성주의, 바우하우스 스타일
 * - 앞면: 강렬한 도형 구성
 * - 뒷면: 깔끔한 그리드와 라인
 * - 무드: Artistic, Vivid, Geometric
 */
export function BauhausGeo({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;

    // Bauhaus Palette
    const colors = {
        bg: '#f0f0f0', // Off-white
        red: '#e63946',
        blue: '#1d3557',
        yellow: '#f4a261', // Slightly muted yellow for text readability
        dark: '#1a1a1a',
    };

    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: colors.bg,
        fontFamily: 'Pretendard, Helvetica, Arial, sans-serif',
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

                {/* Geometric Shapes */}

                {/* Large Circle (Yellow) */}
                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: colors.yellow, opacity: 0.9 }} />

                {/* Rectangle (Blue) */}
                <div style={{ position: 'absolute', top: '0', right: '40px', width: '60px', height: '300px', background: colors.blue }} />

                {/* Small Circle (Red) */}
                <div style={{ position: 'absolute', bottom: '30px', right: '80px', width: '40px', height: '40px', borderRadius: '50%', background: colors.red }} />

                {/* Line */}
                <div style={{ position: 'absolute', top: '120px', left: '0', right: '0', height: '8px', background: 'rgba(0,0,0,0.8)' }} />

                {/* Content */}
                <div
                    style={{
                        position: 'absolute',
                        inset: `${bleedPx}px`,
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        zIndex: 1,
                    }}
                >
                    <h1
                        style={{
                            fontSize: '32px',
                            fontWeight: 900,
                            color: colors.dark,
                            margin: '0 0 4px 0',
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                            mixBlendMode: 'multiply',
                        }}
                    >
                        {data.name}
                    </h1>
                    <p
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: colors.red,
                            margin: 0,
                            textTransform: 'uppercase',
                        }}
                    >
                        {data.title}
                    </p>
                </div>
            </div>
        );
    }

    // Back Side
    return (
        <div style={containerStyle}>
            {bleedIndicator}

            {/* Decorative Side Bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: `${bleedPx + 20}px`, bottom: 0, background: colors.blue }} />

            <div
                style={{
                    position: 'absolute',
                    inset: `${bleedPx}px`,
                    padding: '24px 24px 24px 44px', // Left padding accounts for bar
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                {/* Top: Company */}
                <div style={{ borderBottom: `2px solid ${colors.dark}`, paddingBottom: '12px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: colors.dark, margin: 0 }}>{data.company}</h2>
                </div>

                {/* Middle: Contact Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: colors.dark }}>{data.phone}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: colors.dark }}>{data.email}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>{data.address}</div>
                    </div>

                    {/* QR Code Frame */}
                    <div style={{ border: `2px solid ${colors.dark}`, padding: '4px', background: '#fff' }}>
                        <QRCode
                            value={data.website || `mailto:${data.email}`}
                            size={56}
                            level="M"
                            bgColor="#ffffff"
                            fgColor={colors.dark}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
