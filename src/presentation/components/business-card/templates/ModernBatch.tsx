'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

// 5. SNS Profile (Insta style)
export function SnsProfile({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', padding: '2px' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', padding: '2px' }}>
                                {data.logo ? <img src={data.logo} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#eee' }} />}
                            </div>
                        </div>
                        <div style={{ marginLeft: '24px', flex: 1 }}>
                            <div style={{ display: 'flex', gap: '30px', textAlign: 'center' }}>
                                <div><div style={{ fontWeight: 700 }}>1.2k</div><div style={{ fontSize: '10px', color: '#888' }}>Projects</div></div>
                                <div><div style={{ fontWeight: 700 }}>80k</div><div style={{ fontSize: '10px', color: '#888' }}>Followers</div></div>
                                <div><div style={{ fontWeight: 700 }}>240</div><div style={{ fontSize: '10px', color: '#888' }}>Following</div></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{data.name}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{data.title}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                            {data.slogan || `Designer @ ${data.company}`}
                        </div>
                        <div style={{ fontSize: '11px', color: '#00376b', marginTop: '2px' }}>{data.website}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid #dbdbdb' }}>
                    <QRCode value={data.website || `mailto:${data.email}`} size={80} level="M" />
                </div>
                <div style={{ marginTop: '16px', background: '#efefef', padding: '8px 40px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                    Follow
                </div>
                <div style={{ marginTop: '12px', fontSize: '11px', color: '#888' }}>
                    {data.email}
                </div>
            </div>
        </div>
    );
}

// 6. Lucid Plastic (Transparent/Frosted)
export function LucidPlastic({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#e2e8f0', // Slate 200
        fontFamily: 'Pretendard, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(0,0,0,0.1)', pointerEvents: 'none', zIndex: 10 }} />;

    const cardStyle: React.CSSProperties = {
        position: 'absolute',
        inset: `${bleedPx + 10}px`,
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.25)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        // Note: backdrop-filter support in html2canvas is limited, using semi-transparent layers primarily
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
    };

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Soft blob background */}
                <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at 60% 40%, ${data.primaryColor}88, transparent 40%)` }} />

                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5, letterSpacing: '2px' }}>LUCID CARD</div>
                        {data.logo && <img src={data.logo} style={{ height: '20px', opacity: 0.8 }} />}
                    </div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '-0.5px' }}>{data.name}</div>
                        <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px', opacity: 0.7 }}>{data.title}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: data.primaryColor, filter: 'blur(80px)', opacity: 0.4 }} />

            <div style={cardStyle}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{data.email}</div>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{data.phone}</div>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{data.company}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', opacity: 0.8 }}>
                    <QRCode value={data.website || ''} size={48} bgColor="transparent" />
                </div>
            </div>
        </div>
    );
}

// 7. Neon Cyber
export function NeonCyber({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;
    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#050505',
        fontFamily: '"Orbitron", "Exo 2", sans-serif', // Assuming fallback if not loaded
        position: 'relative',
        overflow: 'hidden',
        color: '#0ef',
    };
    const bleedIndicator = showBleed && <div style={{ position: 'absolute', inset: `${bleedPx}px`, border: '1px dashed rgba(255,255,255,0.2)', pointerEvents: 'none', zIndex: 10 }} />;

    const neonText = {
        textShadow: `0 0 5px ${data.primaryColor}, 0 0 10px ${data.primaryColor}`,
        color: '#fff',
    };

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}
                {/* Grid Background */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)' }} />

                <div style={{ position: 'absolute', inset: `${bleedPx}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    {/* Border Frame */}
                    <div style={{ position: 'absolute', inset: '20px', border: `2px solid ${data.primaryColor}`, boxShadow: `0 0 15px ${data.primaryColor}`, opacity: 0.8 }} />

                    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0, ...neonText, letterSpacing: '4px' }}>
                        {data.name.toUpperCase()}
                    </h1>
                    <div style={{ width: '100px', height: '2px', background: data.primaryColor, margin: '12px 0', boxShadow: `0 0 10px ${data.primaryColor}` }} />
                    <div style={{ color: data.primaryColor, letterSpacing: '2px', fontSize: '12px' }}>
                        {data.title.toUpperCase()}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            {bleedIndicator}
            <div style={{ position: 'absolute', inset: `${bleedPx}px`, padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ ...neonText, fontSize: '12px' }}>SYSTEM.CONNECT( {data.phone} )</div>
                        <div style={{ ...neonText, fontSize: '12px' }}>MAIL.SEND( {data.email} )</div>
                        <div style={{ ...neonText, fontSize: '12px' }}>LOC.PING( {data.address || 'UNKNOWN'} )</div>
                    </div>
                    <div style={{ border: `1px solid ${data.primaryColor}`, padding: '4px', boxShadow: `0 0 10px ${data.primaryColor}` }}>
                        <QRCode value={data.website || ''} size={60} bgColor="#000" fgColor={data.primaryColor} />
                    </div>
                </div>
            </div>
        </div>
    );
}
