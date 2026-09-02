'use client'

import { useState } from 'react'
import type React from 'react'
import { saveReaction } from '@/app/actions/history'

type Result = { answer: string }

const examples = ['CCO.CC(=O)O', 'What happens when ethanol reacts with ethanoic acid?', 'Suggest starting materials for aspirin.']

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g).filter(Boolean)
  return parts.map((part, index) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) return <strong key={index}>{part.slice(2, -2)}</strong>
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) return <em key={index}>{part.slice(1, -1)}</em>
    return <span key={index}>{part}</span>
  })
}

function ChemistryAnswer({ content }: { content: string }) {
  const lines = content.replace(/\r/g, '').split('\n')
  const elements: React.ReactNode[] = []
  let list: React.ReactNode[] = []
  let listType: 'ul' | 'ol' | null = null

  function flushList() {
    if (!list.length || !listType) return
    const Tag = listType
    elements.push(<Tag key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-5 marker:text-accent">{list}</Tag>)
    list = []; listType = null
  }

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()
    if (!line) { flushList(); return }
    const heading = line.match(/^\*{0,2}(Reaction|Mechanism|Precautions|Toxic or harmful chemicals|Lab disposal|Safety flags|Alternative routes|Feasibility|Reagents and conditions)\*{0,2}:?$/i)
    if (heading) { flushList(); elements.push(<h3 key={index} className="mt-5 border-b border-border/70 pb-1.5 text-sm font-bold tracking-wide text-primary first:mt-0">{heading[1]}</h3>); return }
    const ordered = line.match(/^\d+[.)]\s+(.*)$/)
    const unordered = line.match(/^[-•]\s+(.*)$/)
    if (ordered || unordered) {
      const nextType = ordered ? 'ol' : 'ul'
      if (listType && listType !== nextType) flushList()
      listType = nextType
      list.push(<li key={index} className="leading-6">{formatInline((ordered || unordered)![1])}</li>)
      return
    }
    flushList()
    const isEquation = /(?:→|->|⇌|\+).*(?:→|->|⇌)/.test(line) || (line.includes('→') && !line.includes('**'))
    elements.push(isEquation
      ? <div key={index} className="my-3 overflow-x-auto rounded-md border border-accent/30 bg-accent/5 px-3 py-2 font-mono text-sm text-primary">{formatInline(line)}</div>
      : <p key={index} className="leading-6">{formatInline(line)}</p>)
  })
  flushList()
  return <div className="text-sm text-foreground">{elements}</div>
}

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
      try { await saveReaction({ title: input.slice(0, 80), mode, query: input, result: data }) } catch { /* saving requires sign-in */ }
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

  return <section id="workspace" className="border-y border-border bg-card/70 py-16"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mb-8"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Prediction workspace</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Ask the reaction desk.</h2><p className="mt-2 max-w-2xl text-muted-foreground">Enter a natural-language question, reactants, or SMILES. You will receive a likely reaction, mechanism, precautions, hazards, and disposal guidance.</p></div><div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"><div className="rounded-xl border bg-background p-5"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setMode('forward')} className={`rounded-full border px-3 py-1.5 text-sm ${mode === 'forward' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Forward reaction</button><button type="button" onClick={() => setMode('retrosynthesis')} className={`rounded-full border px-3 py-1.5 text-sm ${mode === 'retrosynthesis' ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Retrosynthesis</button></div><label className="mt-6 block text-sm font-semibold" htmlFor="chemistry-question">{mode === 'forward' ? 'Reactants or question' : 'Target molecule or question'}</label><textarea id="chemistry-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'forward' ? 'Example: What happens when ethanol reacts with ethanoic acid?' : 'Example: Suggest simple starting materials for aspirin.'} className="mt-2 min-h-40 w-full resize-y rounded-lg border bg-card p-3 text-sm outline-none ring-primary focus:ring-2" /><p className="mt-3 text-xs leading-5 text-muted-foreground">SMILES tip: separate multiple reactants with a period, for example <code className="rounded bg-secondary px-1 py-0.5 font-mono">CCO.CC(=O)O</code>.</p><div className="mt-3 flex flex-wrap gap-2">{examples.map((example) => <button key={example} type="button" onClick={() => setInput(example)} className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">{example}</button>)}</div><label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={learningMode} onChange={(event) => setLearningMode(event.target.checked)} /> Student learning mode</label><button type="button" onClick={predict} disabled={loading} className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{loading ? 'Working…' : 'Ask ReactionAI'}</button></div><div className="min-h-80 rounded-xl border bg-background p-5"><div className="flex items-center justify-between gap-3 border-b pb-3"><h3 className="font-semibold">Result</h3>{result && <button type="button" onClick={download} className="text-xs font-semibold text-primary underline underline-offset-4">Download text</button>}</div>{error && <div role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}{!result && !error && <p className="mt-6 text-sm leading-6 text-muted-foreground">Your structured reaction explanation will appear here.</p>}{result && <><div className="mt-4"><ChemistryAnswer content={result.answer} /></div><div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-4 text-xs text-muted-foreground"><span>Was this useful?</span><button type="button" onClick={() => sendFeedback('up')} className={`rounded border px-3 py-1.5 ${feedback === 'up' ? 'bg-secondary text-primary' : ''}`}>Yes</button><button type="button" onClick={() => sendFeedback('down')} className={`rounded border px-3 py-1.5 ${feedback === 'down' ? 'bg-secondary text-primary' : ''}`}>Needs correction</button>{feedback && <span>Thanks for the feedback.</span>}</div></>}</div></div></div></section>
}

export function CheckIcon() { return null }
export function ArrowIcon() { return null }
