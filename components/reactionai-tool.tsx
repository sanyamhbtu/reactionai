'use client'

import { useState } from 'react'
import { AlertTriangle, FlaskConical, Loader2, Sparkles, Zap } from 'lucide-react'

type Prediction = { answer?: string; keyPoint?: string; safetyNote?: string }

export function ReactionTool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'student' | 'research'>('student')
  const [language, setLanguage] = useState('english')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Prediction | null>(null)

  async function predict() {
    const question = input.trim()
    if (!question) { setError('Please enter a chemistry question or SMILES string.'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const response = await fetch('/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: question, mode, language }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'The prediction service is unavailable.')
      if (!data.answer) throw new Error('The model returned an empty answer. Please try again.')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The prediction failed. Please try again.')
    } finally { setLoading(false) }
  }

  return <section id="try-tool" className="mx-auto w-full max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_80px_rgba(30,58,95,0.10)]">
      <div className="flex flex-col gap-4 border-b border-border bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><FlaskConical className="size-4" /> Prediction workspace</div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ask a chemistry question</h2></div>
        <div className="flex rounded-lg border border-border bg-background p-1 text-sm"><button type="button" onClick={() => setMode('student')} className={`rounded-md px-3 py-2 ${mode === 'student' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Student</button><button type="button" onClick={() => setMode('research')} className={`rounded-md px-3 py-2 ${mode === 'research' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Research</button></div>
      </div>
      <div className="p-5 sm:p-8">
        <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); void predict() } }} className="min-h-36 w-full resize-y rounded-xl border border-input bg-background p-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Ask about a reaction, mechanism, molecule, or chemistry concept..." aria-label="Chemistry question" />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="py-1">Try:</span>{['Why does esterification need acid?', 'Predict the product of an SN2 reaction', 'What is the structure of aspirin?'].map((example) => <button key={example} type="button" onClick={() => setInput(example)} className="rounded-full border border-border px-3 py-1 transition hover:border-primary hover:text-primary">{example}</button>)}</div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><label className="text-sm font-medium">Language<select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 block rounded-lg border border-input bg-background px-3 py-2 font-normal"><option value="english">English</option><option value="hindi">Hindi</option><option value="both">Both</option></select></label><button type="button" onClick={() => void predict()} disabled={loading} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-accent-foreground transition hover:brightness-95 disabled:cursor-wait disabled:opacity-70 sm:min-w-52">{loading ? <><Loader2 className="size-4 animate-spin" /> Asking Groq...</> : <><Zap className="size-4" /> Ask ReactionAI</>}</button></div>
        {error && <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><div><p className="font-semibold">Something went wrong</p><p className="mt-1">{error}</p></div></div>}
        {loading && <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite"><Loader2 className="size-4 animate-spin" /> Reading your question and preparing a clear answer...</p>}
        {result && <div className="mt-8 rounded-2xl border border-border bg-background p-5 sm:p-6" aria-live="polite"><div className="flex items-center gap-2 text-sm font-semibold text-accent"><Sparkles className="size-4" /> ReactionAI answer</div><p className="mt-4 whitespace-pre-wrap text-base leading-7 text-foreground">{result.answer}</p>{result.keyPoint && <p className="mt-5 rounded-xl bg-secondary p-4 text-sm font-medium leading-6"><span className="text-primary">Key point: </span>{result.keyPoint}</p>}{result.safetyNote && <p className="mt-4 text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Safety: </span>{result.safetyNote}</p>}</div>}
      </div>
    </div>
  </section>
}

export function CheckIcon() { return null }
export function ArrowIcon() { return null }
