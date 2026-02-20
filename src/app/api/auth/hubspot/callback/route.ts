import { NextResponse } from 'next/server';
import { runAuditEngine } from '@/app/utils/audit-engine';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID;
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        return NextResponse.json({ error: 'HubSpot configuration missing on the server' }, { status: 500 });
    }

    try {
        // Exchange the authorization code for an access token
        const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code: code,
            }).toString(),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('HubSpot Token Error:', errorData);
            return NextResponse.json({ error: 'Failed to retrieve access token from HubSpot', details: errorData }, { status: tokenResponse.status });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        console.log('Successfully retrieved Access Token! Valid for:', tokenData.expires_in, 'seconds');

        // Run Health Check Engine logic with the retrieved token
        const scores = await runAuditEngine(accessToken);

        // Redirect back to successful report page, passing the audit results safely via URL params
        // Note: For a production app, we would save this to a DB and pass an ID instead to prevent URL limits.
        const encodedScores = encodeURIComponent(JSON.stringify(scores));
        return NextResponse.redirect(new URL(`/report?status=success&data=${encodedScores}`, request.url));
    } catch (error) {
        console.error('OAuth Exchange Exception:', error);
        return NextResponse.json({ error: 'Internal Server Error during OAuth exchange' }, { status: 500 });
    }
}
