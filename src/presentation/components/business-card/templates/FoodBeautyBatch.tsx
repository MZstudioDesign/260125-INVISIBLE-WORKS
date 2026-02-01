'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

// ==========================================
// FOOD INDUSTRY TEMPLATES
// ==========================================

export function CafeMinimal({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fffbeb', // Warm beige
        fontFamily: '"Helvetica Neue", sans-serif',
        position: 'relative',
        overflow: 'hidden',
        color: '#78350f', // Brown
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '2px', borderBottom: '1px solid #78350f', paddingBottom: '8px', marginBottom: '8px' }}>
                        {data.company}
                    </div>
                    <div style={{ fontSize: '12px', fontStyle: 'italic', opacity: 0.8 }}>Specialty Coffee & Bakery</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{data.name}</div>
                <div style={{ fontSize: '12px', marginBottom: '16px', opacity: 0.8 }}>{data.title}</div>

                <div style={{ fontSize: '11px', textAlign: 'center', lineHeight: 1.6 }}>
                    {data.phone} • {data.email}<br />
                    {data.address}<br />
                    {data.website}
                </div>
            </div>
        </div>
    );
}

export function BistroBold({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontFamily: '"Times New Roman", serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', letterSpacing: '1px', marginBottom: '8px', color: '#fbbf24' }}>EST. 2024</div>
                        <div style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.1 }}>{data.company}</div>
                    </div>
                    {/* Fork/Knife Icon Sim */}
                    <div style={{ fontSize: '40px' }}>🍽️</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff', color: '#000' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{data.name}</div>
                <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#666', marginBottom: '16px' }}>{data.title}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
                    <div style={{ fontSize: '11px', lineHeight: 1.8 }}>
                        <div>T: {data.phone}</div>
                        <div>E: {data.email}</div>
                        <div>A: {data.address}</div>
                    </div>
                    <QRCode value={data.website || ''} size={48} />
                </div>
            </div>
        </div>
    );
}

export function OrganicFresh({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#f0fdf4', // Light green
        color: '#15803d',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Leaf Graphic (CSS circle) */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: '#bbf7d0', borderRadius: '50%', opacity: 0.5 }} />
                <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', background: '#bbf7d0', borderRadius: '50%', opacity: 0.5 }} />

                <div style={{ position: 'absolute', inset: `${bleedPx}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#166534' }}>{data.company}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#4ade80', background: '#14532d', padding: '2px 8px', borderRadius: '10px', marginTop: '8px' }}>FRESH & HEALTHY</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#166534', marginBottom: 'auto' }}>{data.title}</div>

                <div style={{ fontSize: '11px', lineHeight: 1.8, borderTop: '1px solid #bbf7d0', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}><span>📍</span> {data.address}</div>
                    <div style={{ display: 'flex', gap: '8px' }}><span>📞</span> {data.phone}</div>
                    <div style={{ display: 'flex', gap: '8px' }}><span>🌐</span> {data.website}</div>
                </div>
            </div>
        </div>
    );
}

export function BurgerPop({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#ef4444', // Red
        color: '#fff',
        fontFamily: '"Arial Black", sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, background: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 10px, #dc2626 10px, #dc2626 20px)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fbbf24', color: '#dc2626', padding: '10px 20px', transform: 'rotate(-5deg)', boxShadow: '4px 4px 0 #000', border: '2px solid #000' }}>
                        <div style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase' }}>{data.company}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fbbf24', color: '#000' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px' }}>
                <div style={{ fontSize: '20px', fontWeight: 900 }}>{data.name}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', color: '#dc2626' }}>{data.title}</div>

                <div style={{ background: '#fff', padding: '12px', border: '2px solid #000', borderRadius: '8px', fontSize: '11px', fontWeight: 700 }}>
                    <div>CALL: {data.phone}</div>
                    <div>VISIT: {data.address}</div>
                    <div>WEB: {data.website}</div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// BEAUTY INDUSTRY TEMPLATES
// ==========================================

export function SoftElegance({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff1f2', // Rose 50
        color: '#881337', // Rose 900
        fontFamily: '"Times New Roman", serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: '#fce7f3' }} />
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '26px', fontStyle: 'italic' }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>{data.name}</div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', opacity: 0.7 }}>{data.title}</div>

                <div style={{ fontSize: '11px', lineHeight: 1.8 }}>
                    {data.phone} | {data.email}<br />
                    {data.address}
                </div>
            </div>
        </div>
    );
}

export function ModernChic({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px solid #d4af37' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '20px', letterSpacing: '4px', fontWeight: 300 }}>{data.company.toUpperCase()}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff', color: '#000' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ borderLeft: '2px solid #000', paddingLeft: '16px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{data.title}</div>
                </div>
                <div style={{ marginTop: '30px', fontSize: '11px', fontWeight: 500 }}>
                    <div>{data.phone}</div>
                    <div>{data.email}</div>
                    <div>{data.address}</div>
                </div>
            </div>
        </div>
    );
}

export function NailArtPop({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#f3e8ff', // Purple 100
        color: '#7e22ce',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Abstract Blobs */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '60px', height: '60px', background: '#e879f9', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '20px', right: '40px', width: '80px', height: '80px', background: '#60a5fa', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '40px', right: '-20px', width: '100px', height: '100px', background: '#facc15', borderRadius: '50%', opacity: 0.8 }} />

                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.8)', padding: '10px 20px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#333' }}>{data.company}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#c084fc', marginBottom: '8px' }}>{data.name}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '20px' }}>{data.title}</div>

                <div style={{ fontSize: '11px', textAlign: 'right', color: '#666' }}>
                    {data.phone}<br />
                    {data.email}<br />
                    <span style={{ color: '#c084fc' }}>{data.website}</span>
                </div>
            </div>
        </div>
    );
}

export function SpaZen({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#e7e5e4', // Warm gray
        color: '#44403c',
        fontFamily: '"Times New Roman", serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', border: '1px solid #a8a29e', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '2px' }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{data.name}</div>
                    <div style={{ fontSize: '11px', color: '#78716c', marginTop: '4px' }}>{data.title}</div>
                    <div style={{ width: '30px', height: '1px', background: '#78716c', margin: '12px 0' }} />
                    <div style={{ fontSize: '11px' }}>{data.phone}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px', color: '#78716c' }}>
                    {data.address}<br />
                    {data.website}
                </div>
            </div>
        </div>
    );
}
