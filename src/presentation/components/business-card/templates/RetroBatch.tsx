'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

// 1. Retro Cassette (80s vibe)
export function RetroCassette({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#333',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Cassette Label Area */}
                <div style={{ position: 'absolute', inset: `${bleedPx + 10}px`, background: '#f59e0b', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Top Label */}
                    <div style={{ width: '100%', height: '40px', background: '#333', marginBottom: '10px', display: 'flex', alignItems: 'center', padding: '0 20px', color: '#fff', fontSize: '10px', fontWeight: 700 }}>
                        SIDE A: {data.company.toUpperCase() || 'MIXTAPE VOL.1'}
                    </div>
                    {/* Spools */}
                    <div style={{ display: 'flex', gap: '60px', alignItems: 'center', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: '6px solid #333' }} />
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: '6px solid #333' }} />
                    </div>
                    {/* Name (Handwritten style) */}
                    <div style={{ fontFamily: 'cursive', fontSize: '24px', color: '#1a1a1a', fontWeight: 700, marginTop: '10px' }}>
                        {data.name}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx + 10}px`, background: '#f0f0f0', borderRadius: '12px', padding: '24px' }}>
                {/* Tracklist style info */}
                <div style={{ borderBottom: '2px solid #333', paddingBottom: '8px', marginBottom: '12px', fontWeight: 800 }}>SIDE B: CONTACTS</div>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', lineHeight: 2 }}>
                    <div>01. {data.phone || 'Unknown Track'}</div>
                    <div>02. {data.email || 'No Email'}</div>
                    <div>03. {data.title || 'Role'}</div>
                    <div>04. {data.website || 'Hidden Track'}</div>
                </div>
                <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
                    <QRCode value={data.website || `mailto:${data.email}`} size={48} level="L" />
                </div>
            </div>
        </div>
    );
}

// 2. Game Card (TCG)
export function GameCard({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        background: data.primaryColor || '#dc2626',
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx + 8}px`, background: '#fff4e6', border: '4px solid #fcd34d', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb' }}>
                        <div style={{ fontWeight: 800, fontSize: '14px' }}>{data.name}</div>
                        <div style={{ color: '#dc2626', fontWeight: 800, fontSize: '14px' }}>HP 100</div>
                    </div>
                    {/* Image Frame */}
                    <div style={{ margin: '8px', height: '80px', background: '#e5e5e5', border: '2px solid #a3a3a3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {data.logo ? <img src={data.logo} style={{ height: '60%', objectFit: 'contain' }} /> : <span style={{ fontSize: '30px' }}>👾</span>}
                    </div>
                    {/* Stats/Moves */}
                    <div style={{ padding: '0 12px', fontSize: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700 }}>Job Class</span>
                            <span>{data.title}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700 }}>Guild</span>
                            <span>{data.company}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            {/* Card Back Design */}
            <div style={{ position: 'absolute', inset: `${bleedPx + 15}px`, background: '#1d4ed8', borderRadius: '12px', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>PLAYER INFO</div>
                    <div style={{ fontSize: '10px', marginBottom: '4px' }}>{data.phone}</div>
                    <div style={{ fontSize: '10px', marginBottom: '12px' }}>{data.email}</div>
                    <div style={{ background: 'white', padding: '4px', display: 'inline-block', borderRadius: '4px' }}>
                        <QRCode value={data.website || `mailto:${data.email}`} size={40} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// 3. Windows 95
export function Win95OS({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        background: '#008080', // Teal
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />;

    const windowStyle: React.CSSProperties = {
        background: '#c0c0c0',
        borderTop: '2px solid #fff',
        borderLeft: '2px solid #fff',
        borderRight: '2px solid #000',
        borderBottom: '2px solid #000',
        display: 'flex',
        flexDirection: 'column',
    };

    const titleBarStyle: React.CSSProperties = {
        background: '#000080',
        color: 'white',
        padding: '2px 4px',
        fontSize: '11px',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', top: `${bleedPx + 40}px`, left: `${bleedPx + 40}px`, width: '280px', height: '120px', ...windowStyle }}>
                    <div style={titleBarStyle}>
                        <span>Properties for {data.name}</span>
                        <div style={{ width: '12px', height: '12px', background: '#c0c0c0', border: '1px solid white', borderRight: '1px solid black', borderBottom: '1px solid black', fontSize: '10px', lineHeight: '10px', textAlign: 'center', color: 'black' }}>x</div>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ fontSize: '30px' }}>💾</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{data.name}</div>
                            <div style={{ fontSize: '12px' }}>{data.title}</div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{data.company}</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 'auto', padding: '8px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <div style={{ border: '1px solid #000', background: '#c0c0c0', padding: '2px 12px', fontSize: '11px', boxShadow: 'inset 1px 1px #fff, 1px 1px #000' }}>OK</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', top: `${bleedPx + 20}px`, left: `${bleedPx + 20}px`, width: '320px', height: '160px', ...windowStyle }}>
                <div style={titleBarStyle}>
                    <span>Contact.exe</span>
                </div>
                <div style={{ padding: '12px', fontSize: '11px' }}>
                    <div style={{ background: 'white', border: '1px solid #888', padding: '8px', height: '100px', overflow: 'hidden' }}>
                        &gt; Phone: {data.phone}<br />
                        &gt; Email: {data.email}<br />
                        &gt; Addr: {data.address}<br />
                        &gt; Web: {data.website}<br />
                        <br />
                        _
                    </div>
                </div>
            </div>
        </div>
    );
}

// 4. Polaroid Photo
export function PolaroidPhoto({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#1a1a1a', // Dark table background
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Photo Paper */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-3deg)',
                    width: '240px', height: '280px', // Scaled roughly
                    background: 'white',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                    padding: '12px 12px 40px 12px',
                    display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ flex: 1, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                        {data.logo ? <img src={data.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: '40px', opacity: 0.3 }}>📷</div>}
                        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }} />
                    </div>
                    <div style={{ height: '30px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div style={{ fontFamily: 'cursive', fontSize: '18px', color: '#333' }}>{data.name}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            {/* Back of Photo (Handwritten) */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%) rotate(2deg)',
                width: '240px', height: '160px',
                background: '#fffcd1', // Yellowish aged paper
                boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
                padding: '20px',
                fontFamily: 'cursive',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'blue'
            }}>
                <div>My Details:</div>
                <div>{data.phone}</div>
                <div>{data.email}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>{data.company}</div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', opacity: 0.8 }}>
                    <QRCode value={data.website || ''} size={40} />
                </div>
            </div>
        </div>
    );
}
