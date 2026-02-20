import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Dynamically calculate the Redirect URI based on the request host (no .env variable needed)
    const clientId = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID;
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/hubspot/callback`;

    // Define required scopes for Health Check (must match HubSpot exactly)
    const scopes = [
        'crm.objects.contacts.read',
        'crm.objects.deals.read',
        'crm.schemas.companies.read',
        'oauth',
        'settings.users.read'
    ].join('%20');

    if (!clientId || !redirectUri) {
        return NextResponse.json({ error: 'HubSpot configuration missing' }, { status: 500 });
    }

    // Construct HubSpot OAuth Authorization URL
    const authorizationUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;

    // Redirect user to HubSpot
    return NextResponse.redirect(authorizationUrl);
}
