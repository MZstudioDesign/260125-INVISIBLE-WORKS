'use client';

import { BusinessCardData } from '@/lib/businessCard/types';
import QRCode from 'react-qr-code';

interface TemplateProps {
    data: BusinessCardData;
    side: 'front' | 'back';
    showBleed?: boolean;
}

/**
 * 데브 터미널 (Dev Terminal)
 * - 개발자, 엔지니어를 위한 IDE/Terminal 컨셉
 * - 앞면: VS Code 스타일의 클래스 정의 코드 (Syntax Highlighting)
 * - 뒷면: 터미널 스타일의 JSON/Output Log + QR 코드
 * - 무드: Tech, Geek, Dark, Monospace
 */
export function DevTerminal({ data, side, showBleed = true }: TemplateProps) {
    const bleedPx = showBleed ? 12 : 0;

    // VS Code Dark Theme Colors
    const colors = {
        bg: '#1e1e1e',
        fg: '#d4d4d4',
        keyword: '#569cd6', // blue
        string: '#ce9178', // orange
        class: '#4ec9b0', // teal
        comment: '#6a9955', // green
        number: '#b5cea8', // light green
        lineNum: '#858585',
    };

    const containerStyle: React.CSSProperties = {
        width: `${360 + bleedPx * 2}px`,
        height: `${200 + bleedPx * 2}px`,
        padding: `${bleedPx}px`,
        backgroundColor: colors.bg,
        fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
        position: 'relative',
        overflow: 'hidden',
    };

    const bleedIndicator = showBleed && (
        <div
            style={{
                position: 'absolute',
                inset: `${bleedPx}px`,
                border: '1px dashed rgba(255,255,255,0.1)',
                pointerEvents: 'none',
                zIndex: 10,
            }}
        />
    );

    const WindowControls = () => (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
        </div>
    );

    if (side === 'front') {
        return (
            <div style={containerStyle}>
                {bleedIndicator}

                <div
                    style={{
                        position: 'absolute',
                        inset: `${bleedPx}px`,
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <WindowControls />

                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        {/* Line 1 */}
                        <div style={{ display: 'flex' }}>
                            <span style={{ color: colors.lineNum, width: '24px', userSelect: 'none' }}>1</span>
                            <span>
                                <span style={{ color: colors.keyword }}>class</span>{' '}
                                <span style={{ color: colors.class }}>{data.company.replace(/\s+/g, '') || 'Developer'}</span>{' '}
                                <span style={{ color: colors.fg }}>{'{'}</span>
                            </span>
                        </div>

                        {/* Line 2 */}
                        <div style={{ display: 'flex' }}>
                            <span style={{ color: colors.lineNum, width: '24px', userSelect: 'none' }}>2</span>
                            <span style={{ paddingLeft: '16px' }}>
                                <span style={{ color: colors.keyword }}>constructor</span>
                                <span style={{ color: colors.fg }}>() {'{'}</span>
                            </span>
                        </div>

                        {/* Line 3 */}
                        <div style={{ display: 'flex' }}>
                            <span style={{ color: colors.lineNum, width: '24px', userSelect: 'none' }}>3</span>
                            <span style={{ paddingLeft: '32px' }}>
                                <span style={{ color: colors.keyword }}>this</span>
                                <span style={{ color: colors.fg }}>.name = </span>
                                <span style={{ color: colors.string }}>'{data.name}'</span>
                                <span style={{ color: colors.fg }}>;</span>
                            </span>
                        </div>

                        {/* Line 4 */}
                        <div style={{ display: 'flex' }}>
                            <span style={{ color: colors.lineNum, width: '24px', userSelect: 'none' }}>4</span>
                            <span style={{ paddingLeft: '32px' }}>
                                <span style={{ color: colors.keyword }}>this</span>
                                <span style={{ color: colors.fg }}>.role = </span>
                                <span style={{ color: colors.string }}>'{data.title}'</span>
                                <span style={{ color: colors.fg }}>;</span>
                            </span>
                        </div>

                        {/* Line 5 */}
                        <div style={{ display: 'flex' }}>
                            <span style={{ color: colors.lineNum, width: '24px', userSelect: 'none' }}>5</span>
                            <span style={{ paddingLeft: '16px' }}>
                                <span style={{ color: colors.fg }}>{'}'}</span>
                            </span>
                        </div>

                        {/* Line 6 */}
                        <div style={{ display: 'flex' }}>
                            <span style={{ color: colors.lineNum, width: '24px', userSelect: 'none' }}>6</span>
                            <span style={{ color: colors.fg }}>{'}'}</span>
                        </div>

                        {/* Cursor */}
                        <div style={{ display: 'flex', marginTop: '4px' }}>
                            <span style={{ color: colors.lineNum, width: '24px' }}>7</span>
                            <div style={{ width: '8px', height: '16px', background: data.primaryColor, opacity: 0.8 }} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // Back Side
    return (
        <div style={containerStyle}>
            {bleedIndicator}

            <div
                style={{
                    position: 'absolute',
                    inset: `${bleedPx}px`,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ flex: 1 }}>
                    <div style={{
                        borderBottom: `1px solid ${colors.lineNum}`,
                        paddingBottom: '8px',
                        marginBottom: '12px',
                        color: colors.fg,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ color: colors.keyword }}>➜</span>
                        <span>~/contact-info</span>
                    </div>

                    <div style={{ fontSize: '11px', lineHeight: '1.8', color: '#a0a0a0' }}>
                        <div>
                            <span style={{ color: colors.class }}>Email:</span>{' '}
                            <span style={{ color: colors.string }}>"{data.email}"</span>
                        </div>
                        <div>
                            <span style={{ color: colors.class }}>Phone:</span>{' '}
                            <span style={{ color: colors.number }}>{data.phone}</span>
                        </div>
                        {data.website && (
                            <div>
                                <span style={{ color: colors.class }}>Web:</span>{' '}
                                <span style={{ color: colors.keyword }}>
                                    <span style={{ textDecoration: 'underline' }}>{data.website}</span>
                                </span>
                            </div>
                        )}
                        {data.address && (
                            <div style={{ marginTop: '8px', color: colors.comment }}>
                // {data.address}
                            </div>
                        )}
                    </div>
                </div>

                {/* QR Code */}
                {(data.website || data.email) && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '16px'
                    }}>
                        <div style={{ padding: '8px', background: 'white', borderRadius: '4px' }}>
                            <QRCode
                                value={data.website || `mailto:${data.email}`}
                                size={60}
                                level="M"
                                bgColor="#ffffff"
                                fgColor="#000000"
                            />
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '9px', color: colors.comment, textAlign: 'center' }}>
                            SCAN_ME.png
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
