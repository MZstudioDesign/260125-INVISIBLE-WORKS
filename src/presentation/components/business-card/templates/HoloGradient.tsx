'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

/**
 * 홀로 그라디언트 (Holo Gradient)
 * - 오로라, 홀로그램 느낌의 유동적인 그라디언트
 * - 트렌디하고 감각적인 무드
 * - 앞면: 전체 그라디언트 + 중앙 굵은 화이트 텍스트
 * - 뒷면: 화이트 배경 + 그라디언트 텍스트
 * - 무드: Trendy, Space, Vibrant
 */
export function HoloGradient({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;

    // Mesh Gradient Simulation
    const gradientStyle = {
        background: `
      radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
      radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
      radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%), 
      radial-gradient(at 0% 50%, hsla(339,49%,30%,1) 0, transparent 50%), 
      radial-gradient(at 100% 50%, hsla(339,49%,30%,1) 0, transparent 50%), 
      radial-gradient(at 0% 100%, hsla(225,39%,30%,1) 0, transparent 50%), 
      radial-gradient(at 100% 100%, hsla(253,16%,7%,1) 0, transparent 50%)
    `,
        backgroundColor: data.primaryColor || '#8b5cf6',
    };

    // Improved, brighter holographic gradient
    const holoBg = {
        background: `
        linear-gradient(125deg, #FF9A9E 0%, #FECFEF 20%, #E0C3FC 40%, #8EC5FC 60%, #E0C3FC 80%, #FF9A9E 100%)
     `,
        backgroundSize: '200% 200%',
    }

    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: '#ffffff',
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

    if (side === 'front') {
        return (
            <div style={{ ...containerStyle, ...holoBg }}>
                {bleedIndicator}

                <div
                    style={{
                        position: 'absolute',
                        inset: `${bleedPx}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    {/* Glass Card Name Plate */}
                    <div
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            padding: '24px 40px',
                            borderRadius: '50px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            textAlign: 'center',
                        }}
                    >
                        {data.logo && <img src={data.logo} alt="logo" style={{ height: '24px', marginBottom: '8px', margin: '0 auto' }} />}

                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#333', margin: 0 }}>
                            {data.name}
                        </h1>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#666', margin: '4px 0 0 0', textTransform: 'uppercase' }}>
                            {data.title}
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

            {/* Subtle holo Border */}
            <div style={{ position: 'absolute', inset: 0, ...holoBg, opacity: 0.1 }} />

            <div
                style={{
                    position: 'absolute',
                    inset: `${bleedPx}px`,
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, background: 'linear-gradient(45deg, #FF9A9E, #8EC5FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 16px 0' }}>
                        {data.company}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#555', fontWeight: 500 }}>{data.phone}</div>
                        <div style={{ fontSize: '12px', color: '#555', fontWeight: 500 }}>{data.email}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{data.address}</div>
                    </div>
                </div>

                <div>
                    <div style={{ padding: '8px', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <QRCode
                            value={data.website || `mailto:${data.email}`}
                            size={64}
                            level="L"
                            bgColor="#ffffff"
                            fgColor="#333333"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
