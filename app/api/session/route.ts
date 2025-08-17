import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function GET(request: Request) {
  const sessionSecret = process.env.AUTH_SESSION_SECRET
  if (!sessionSecret) {
    return new NextResponse('Missing AUTH_SESSION_SECRET', { status: 500 })
  }
  const cookiesHeader = request.headers.get('cookie') || ''
  const sessionCookie = cookiesHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('session='))
  const token = sessionCookie?.split('=')[1]
  if (!token) return new NextResponse(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(sessionSecret))
    const user = (payload as any).user || null
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
