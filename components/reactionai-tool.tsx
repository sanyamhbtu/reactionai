'use client'

import { useState } from 'react'
import { saveReaction } from '@/app/actions/history'

type Result = { answer: string }

export function ReactionTool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'forward' | 'retrosynthesis'>('forward')
  const [learningMode, setLearningMode] = useState(true)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function predict() {
    if (!input.trim()) return setError('Enter a reaction question, reactants, or a target molecule.')
    setLoading(true); setError(''); setResult(null)
    try {
      const response = await fetch('/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, mode, learningMode }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Prediction failed.')
      setResult({ answer: data.answer })
      try { await saveReaction({ title: input.slice(0, 80), mode, query: input, result: data }) } catch { /* history is available after sign-in */ }
    } catch (err) { setError(err instanceof Error ? err.message : 'The prediction service is unavailable.') } finally { setLoading(false) }
  }

  function download() {
    if (!result) return
    const blob = new Blob([`ReactionAI\n\nQuestion: ${input}\nMode: ${mode}\n\n${result.answer}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'reactionai-result.txt'; link.click(); URL.revokeObjectURL(url)
  }

  return <section id="workspace" className="border-y border-border bg-card/70 py-16"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Prediction workspace</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Ask the reaction desk.</h2><p className="mt-2 max-w-xl text-muted-foreground">Use a reaction question, reactant names, or SMILES. ReactionAI returns a likely answer with the chemistry and safety context around it.</p></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 rounded-full bg-primary" /> Groq powered</div></div><div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"><div className="rounded-xl border bg-background p-5"><div className="flex flex-wrap gap-2"><button onClick={() => setMode('forward')} className={`rounded-full border px-3 py-1.5 text-sm ${mode === 'forward' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Forward reaction</button><button onClick={() => setMode('retrosynthesis')} className={`rounded-full border px-3 py-1.5 text-sm ${mode === 'retrosynthesis' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Retrosynthesis</button></div><label className="mt-6 block text-sm font-semibold" htmlFor="chemistry-question">{mode === 'forward' ? 'Reactants or question' : 'Target molecule or question'}</label><textarea id="chemistry-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'forward' ? 'Example: What happens when ethanol reacts with ethanoic acid?' : 'Example: Suggest simple starting materials for aspirin.'} className="mt-2 min-h-40 w-full resize-y rounded-lg border bg-card p-3 text-sm outline-none ring-primary focus:ring-2" /><div className="mt-4 flex items-center justify-between gap-4"><label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={learningMode} onChange={(event) => setLearningMode(event.target.checked)} /> Student learning mode</label><button onClick={predict} disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{loading ? 'Thinking…' : 'Predict reaction'}</button></div>{error && <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}</div><div className="min-h-72 rounded-xl border bg-background p-5"><div className="flex items-center justify-between border-b pb-4"><div><p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Analysis output</p><p className="mt-1 text-sm font-semibold">{result ? 'A considered chemistry answer' : 'Your result will appear here'}</p></div>{result && <button onClick={download} className="text-sm font-semibold text-primary underline underline-offset-4">Download text</button>}</div>{result ? <article className="mt-5 whitespace-pre-wrap text-sm leading-7 text-foreground">{result.answer}</article> : <div className="flex h-56 items-center justify-center text-center text-sm text-muted-foreground"><p>Start with a reaction question.<br />You will see the reaction, mechanism, precautions, hazards, and disposal guidance here.</p></div>}</div></div></div></section>
}

export function CheckIcon() { return null }
export function ArrowIcon() { return null }
