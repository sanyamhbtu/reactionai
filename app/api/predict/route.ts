import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are ReactionAI, a chemistry learning assistant. Answer the user's question accurately, safely, and briefly in easy English. Explain the key idea first. If the user asks about a reaction, mention the likely product and why. If the user provides SMILES, interpret it only when confident. Do not claim predictions are experimentally verified. Avoid dangerous operational synthesis instructions; keep safety notes high-level.

Return only a short, direct answer in plain text. Use simple English, with at most three short paragraphs. Do not return JSON, markdown code fences, internal reasoning, or long lists. Keep the answer under 120 words.`

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  try {
    const key = (process.env.GROQ_API_KEY || process.env.GROQ || process.env.groq)?.trim()
    if (!key) return NextResponse.json({ error: 'ReactionAI is not configured. Add GROQ_API_KEY to the project environment.' }, { status: 503 })

    const body = await request.json().catch(() => ({}))
    const input = text(body.input)
    if (!input) return NextResponse.json({ error: 'Please enter a chemistry question or SMILES string.' }, { status: 400 })
    if (input.length > 4000) return NextResponse.json({ error: 'Please keep your question under 4,000 characters.' }, { status: 400 })

    const mode = body.mode === 'research' ? 'research' : 'student'
    const language = ['english', 'hindi', 'both'].includes(body.language) ? body.language : 'english'
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Answer in ${language}. Use ${mode} level. User question: ${input}` },
        ],
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const raw = await response.text().catch(() => '')
      let providerMessage = ''
      try { providerMessage = text(JSON.parse(raw)?.error?.message) } catch {}
      if (response.status === 401) return NextResponse.json({ error: 'Groq rejected the API key. Check that GROQ_API_KEY is active.' }, { status: 401 })
      if (response.status === 429) return NextResponse.json({ error: 'The Groq free-tier limit was reached. Please wait and try again.' }, { status: 429 })
      return NextResponse.json({ error: providerMessage || `Groq returned an error (${response.status}).` }, { status: 502 })
    }

    const payload = await response.json()
    const content = text(payload?.choices?.[0]?.message?.content)
    if (!content) throw new Error('The model returned an empty answer.')
    const answer = content.replace(/^```(?:text|markdown)?\s*/i, '').replace(/\s*```$/i, '').trim()
    return NextResponse.json({ answer, keyPoint: '', safetyNote: '' })
  } catch (error) {
    const message = error instanceof DOMException && error.name === 'TimeoutError' ? 'Groq took too long to respond. Please try again.' : 'The prediction service could not complete the request. Please try again.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
