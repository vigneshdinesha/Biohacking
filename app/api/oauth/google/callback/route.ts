import { NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet, SignJWT } from 'jose'
import { createUser, findUserByEmail } from '@/lib/admin'

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

  // Check if user already exists in database
  let dbUser: any = null
  let dbUserId: number | null = null
  let userMotivationId: number | null = null
  
  try {
    // First, check if user already exists
    dbUser = await findUserByEmail(user.email)
    
    if (dbUser) {
      // User exists, use their data
      dbUserId = dbUser.id
      userMotivationId = dbUser.motivationId
      console.log('Existing user found:', { id: dbUserId, email: user.email, motivationId: userMotivationId })
    } else {
      // User doesn't exist, create new user
      const nameParts = user.name.split(' ')
      const firstname = nameParts[0] || ''
      const lastname = nameParts.slice(1).join(' ') || ''
      
      const userPayload = {
        firstName: firstname,
        lastName: lastname,
        email: user.email,
        provider: 'google',
        externalId: user.id,
        subId: user.id,
        motivationId: null
      }

      // Use your actual API via the admin function
      const createdUser = await createUser(userPayload)
      dbUserId = createdUser.id
      userMotivationId = createdUser.motivationId
      console.log('New user created in database:', { id: dbUserId, email: user.email })
    }
  } catch (error) {
    console.error('Error handling user record:', error)
    // Continue with authentication even if user handling fails
  }

  // Create our session JWT with database user ID and motivation ID
  const sessionJwt = await new SignJWT({ 
    user: { ...user, dbId: dbUserId, motivationId: userMotivationId }
  })
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
