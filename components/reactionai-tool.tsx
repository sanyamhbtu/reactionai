'use client'

import { useState } from 'react'
import { saveReaction } from '@/app/actions/history'

type Result = { answer: string }

const examples = ['CCO.CC(=O)O', 'What happens when ethanol reacts with ethanoic acid?', 'Suggest starting materials for aspirin.']

export function ReactionTool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'forward' | 'retrosynthesis'>('forward')
  const [learningMode, setLearningMode] = useState(true)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  async function predict() {
    if (!input.trim()) return setError('Enter a reaction question, reactants, or target molecule.')
    setLoading(true); setError(''); setResult(null); setFeedback('')
    try {
      const response = await fetch('/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, mode, learningMode }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Prediction failed.')
      setResult({ answer: data.answer })
      try { await saveReaction({ title: input.slice(0, 80), mode, query: input, result: data }) } catch { /* sign-in is optional */ }
    } catch (err) { setError(err instanceof Error ? err.message : 'The prediction service is unavailable.') } finally { setLoading(false) }
  }

  async function sendFeedback(rating: 'up' | 'down') {
    setFeedback(rating)
    await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ route: '/api/predict', rating, correction: input }) }).catch(() => undefined)
  }

  function download() {
    if (!result) return
    const blob = new Blob([`ReactionAI\n\nInput: ${input}\nMode: ${mode}\n\n${result.answer}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'reactionai-result.txt'; link.click(); URL.revokeObjectURL(url)
  }

  return <section id="workspace" className="border-y border-border bg-card/70 py-16"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mb-8"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Prediction workspace</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Ask the reaction desk.</h2><p className="mt-2 max-w-2xl text-muted-foreground">Enter a natural-language question, reactants, or SMILES. You will receive a likely reaction, mechanism, precautions, hazards, and disposal guidance.</p></div><div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"><div className="rounded-xl border bg-background p-5"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setMode('forward')} className={`rounded-full border px-3 py-1.5 text-sm ${mode === 'forward' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Forward reaction</button><button type="button" onClick={() => setMode('retrosynthesis')} className={`rounded-full border px-3 py-1.5 text-sm ${mode === 'retrosynthesis' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Retrosynthesis</button></div><label className="mt-6 block text-sm font-semibold" htmlFor="chemistry-question">{mode === 'forward' ? 'Reactants or question' : 'Target molecule or question'}</label><textarea id="chemistry-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'forward' ? 'Example: What happens when ethanol reacts with ethanoic acid?' : 'Example: Suggest simple starting materials for aspirin.'} className="mt-2 min-h-40 w-full resize-y rounded-lg border bg-card p-3 text-sm outline-none ring-primary focus:ring-2" /><p className="mt-3 text-xs leading-5 text-muted-foreground">SMILES tip: separate multiple reactants with a period, for example <code className="rounded bg-secondary px-1 py-0.5 font-mono">CCO.CC(=O)O</code>.</p><div className="mt-3 flex flex-wrap gap-2">{examples.map((example) => <button type="button" key={example} onClick={() => setInput(example)} className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary">{example}</button>)}</div><label className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={learningMode} onChange={(event) => setLearningMode(event.target.checked)} /> Student Learning Mode</label><button type="button" onClick={() => void predict()} disabled={loading} className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">{loading ? 'Reading the reaction…' : 'Ask ReactionAI'}</button>{error && <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}</div><div className="min-h-80 rounded-xl border bg-background p-5"><div className="flex items-center justify-between gap-4"><h3 className="font-semibold">Result</h3>{result && <button type="button" onClick={download} className="text-sm font-semibold text-primary underline">Download text</button>}</div>{result ? <><div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-foreground">{result.answer}</div><div className="mt-6 flex items-center gap-3 border-t pt-4 text-sm text-muted-foreground"><span>Was this useful?</span><button type="button" onClick={() => void sendFeedback('up')} className="rounded border px-3 py-1 hover:bg-secondary">Yes</button><button type="button" onClick={() => void sendFeedback('down')} className="rounded border px-3 py-1 hover:bg-secondary">Needs correction</button>{feedback && <span className="text-primary">Thanks</span>}</div></> : <div className="flex min-h-64 items-center justify-center text-center text-sm leading-6 text-muted-foreground">Your concise chemistry explanation will appear here.<br />Start with a question or a SMILES string.</div>}</div></div></div></section>
}

export function CheckIcon() { return null }
export function ArrowIcon() { return null }
