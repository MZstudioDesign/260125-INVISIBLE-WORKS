'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

// ==========================================
// MEDICAL INDUSTRY TEMPLATES
// ==========================================

export function ClinicClean({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff',
        color: '#0284c7', // Sky 600
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '40%', background: '#f0f9ff' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1 }}>
                        <div style={{ fontSize: '30px' }}>✚</div>
                        <div style={{ fontSize: '22px', fontWeight: 600 }}>{data.company}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#000' }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>{data.title}</div>

                <div style={{ fontSize: '11px', color: '#444', lineHeight: 1.8 }}>
                    {data.phone} | {data.email}<br />
                    {data.address}
                </div>
            </div>
        </div>
    );
}

export function DentalSmile({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#ecfdf5', // Mint 50
        color: '#059669', // Emerald 600
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Smile curve */}
                <div style={{ position: 'absolute', bottom: '40px', left: '20%', right: '20%', height: '40px', borderBottom: '4px solid #34d399', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '-20px' }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#34d399', marginBottom: '16px' }}>{data.title}</div>
                <div style={{ fontSize: '11px', textAlign: 'center' }}>
                    Tel. {data.phone}<br />
                    Web. {data.website}
                </div>
            </div>
        </div>
    );
}

export function OrientalHerbal({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#f5f5f4', // Warm grey
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E")',
        color: '#451a03', // Amber 900
        fontFamily: '"Batang", "Times New Roman", serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '40px', opacity: 0.1 }}>韓</div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ border: '2px solid #451a03', padding: '16px 24px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 600 }}>{data.company}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '20px', fontWeight: 600 }}>{data.name}</div>
                    <div style={{ fontSize: '14px' }}>{data.title}</div>
                </div>
                <div style={{ borderBottom: '1px solid #451a03', margin: '8px 0 16px 0' }} />
                <div style={{ fontSize: '12px', lineHeight: 1.8 }}>
                    {data.address}<br />
                    {data.phone}
                </div>
            </div>
        </div>
    );
}

export function PediatricCare({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff',
        color: '#444',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Soft Blobs */}
                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: '#fecaca', borderRadius: '50%', opacity: 0.6 }} />
                <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: '#bfdbfe', borderRadius: '50%', opacity: 0.6 }} />

                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, zIndex: 1 }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#f472b6' }}>{data.name}</div>
                <div style={{ fontSize: '12px', marginBottom: '12px' }}>{data.title}</div>
                <div style={{ background: '#f3f4f6', padding: '10px', borderRadius: '8px', fontSize: '11px' }}>
                    {data.phone} • {data.address}
                </div>
            </div>
        </div>
    );
}


// ==========================================
// BRAND INDUSTRY TEMPLATES
// ==========================================

export function StartupRocket({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        background: 'linear-gradient(135deg, #4f46e5, #ec4899)',
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
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '30px', fontWeight: 900 }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, background: '#fff', color: '#1f2937' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 600, marginBottom: '20px' }}>{data.title}</div>

                <div style={{ fontSize: '11px', color: '#4b5563' }}>
                    {data.email}<br />
                    {data.website}
                </div>
            </div>
        </div>
    );
}

export function MakerIndustrial({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#334155', // Slate
        color: '#fff',
        fontFamily: 'monospace',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Blueprint Grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ border: '2px solid #fff', padding: '10px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700 }}>{data.company}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff', color: '#000' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#666', borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '8px' }}>{data.title}</div>
                <div style={{ fontSize: '11px' }}>
                    ITEM: BUSINESS CARD<br />
                    REF: {data.phone}
                </div>
            </div>
        </div>
    );
}

export function LeatherCraft({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#451a03', // Dark Leather
        color: '#d4c5a9', // Gold/Tan
        fontFamily: 'serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx + 10}px`, border: '1px dashed #78350f' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '24px', letterSpacing: '2px' }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 400 }}>{data.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '12px' }}>{data.title}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>
                    {data.phone}
                </div>
            </div>
        </div>
    );
}

export function EcoPackage({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#b45309', // Cardboard color
        color: '#000',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ border: '4px solid #000', padding: '10px 20px', fontSize: '22px', fontWeight: 900 }}>
                        {data.company}
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', fontWeight: 700 }}>RECYCLABLE ♻</div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#d1d5db' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
                <div style={{ fontSize: '12px', marginBottom: '16px' }}>{data.title}</div>

                <div style={{ fontSize: '10px', background: '#fff', padding: '8px', display: 'inline-block' }}>
                    {data.address}<br />
                    {data.website}
                </div>
            </div>
        </div>
    );
}
