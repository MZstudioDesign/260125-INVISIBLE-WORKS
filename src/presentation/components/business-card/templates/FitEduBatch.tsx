'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

// ==========================================
// FITNESS INDUSTRY TEMPLATES
// ==========================================

export function PowerGym({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: '"Impact", "Arial Black", sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Slanted Slash */}
                <div style={{ position: 'absolute', top: '-50px', left: '40%', width: '100px', height: '300px', background: '#ef4444', transform: 'rotate(20deg)' }} />

                <div style={{ position: 'absolute', inset: `${bleedPx}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '40px', fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 0.9 }}>
                        {data.company}<br />
                        <span style={{ fontSize: '18px', color: '#ef4444' }}>FITNESS</span>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: 'sans-serif', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{data.name}</div>
                <div style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#ef4444', fontWeight: 700, marginBottom: '20px' }}>{data.title.toUpperCase()}</div>

                <div style={{ fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 600 }}>
                    <div style={{ marginBottom: '4px' }}>TRAIN: {data.phone}</div>
                    <div style={{ marginBottom: '4px' }}>MAIL: {data.email}</div>
                    <div>VISIT: {data.address}</div>
                </div>
            </div>
        </div>
    );
}

export function PilatesFlow({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#eff6ff', // Blue 50
        color: '#1e3a8a', // Blue 900
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', bottom: '-50px', left: '-20px', width: '200px', height: '200px', borderRadius: '50%', border: '40px solid #bfdbfe', opacity: 0.5 }} />
                <div style={{ position: 'absolute', top: '-50px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: '#dbeafe', opacity: 0.5 }} />

                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '1px' }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#60a5fa', marginBottom: '16px' }}>{data.title}</div>

                <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {data.phone}<br />{data.email}
                </div>
                <div style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
                    <QRCode value={data.website || ''} size={48} fgColor="#1e3a8a" />
                </div>
            </div>
        </div>
    );
}

export function CrossFitGrungy({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#1c1917',
        color: '#d6d3d1',
        fontFamily: '"Courier New", monospace',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: 0, border: '8px solid #44403c' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ fontSize: '12px', letterSpacing: '4px', marginBottom: '8px' }}>EST. XXXX</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', borderBottom: '4px solid #fff' }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{data.name}</div>
                <div style={{ width: '100%', height: '2px', background: '#57534e', margin: '8px 0' }} />
                <div style={{ fontSize: '12px', marginBottom: '16px' }}>{data.title}</div>

                <div style={{ fontSize: '11px' }}>
                    [TEL] {data.phone}<br />
                    [WEB] {data.website}
                </div>
            </div>
        </div>
    );
}

export function YogaBalance({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff',
        color: '#0f766e',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Simple horizon line */}
                <div style={{ position: 'absolute', top: '50%', left: '20%', right: '20%', height: '1px', background: '#0f766e' }} />
                <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 400 }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>{data.name}</div>
                <div style={{ fontSize: '11px', color: '#99f6e4', background: '#0f766e', display: 'inline-block', padding: '2px 8px', borderRadius: '10px', margin: '8px 0' }}>{data.title}</div>
                <div style={{ fontSize: '11px', marginTop: '12px' }}>
                    {data.phone} • {data.address}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// EDUCATION INDUSTRY TEMPLATES
// ==========================================

export function AcademicIvy({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#1e3a8a', // Navy
        color: '#fff',
        fontFamily: '"Times New Roman", serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '4px double #bfdbfe' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    {/* Shield Icon Sim */}
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛡️</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '1px' }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff', color: '#1e3a8a' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
                <div style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '16px' }}>{data.title}</div>

                <div style={{ fontSize: '11px' }}>
                    T. {data.phone}<br />
                    E. {data.email}<br />
                    A. {data.address}
                </div>
            </div>
        </div>
    );
}

export function KidsSchool({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff',
        color: '#333',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Playful Shapes */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px', background: '#facc15', borderRadius: '0 0 100% 0' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100px', height: '100px', background: '#3b82f6', borderRadius: '100% 0 0 0' }} />

                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '4px dashed #fcd34d' }} />
            <div style={{ position: 'absolute', inset: `${bleedPx + 10}px`, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{data.name}</div>
                <div style={{ fontSize: '14px', marginBottom: '12px' }}>{data.title}</div>
                <div style={{ fontSize: '12px', background: '#e5e7eb', padding: '4px 12px', borderRadius: '10px' }}>{data.phone}</div>
            </div>
        </div>
    );
}

export function MathGrid({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff',
        backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#0e7490',
        fontFamily: '"Courier New", monospace',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ border: '2px solid #0e7490', padding: '10px 20px', background: '#fff' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700 }}>∑ {data.company}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
                <div style={{ fontSize: '12px', marginBottom: '16px' }}>{data.title}</div>

                <div style={{ fontSize: '12px' }}>
                    y = {data.phone}<br />
                    x = {data.email}
                </div>
            </div>
        </div>
    );
}

export function LanguageTalk({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#ffedd5', // Orange 50
        color: '#c2410c', // Orange 700
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', background: '#fff', padding: '10px 20px', borderRadius: '20px' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800 }}>{data.company}</div>
                        {/* Bubble tail */}
                        <div style={{ position: 'absolute', bottom: '-10px', left: '20px', width: '20px', height: '20px', background: '#fff', transform: 'rotate(45deg)' }} />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>{data.name}</div>
                    <div style={{ fontSize: '12px', marginBottom: '12px' }}>{data.title}</div>
                    <div style={{ fontSize: '12px' }}>{data.phone}</div>
                </div>
                <div style={{ background: '#fff', padding: '4px', borderRadius: '4px' }}>
                    <QRCode value={data.website || ''} size={60} />
                </div>
            </div>
        </div>
    );
}
