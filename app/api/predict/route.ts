import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are ReactionAI, a careful chemistry teaching and research assistant. Handle broad natural-language chemistry questions, not only retrosynthesis: reaction prediction, synthesis planning, reaction mechanisms, functional-group transformations, product naming, SMILES interpretation, stoichiometry, spectroscopy basics, and green chemistry. Never claim a prediction is experimentally verified. For safety, give educational high-level guidance, flag hazardous materials and conditions, and avoid operational detail that would enable dangerous synthesis.

For every query, first infer the user's intent and answer it. If the query describes reactants, catalysts, or an expected product, reconcile them and explain whether the transformation is chemically plausible. If a target or product is inferable, provide its name and SMILES when confident. Propose 1-3 ranked routes only when synthesis planning is relevant; otherwise provide one route-like explanation with the relevant reaction steps. Use realistic yield ranges only when appropriate, mark confidence low when uncertain, and never invent a citation or structure. Student mode uses clear undergraduate language; research mode uses precise technical language. Hindi or both adds Devanagari explanations.

Return ONLY valid JSON with this exact shape: {"targetMolecule":{"name":"string","smiles":"string"},"routes":[{"rank":1,"recommended":true,"estimatedYield":"string","confidence":"high|medium|low","steps":[{"stepNumber":1,"reagents":"string","conditions":"string","explanation":"string","explanationHindi":"string","hazardLevel":"low|medium|high","hazardNote":"string"}],"greenerAlternative":"string"}]}. Always include arrays and strings, using an empty string when a field is not applicable.`

type Step = Record<string, unknown>
type Route = Record<string, unknown>

function extractJson(content: string) {
  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  try { return JSON.parse(cleaned) }
  catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start < 0 || end <= start) throw new Error('The model returned invalid JSON.')
    return JSON.parse(cleaned.slice(start, end + 1))
  }
}

function asString(value: unknown, fallback = '') { return typeof value === 'string' ? value : value == null ? fallback : String(value) }

function normalize(value: unknown) {
  const data = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const target = data.targetMolecule && typeof data.targetMolecule === 'object' ? data.targetMolecule as Record<string, unknown> : {}
  const rawRoutes = Array.isArray(data.routes) ? data.routes : []
  const routes = rawRoutes.slice(0, 3).map((raw, routeIndex) => {
    const route = raw && typeof raw === 'object' ? raw as Route : {}
    const rawSteps = Array.isArray(route.steps) ? route.steps : []
    const steps: Step[] = rawSteps.map((rawStep, stepIndex) => {
      const step = rawStep && typeof rawStep === 'object' ? rawStep as Step : {}
      return { stepNumber: Number(step.stepNumber) || stepIndex + 1, reagents: asString(step.reagents), conditions: asString(step.conditions), explanation: asString(step.explanation), explanationHindi: asString(step.explanationHindi), hazardLevel: ['low', 'medium', 'high'].includes(asString(step.hazardLevel).toLowerCase()) ? asString(step.hazardLevel).toLowerCase() : 'medium', hazardNote: asString(step.hazardNote) }
    })
    return { rank: Number(route.rank) || routeIndex + 1, recommended: Boolean(route.recommended) || routeIndex === 0, estimatedYield: asString(route.estimatedYield, 'Not specified'), confidence: ['high', 'medium', 'low'].includes(asString(route.confidence).toLowerCase()) ? asString(route.confidence).toLowerCase() : 'low', steps, greenerAlternative: asString(route.greenerAlternative) }
  })
  return { targetMolecule: { name: asString(target.name, 'Target or concept'), smiles: asString(target.smiles) }, routes }
}

export async function POST(request: Request) {
  try {
    const key = process.env.GROQ_API_KEY?.trim()
    if (!key) return NextResponse.json({ error: 'ReactionAI is not configured yet. Add GROQ_API_KEY to the project environment and redeploy.' }, { status: 503 })
    const body = await request.json().catch(() => ({}))
    const input = typeof body.input === 'string' ? body.input.trim() : ''
    const mode = body.mode === 'research' ? 'research' : 'student'
    const language = ['english', 'hindi', 'both'].includes(body.language) ? body.language : 'english'
    if (!input) return NextResponse.json({ error: 'Please describe a chemistry question or enter a SMILES string.' }, { status: 400 })
    if (input.length > 4000) return NextResponse.json({ error: 'Please keep your query under 4,000 characters.' }, { status: 400 })
    const model = process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile'
    const userPrompt = `Mode: ${mode}. Language: ${language}. Chemistry question: ${input}`
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ model, temperature: 0.2, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: userPrompt }] }), signal: AbortSignal.timeout(30000) })
    if (!response.ok) {
      const providerBody = await response.text().catch(() => '')
      let providerMessage = ''
      try {
        const parsed = JSON.parse(providerBody)
        providerMessage = parsed?.error?.message || parsed?.error || parsed?.message || ''
      } catch {}
      if (response.status === 400 || response.status === 401) return NextResponse.json({ error: providerMessage || 'Groq rejected the API key or request. Confirm GROQ_API_KEY is the complete active key saved for Production.' }, { status: response.status === 400 ? 400 : 401 })
      if (response.status === 403) return NextResponse.json({ error: providerMessage || 'Groq rejected this key or model. Confirm the key is active and has access to the selected model.' }, { status: 403 })
      if (response.status === 429) return NextResponse.json({ error: 'Groq free-tier rate limit reached. Please wait and try again.' }, { status: 429 })
      throw new Error(providerMessage || `Groq returned an error (${response.status}).`)
    }
    const payload = await response.json()
    const content = payload.choices?.[0]?.message?.content
    if (!content) throw new Error('The model returned an empty response.')
    return NextResponse.json(normalize(extractJson(content)))
  } catch (error) {
    const message = error instanceof DOMException && error.name === 'TimeoutError' ? 'Groq took too long to respond. Please try the question again.' : 'The prediction service could not complete the request. Please try again.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
      
