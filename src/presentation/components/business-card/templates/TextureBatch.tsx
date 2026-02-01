'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

// 8. Shipping Label (DHL/FedEx style)
export function ShippingLabel({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fbbf24', // Amber/Yellow
        fontFamily: '"Arial Black", Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, display: 'flex', flexDirection: 'column' }}>
                    {/* Top Bar */}
                    <div style={{ height: '40px', background: 'black', color: '#fbbf24', display: 'flex', alignItems: 'center', padding: '0 16px', fontWeight: 900, fontSize: '18px', justifyContent: 'space-between' }}>
                        <span>PRIORITY</span>
                        <span>EXP</span>
                    </div>
                    {/* Main Area */}
                    <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', color: 'black' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700 }}>FROM:</div>
                        <div style={{ fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>{data.name.toUpperCase()}</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>{data.company.toUpperCase()}</div>

                        <div style={{ marginTop: 'auto', borderTop: '4px solid black', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: 700 }}>ROLE:</div>
                                <div style={{ fontSize: '14px', fontWeight: 700 }}>{data.title.toUpperCase()}</div>
                            </div>
                            {/* Fake Barcode */}
                            <div style={{ height: '30px', width: '100px', background: 'repeating-linear-gradient(90deg, black 0px, black 2px, transparent 2px, transparent 4px)' }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '20px' }}>
                <div style={{ border: '4px solid black', height: '100%', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700 }}>CONTACT DETAILS:</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px' }}>{data.phone}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{data.email}</div>
                    <div style={{ fontSize: '12px', marginTop: '8px', width: '70%' }}>{data.address}</div>

                    <div style={{ position: 'absolute', bottom: '30px', right: '30px', border: '2px solid black', padding: '4px' }}>
                        <QRCode value={data.website || ''} size={60} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// 9. Eco Kraft (Paper texture)
export function EcoKraft({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#d4c5a9', // Kraft color
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E")',
        fontFamily: '"Times New Roman", serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    const stampColor = '#166534'; // Green stamp

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: 'double 4px #5c4d32', margin: '10px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#3f2e18', letterSpacing: '1px' }}>{data.name}</div>
                    <div style={{ width: '40px', height: '1px', background: '#3f2e18', margin: '8px 0' }} />
                    <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#5c4d32' }}>{data.title}</div>

                    {/* Stamp Effect */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        border: `2px solid ${stampColor}`,
                        color: stampColor,
                        padding: '4px 8px',
                        transform: 'rotate(-10deg)',
                        opacity: 0.8,
                        fontSize: '10px',
                        fontWeight: 700,
                        borderRadius: '4px'
                    }}>
                        ORGANIC 100%
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px' }}>
                    <div style={{ color: '#3f2e18', fontSize: '11px', lineHeight: 1.8 }}>
                        <strong>T.</strong> {data.phone}<br />
                        <strong>E.</strong> {data.email}<br />
                        <strong>A.</strong> {data.address}<br />
                        <strong>W.</strong> {data.website}
                    </div>
                    <div>
                        <QRCode value={data.website || ''} size={60} fgColor="#3f2e18" bgColor="transparent" />
                    </div>
                </div>
                <div style={{ marginTop: '20px', fontSize: '10px', textAlign: 'center', color: '#5c4d32' }}>
                    Sustainable Design Studio • {data.company}
                </div>
            </div>
        </div>
    );
}

// 10. Liquid Marbling
export function LiquidMarbling({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;

    // Simulated Marble SVG
    const marbleBg = {
        background: '#ffffff',
        backgroundImage: `radial-gradient(at 40% 20%, ${data.primaryColor} 0px, transparent 50%),
    radial-gradient(at 80% 0%, #a78bfa 0px, transparent 50%),
    radial-gradient(at 0% 50%, #f472b6 0px, transparent 50%),
    radial-gradient(at 80% 50%, #34d399 0px, transparent 50%),
    radial-gradient(at 0% 100%, #60a5fa 0px, transparent 50%),
    radial-gradient(at 80% 100%, ${data.primaryColor} 0px, transparent 50%),
    radial-gradient(at 0% 0%, #fbbf24 0px, transparent 50%)`,
        filter: 'blur(20px)',
    };

    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={{ ...containerStyle }}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: 0, ...marbleBg, transform: 'scale(1.2)' }} />

                <div style={{ position: 'absolute', inset: `${bleedPx}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '30px 50px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <h1 style={{ fontFamily: 'serif', fontSize: '28px', color: '#1a1a1a', margin: 0, fontStyle: 'italic' }}>{data.name}</h1>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '40px', background: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#1a1a1a', textAlign: 'center', fontSize: '12px', lineHeight: 2, letterSpacing: '0.05em' }}>
                    <div>{data.title} at {data.company}</div>
                    <div style={{ width: '20px', height: '1px', background: '#ccc', margin: '16px auto' }} />
                    <div>{data.phone}</div>
                    <div>{data.email}</div>
                    <div style={{ marginTop: '16px' }}>
                        <a href={data.website} style={{ color: data.primaryColor, textDecoration: 'none', fontWeight: 600 }}>{data.website}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
