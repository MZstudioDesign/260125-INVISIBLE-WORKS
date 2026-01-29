// OAuth2 Initialization Route
// GET /api/oauth2/init
//
// Redirects user to Google OAuth consent screen

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4555/api/oauth2/callback';
    const scope = process.env.GOOGLE_GMAIL_SCOPE || 'https://www.googleapis.com/auth/gmail.send';

    if (!clientId) {
        return NextResponse.json(
            { error: 'GOOGLE_OAUTH_CLIENT_ID is not configured' },
            { status: 500 }
        );
    }

    // Build Google OAuth2 authorization URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('access_type', 'offline'); // Required to get refresh_token
    authUrl.searchParams.set('prompt', 'consent'); // Force consent to always get refresh_token

    return NextResponse.redirect(authUrl.toString());
}
