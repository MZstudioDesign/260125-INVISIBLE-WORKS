'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

/**
 * 티켓 패스 (Ticket Pass)
 * - 보딩 패스, 공연 티켓 컨셉
 * - 절취선, 바코드, 세로형 레이아웃 요소 사용
 * - 앞면: 티켓 스터브가 있는 독특한 레이아웃
 * - 뒷면: 바코드와 핵심 정보
 * - 무드: Fun, Concept, Unique
 */
export function TicketPass({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;

    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: data.primaryColor || '#f97316',
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

    // Use contrasting text color
    const isDark = (color: string) => {
        // Basic check, not perfect but okay for now
        return color === '#000000' || color.startsWith('#1') || color.startsWith('#2') || color.startsWith('#3');
    }
    const textColor = '#1a1a1a'; // We force white paper look for ticket usually

    // Layout: White ticket on colored background (full bleed handling needed)
    // Actually, let's make the card look like the ticket itself, so bg color is paper color (usually white)
    // and accents are primary color.

    const paperStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        position: 'relative',
        display: 'flex',
    };

    if (side === 'front') {
        return (
            <div style={{ ...containerStyle, padding: `${bleedPx}px`, backgroundColor: '#ffffff' }}>
                {bleedIndicator}

                <div style={paperStyle}>
                    {/* Left Section (Main) */}
                    <div style={{ flex: 1, padding: '24px', borderRight: '2px dashed #ddd', position: 'relative' }}>
                        {/* Cutout notch simulation */}
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '20px', height: '20px', background: '#333', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '20px', height: '20px', background: '#333', borderRadius: '50%' }} />

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: data.primaryColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                ONE WAY TICKET
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#ccc' }}>
                                NO. 082490
                            </div>
                        </div>

                        {/* Name */}
                        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1a1a1a', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                            {data.name}
                        </h1>
                        <p style={{ fontSize: '12px', fontWeight: 500, color: '#888', margin: 0, textTransform: 'uppercase' }}>
                            {data.title} @ {data.company}
                        </p>

                        {/* Footer Info */}
                        <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', display: 'flex', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '8px', color: '#aaa', marginBottom: '2px' }}>CONTACT</div>
                                <div style={{ fontSize: '10px', fontWeight: 600 }}>{data.phone}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '8px', color: '#aaa', marginBottom: '2px' }}>EMAIL</div>
                                <div style={{ fontSize: '10px', fontWeight: 600 }}>{data.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section (Stub) */}
                    <div style={{ width: '100px', padding: '24px 12px', backgroundColor: data.primaryColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ transform: 'rotate(90deg)', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 800, color: '#fff', letterSpacing: '0.2em' }}>
                            ADMIT ONE
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Back Side
    return (
        <div style={{ ...containerStyle, padding: `${bleedPx}px`, backgroundColor: '#ffffff' }}>
            {bleedIndicator}

            <div style={{ ...paperStyle, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>

                <div style={{ width: '100%', maxWidth: '200px', marginBottom: '24px' }}>
                    {/* Fake Barcode */}
                    <div style={{ height: '40px', background: `repeating-linear-gradient(90deg, #1a1a1a 0px, #1a1a1a 2px, transparent 2px, transparent 4px, #1a1a1a 4px, #1a1a1a 8px, transparent 8px, transparent 9px)` }} />
                    <div style={{ textAlign: 'center', fontSize: '10px', letterSpacing: '0.5em', marginTop: '4px', color: '#1a1a1a' }}>
                        {data.phone.replace(/[^0-9]/g, '') || '00293849102'}
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <QRCode
                        value={data.website || `mailto:${data.email}`}
                        size={80}
                        level="M"
                        bgColor="#ffffff"
                        fgColor="#1a1a1a"
                    />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Scan to connect</p>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: data.primaryColor, margin: '4px 0 0 0' }}>{data.website}</p>
                </div>

            </div>
        </div>
    );
}
