'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

// ==========================================
// OFFICE INDUSTRY TEMPLATES
// ==========================================

export function LawFirmClassic({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#172554', // Navy
        color: '#fbbf24', // Gold
        fontFamily: '"Times New Roman", serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx + 5}px`, border: '1px solid #fbbf24' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ fontSize: '24px', letterSpacing: '2px', fontWeight: 600 }}>{data.company}</div>
                    <div style={{ fontSize: '10px', letterSpacing: '4px', marginTop: '8px' }}>ATTORNEYS AT LAW</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff', color: '#172554' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
                <div style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '16px' }}>{data.title}</div>

                <div style={{ fontSize: '11px', borderTop: '1px solid #172554', paddingTop: '12px', width: '100%' }}>
                    {data.address} | {data.phone}
                </div>
            </div>
        </div>
    );
}

export function FinanceChart({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#064e3b', // Dark green
        color: '#fff',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Simple Bar Chart SIm */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', display: 'flex', alignItems: 'flex-end', opacity: 0.2 }}>
                    <div style={{ flex: 1, height: '40%', background: '#fff', margin: '0 2px' }}></div>
                    <div style={{ flex: 1, height: '70%', background: '#fff', margin: '0 2px' }}></div>
                    <div style={{ flex: 1, height: '50%', background: '#fff', margin: '0 2px' }}></div>
                    <div style={{ flex: 1, height: '90%', background: '#fff', margin: '0 2px' }}></div>
                    <div style={{ flex: 1, height: '60%', background: '#fff', margin: '0 2px' }}></div>
                </div>

                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, zIndex: 1 }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff', color: '#064e3b' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#059669', marginBottom: '20px' }}>{data.title}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
                    <div style={{ fontSize: '11px', lineHeight: 1.6 }}>
                        {data.phone}<br />
                        {data.email}<br />
                        {data.website}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ArchitectLine({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: '"Helvetica Neue", sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', left: '40px', top: '40px', bottom: '40px', width: '1px', background: '#000' }} />
                <div style={{ position: 'absolute', left: '40px', top: '40px', width: '280px', height: '1px', background: '#000' }} />

                <div style={{ position: 'absolute', bottom: '45px', right: '45px', fontSize: '20px', fontWeight: 300 }}>{data.company}</div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ fontSize: '16px', fontWeight: 400, letterSpacing: '1px' }}>{data.name}</div>
                <div style={{ fontSize: '10px', color: '#666', marginBottom: '20px' }}>{data.title}</div>

                <div style={{ fontSize: '10px', color: '#444' }}>
                    {data.address}<br />
                    {data.phone}
                </div>
            </div>
        </div>
    );
}

export function ConsultingTrust({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#334155',
        color: '#fff',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', background: '#475569' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: '40px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 600 }}>{data.company}</div>
                </div>
            </div>
        );
    }
    return (
        <div style={{ ...containerStyle, backgroundColor: '#fff', color: '#1e293b' }}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: 'auto' }}>{data.title}</div>

                <div style={{ fontSize: '11px', marginTop: '20px', borderTop: '2px solid #e2e8f0', paddingTop: '12px' }}>
                    {data.phone} | {data.email}<br />
                    {data.website}
                </div>
            </div>
        </div>
    );
}
