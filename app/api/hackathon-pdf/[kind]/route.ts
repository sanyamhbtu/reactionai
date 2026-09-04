import { auth } from '@/lib/auth'
import { createHackathonPdf, type HackathonDocument } from '@/lib/hackathon-pdf'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

const allowed = new Set<HackathonDocument>(['pitch', 'technical', 'workflow', 'impact', 'future'])

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { kind } = await params
  if (!allowed.has(kind as HackathonDocument)) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  const pdf = await createHackathonPdf(kind as HackathonDocument)
  return new NextResponse(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="reactionai-${kind}.pdf"`, 'Cache-Control': 'private, no-store' } })
}
