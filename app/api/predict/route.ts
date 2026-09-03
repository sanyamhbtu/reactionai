import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are ReactionAI, a careful chemistry learning assistant. Answer in simple concise English. Always use exactly these headings: Reaction, Mechanism, Precautions, Toxic or harmful chemicals, Lab disposal. For forward prediction, describe the likely product and conditions. For retrosynthesis, give 2-3 alternative routes when chemically reasonable. Rank them from most to least feasible, and for each route include a short title, numbered high-level steps, likely starting materials, estimated step count, and a plain-language feasibility note. For forward reactions, clearly identify reactants, likely product(s), reagents/conditions, and uncertainty. Never invent certainty: label predictions as likely. Do not provide dangerous operational details, exact quantities, optimization for illicit substances, or instructions that enable harm. Disposal guidance must be high-level and tell the user to follow their institution's SDS and hazardous-waste rules.`

const text = (value: unknown) => typeof value === 'string' ? value.trim() : ''

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as { input?: string; mode?: string; learningMode?: boolean }
    const input = text(body.input)
    if (!input || input.length > 4000) return NextResponse.json({ error: 'Enter a question up to 4,000 characters.' }, { status: 400 })
    const key = (process.env.GROQ_API_KEY || process.env.GROQ || process.env.groq)?.trim()
    if (!key) return NextResponse.json({ error: 'Groq is not configured on this deployment.' }, { status: 503 })
    const isSmiles = /^(?:[A-Za-z0-9@+\-\[\]().=#$\\/\\\\]+(?:\.[A-Za-z0-9@+\-\[\]().=#$\\/\\\\]+)*)$/.test(input)
    const prompt = `${SYSTEM_PROMPT}\nMode: ${body.mode === 'retrosynthesis' ? 'Basic retrosynthesis' : 'Forward reaction prediction'}. Learning mode: ${body.learningMode ? 'on, explain the reasoning step by step' : 'off'}.\n${isSmiles ? 'The input is a SMILES structure. Interpret it carefully and still return a complete educational answer using every required heading.' : ''}\nUser question: ${input}`
    const requestModel = async (model: string) => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.2, max_tokens: 1100 }), signal: controller.signal })
        const data = await response.json().catch(() => ({})) as { choices?: { message?: { content?: string } }[]; error?: { message?: string } }
        return { response, data, answer: text(data.choices?.[0]?.message?.content) }
      } finally { clearTimeout(timeout) }
    }
    let result = await requestModel('openai/gpt-oss-20b')
    if (!result.answer && result.response.ok) result = await requestModel('llama-3.3-70b-versatile')
    if (!result.response.ok) return NextResponse.json({ error: result.data.error?.message || `Groq request failed (${result.response.status}).` }, { status: result.response.status === 429 ? 429 : 502 })
    if (!result.answer) return NextResponse.json({ error: 'The model returned no usable explanation. Please try the same structure again or add a short reaction question.' }, { status: 502 })
    return NextResponse.json({ answer: result.answer })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.name === 'AbortError' ? 'The request took too long. Try a shorter question.' : 'The prediction service is temporarily unavailable.' }, { status: 502 })
  }
}
