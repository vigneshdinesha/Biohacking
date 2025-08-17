import { NextResponse } from 'next/server'

function randomString(length = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${origin}/api/oauth/google/callback`

  if (!clientId) {
    return new NextResponse('Missing GOOGLE_CLIENT_ID', { status: 500 })
  }

  const state = randomString(16)
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')

  const resp = NextResponse.redirect(authUrl.toString())
  // CSRF state cookie
  resp.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10 * 60, // 10 minutes
  })
  return resp
}
