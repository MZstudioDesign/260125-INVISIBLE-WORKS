// OAuth2 Callback Route
// GET /api/oauth2/callback
//
// Handles Google OAuth callback and displays tokens

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return new NextResponse(
            `<html>
        <head><title>OAuth Error</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">❌ OAuth Error</h1>
          <p>Error: ${error}</p>
          <p>Description: ${searchParams.get('error_description') || 'Unknown error'}</p>
        </body>
      </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    }

    if (!code) {
        return new NextResponse(
            `<html>
        <head><title>Missing Code</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">❌ Missing Authorization Code</h1>
          <p>No authorization code received from Google.</p>
          <a href="/api/oauth2/init">Try Again</a>
        </body>
      </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    }

    // Exchange authorization code for tokens
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4555/api/oauth2/callback';

    if (!clientId || !clientSecret) {
        return new NextResponse(
            `<html>
        <head><title>Configuration Error</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">❌ Configuration Error</h1>
          <p>OAuth credentials not configured in environment.</p>
        </body>
      </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    }

    try {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenResponse.json();

        if (tokens.error) {
            return new NextResponse(
                `<html>
          <head><title>Token Exchange Error</title></head>
          <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">❌ Token Exchange Failed</h1>
            <p>Error: ${tokens.error}</p>
            <p>Description: ${tokens.error_description || 'Unknown error'}</p>
          </body>
        </html>`,
                { headers: { 'Content-Type': 'text/html' } }
            );
        }

        // Success! Display the tokens
        return new NextResponse(
            `<html>
        <head>
          <title>OAuth Success</title>
          <style>
            body { font-family: system-ui; padding: 40px; max-width: 800px; margin: 0 auto; background: #f9fafb; }
            h1 { color: #059669; }
            .token-box { background: #1f2937; color: #10b981; padding: 16px; border-radius: 8px; word-break: break-all; font-family: monospace; margin: 16px 0; }
            .label { font-weight: 600; color: #374151; margin-top: 24px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px; }
            .env-template { background: #ecfdf5; border: 1px solid #10b981; padding: 16px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; }
            button { background: #1e3a8a; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 8px; }
            button:hover { background: #1e40af; }
          </style>
        </head>
        <body>
          <h1>✅ OAuth2 인증 성공!</h1>
          
          <div class="warning">
            <strong>⚠️ 중요:</strong> 아래 토큰을 <code>.env</code> 파일에 복사한 후, 이 페이지를 닫으세요. 
            토큰은 민감한 정보이므로 공유하지 마세요.
          </div>
          
          <p class="label">📋 .env 파일에 추가할 내용:</p>
          <div class="env-template">
GOOGLE_OAUTH_REFRESH_TOKEN="${tokens.refresh_token || '(없음 - 다시 인증 필요)'}"
GOOGLE_OAUTH_ACCESS_TOKEN="${tokens.access_token}"
          </div>
          <button onclick="navigator.clipboard.writeText(\`GOOGLE_OAUTH_REFRESH_TOKEN="${tokens.refresh_token || ''}"\nGOOGLE_OAUTH_ACCESS_TOKEN="${tokens.access_token}"\`)">📋 복사하기</button>
          
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p class="label">Refresh Token (영구적, 한 번만 저장하면 됨):</p>
          <div class="token-box">${tokens.refresh_token || '⚠️ Refresh token이 없습니다. prompt=consent 설정 확인 필요'}</div>
          
          <p class="label">Access Token (1시간 후 만료, 자동 갱신됨):</p>
          <div class="token-box">${tokens.access_token}</div>
          
          <p class="label">만료 시간:</p>
          <p>${tokens.expires_in}초 (약 ${Math.round(tokens.expires_in / 60)}분)</p>
          
          ${tokens.scope ? `<p class="label">승인된 범위:</p><p>${tokens.scope}</p>` : ''}
        </body>
      </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return new NextResponse(
            `<html>
        <head><title>Error</title></head>
        <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">❌ Error</h1>
          <p>${message}</p>
        </body>
      </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    }
}
