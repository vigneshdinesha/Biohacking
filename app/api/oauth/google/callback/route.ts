import { NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet, SignJWT } from 'jose'

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const cookiesHeader = request.headers.get('cookie') || ''
  const stateCookie = cookiesHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('oauth_state='))
  const stateValue = stateCookie?.split('=')[1]

  if (!code || !state || !stateValue || state !== decodeURIComponent(stateValue)) {
    return new NextResponse('Invalid OAuth state or code', { status: 400 })
  }

  const origin = url.origin
  const redirectUri = `${origin}/api/oauth/google/callback`
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const sessionSecret = process.env.AUTH_SESSION_SECRET

  if (!clientId || !clientSecret || !sessionSecret) {
    return new NextResponse('Missing Google OAuth credentials or AUTH_SESSION_SECRET', { status: 500 })
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    const errText = await tokenRes.text()
    return new NextResponse(`Token exchange failed: ${errText}`, { status: 400 })
  }

  const tokens = await tokenRes.json()
  const idToken = tokens.id_token
  if (!idToken) {
    return new NextResponse('No id_token in response', { status: 400 })
  }

  // Verify id_token
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: clientId,
  })

  const user = {
    id: String(payload.sub || ''),
    email: String(payload.email || ''),
    name: String(payload.name || ''),
    picture: String(payload.picture || ''),
  }

  // Create our session JWT
  const sessionJwt = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(sessionSecret))

  const resp = NextResponse.redirect(`${origin}/`)
  resp.cookies.set('session', sessionJwt, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  // clear state
  resp.cookies.set('oauth_state', '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 })
  return resp
}
