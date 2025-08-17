import { NextResponse } from 'next/server'

export async function POST() {
  const resp = new NextResponse(null, { status: 204 })
  resp.cookies.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return resp
}

export async function GET() {
  return POST()
}
