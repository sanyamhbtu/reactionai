import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are ReactionAI, a careful chemistry learning assistant. Answer in simple concise English. Always use exactly these headings: Reaction, Mechanism, Precautions, Toxic or harmful chemicals, Lab disposal. For forward prediction, describe the likely product and conditions. For retrosynthesis, give 1-2 routes with numbered steps and feasibility. Never invent certainty: label predictions as likely. Do not provide dangerous operational details, exact quantities, optimization for illicit substances, or instructions that enable harm. Disposal guidance must be high-level and tell the user to follow their institution's SDS and hazardous-waste rules.`

const text = (value: unknown) => typeof value === 'string' ? value.trim() : ''

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as { input?: string; mode?: string; learningMode?: boolean }
    const input = text(body.input)
    if (!input || input.length > 4000) return NextResponse.json({ error: 'Enter a question up to 4,000 characters.' }, { status: 400 })
    const key = (process.env.GROQ_API_KEY || process.env.GROQ || process.env.groq)?.trim()
    if (!key) return NextResponse.json({ error: 'Groq is not configured on this deployment.' }, { status: 503 })
    const prompt = `${SYSTEM_PROMPT}\nMode: ${body.mode === 'retrosynthesis' ? 'Basic retrosynthesis' : 'Forward reaction prediction'}. Learning mode: ${body.learningMode ? 'on, explain the reasoning step by step' : 'off'}.\nUser question: ${input}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'openai/gpt-oss-20b', messages: [{ role: 'user', content: prompt }], temperature: 0.2, max_tokens: 900 }), signal: controller.signal }).finally(() => clearTimeout(timeout))
    const data = await response.json().catch(() => ({})) as { choices?: { message?: { content?: string } }[]; error?: { message?: string } }
    if (!response.ok) return NextResponse.json({ error: data.error?.message || `Groq request failed (${response.status}).` }, { status: response.status === 429 ? 429 : 502 })
    const answer = text(data.choices?.[0]?.message?.content)
    if (!answer) return NextResponse.json({ error: 'Groq returned an empty answer. Try again.' }, { status: 502 })
    return NextResponse.json({ answer })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.name === 'AbortError' ? 'The request took too long. Try a shorter question.' : 'The prediction service is temporarily unavailable.' }, { status: 502 })
  }
}
