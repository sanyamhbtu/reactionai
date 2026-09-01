import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!['up', 'down'].includes(body.rating)) return NextResponse.json({ error: 'Invalid feedback rating.' }, { status: 400 })
    console.info('[ReactionAI] route feedback', { route: body.route, rating: body.rating, correction: typeof body.correction === 'string' ? body.correction.slice(0, 1000) : undefined })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Invalid feedback.' }, { status: 400 }) }
}
