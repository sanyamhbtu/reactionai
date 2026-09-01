'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowRight, Check, ChevronDown, FileText, FlaskConical, Leaf, Loader2, MessageSquare, ThumbsDown, ThumbsUp, Zap } from 'lucide-react'

type Step = { stepNumber?: number; reagents?: string; conditions?: string; explanation?: string; explanationHindi?: string; hazardLevel?: string; hazardNote?: string }
type Route = { rank?: number; recommended?: boolean; estimatedYield?: string; confidence?: string; steps?: Step[]; greenerAlternative?: string }
type Prediction = { targetMolecule?: { name?: string; smiles?: string }; routes?: Route[] }

const messages = ['Analyzing molecular structure...', 'Searching reaction precedents...', 'Ranking synthetic routes...']

export function ReactionTool() {
  const [tab, setTab] = useState<'problem' | 'smiles'>('problem')
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'student' | 'research'>('student')
  const [language, setLanguage] = useState('english')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Prediction | null>(null)
  const [openRoute, setOpenRoute] = useState(0)
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({})
  const [messageIndex, setMessageIndex] = useState(0)
  const [feedback, setFeedback] = useState<Record<number, string>>({})

  async function predict() {
    if (!input.trim()) { setError(tab === 'problem' ? 'Describe a chemistry question to continue.' : 'Enter a SMILES string to continue.'); return }
    setError(''); setResult(null); setLoading(true); setMessageIndex(0)
    const timer = window.setInterval(() => setMessageIndex((index) => (index + 1) % messages.length), 1500)
    try {
      const response = await fetch('/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input: input.trim(), mode, language }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'The prediction service is unavailable.')
      setResult(data); setOpenRoute(0)
    } catch (err) { setError(err instanceof Error ? err.message : 'We could not complete the prediction. Please try again.') }
    finally { window.clearInterval(timer); setLoading(false) }
  }

  async function sendFeedback(route: number, rating: 'up' | 'down') {
    setFeedback((current) => ({ ...current, [route]: rating }))
    await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ route, rating }) }).catch(() => undefined)
  }

  return <section id="try-tool" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_80px_rgba(30,58,95,0.10)]">
      <div className="flex flex-col gap-3 border-b border-border bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><FlaskConical className="size-4" /> Prediction workspace</div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What are you trying to make?</h2></div>
        <div className="flex rounded-lg border border-border bg-background p-1 text-sm"><button onClick={() => setMode('student')} className={`rounded-md px-3 py-2 ${mode === 'student' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Student Mode</button><button onClick={() => setMode('research')} className={`rounded-md px-3 py-2 ${mode === 'research' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Research Mode</button></div>
      </div>
      <div className="p-5 sm:p-8">
        <div className="mb-5 flex gap-6 border-b border-border"><button onClick={() => setTab('problem')} className={`border-b-2 pb-3 text-sm font-medium ${tab === 'problem' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>Describe your problem</button><button onClick={() => setTab('smiles')} className={`border-b-2 pb-3 text-sm font-medium ${tab === 'smiles' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>Enter molecule (SMILES)</button></div>
        {tab === 'problem' ? <div><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); predict() } }} className="min-h-32 w-full resize-y rounded-xl border border-input bg-background p-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Ask about a reaction, mechanism, synthesis, molecule, or chemistry concept..." aria-label="Describe your chemistry question" /><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>Try:</span>{['Why does esterification need acid?', 'Predict the product of an SN2 reaction', 'How do I synthesize aspirin?'].map((example) => <button key={example} type="button" onClick={() => setInput(example)} className="rounded-full border border-border px-3 py-1 transition hover:border-primary hover:text-primary">{example}</button>)}</div></div> : <div><input value={input} onChange={(e) => setInput(e.target.value)} className="w-full rounded-xl border border-input bg-background p-4 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="e.g. CC(=O)OC1=CC=CC=C1C(=O)O" aria-label="Enter molecule SMILES" /><p className="mt-3 text-sm text-muted-foreground">Not familiar with SMILES? <button onClick={() => setTab('problem')} className="font-medium text-primary underline underline-offset-4">Describe your problem instead.</button></p></div>}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><label className="text-sm font-medium">Language<select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-2 block rounded-lg border border-input bg-background px-3 py-2 font-normal"><option value="english">English</option><option value="hindi">Hindi</option><option value="both">Both</option></select></label><button onClick={predict} disabled={loading} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-accent-foreground shadow-sm transition hover:brightness-95 disabled:cursor-wait disabled:opacity-70 sm:min-w-52">{loading ? <><Loader2 className="size-4 animate-spin" /> Predicting...</> : <><Zap className="size-4" /> Ask ReactionAI</>}</button></div>
        {error && <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><div><p className="font-semibold">Something went wrong</p><p className="mt-1">{error}</p><button onClick={predict} className="mt-3 font-semibold underline">Try again</button></div></div>}
        {loading && <div className="mt-8 space-y-4" aria-live="polite"><p className="text-sm font-medium text-primary">{messages[messageIndex]}</p><div className="h-5 w-2/3 animate-pulse rounded bg-muted" /><div className="h-24 animate-pulse rounded-xl bg-muted" /></div>}
        {result && <Results prediction={result} openRoute={openRoute} setOpenRoute={setOpenRoute} openSteps={openSteps} setOpenSteps={setOpenSteps} feedback={feedback} sendFeedback={sendFeedback} />}
      </div>
    </div>
  </section>
}

function Results({ prediction, openRoute, setOpenRoute, openSteps, setOpenSteps, feedback, sendFeedback }: { prediction: Prediction; openRoute: number; setOpenRoute: (n: number) => void; openSteps: Record<string, boolean>; setOpenSteps: React.Dispatch<React.SetStateAction<Record<string, boolean>>>; feedback: Record<number, string>; sendFeedback: (route: number, rating: 'up' | 'down') => void }) {
  const confidence = prediction.routes?.[0]?.confidence || 'medium'
  return <div className="mt-10 border-t border-border pt-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Interpreted target</p><h3 className="mt-1 text-2xl font-semibold">{prediction.targetMolecule?.name || 'Target molecule'}</h3><p className="mt-2 break-all font-mono text-xs text-muted-foreground">{prediction.targetMolecule?.smiles || 'SMILES unavailable'}</p></div><div className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${confidence.toLowerCase() === 'high' ? 'bg-emerald-100 text-emerald-800' : confidence.toLowerCase() === 'low' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>Confidence: {confidence}</div></div><div className="mt-8 flex items-center gap-3"><h3 className="text-xl font-semibold">Ranked synthesis routes</h3><span className="text-sm text-muted-foreground">{prediction.routes?.length || 0} found</span></div><div className="mt-4 space-y-4">{prediction.routes?.map((route, routeIndex) => <article key={routeIndex} className="rounded-2xl border border-border bg-background"><button className="flex w-full items-center justify-between gap-4 p-5 text-left" onClick={() => setOpenRoute(openRoute === routeIndex ? -1 : routeIndex)}><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{route.rank || routeIndex + 1}</span><div><p className="font-semibold">Route {route.rank || routeIndex + 1} {route.recommended && <span className="ml-2 text-xs font-medium text-accent">Recommended</span>}</p><p className="mt-1 text-sm text-muted-foreground">Estimated yield: {route.estimatedYield || 'Not specified'}</p></div></div><ChevronDown className={`size-5 transition ${openRoute === routeIndex ? 'rotate-180' : ''}`} /></button>{openRoute === routeIndex && <div className="border-t border-border p-5"><div className="space-y-3">{route.steps?.map((step, stepIndex) => { const key = `${routeIndex}-${stepIndex}`; const expanded = openSteps[key]; return <div key={key} className="relative flex gap-4"><div className="flex flex-col items-center"><span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary">{step.stepNumber || stepIndex + 1}</span>{stepIndex < (route.steps?.length || 0) - 1 && <span className="absolute top-8 h-full w-px bg-border" />}</div><div className="mb-3 min-w-0 flex-1 rounded-xl border border-border p-4"><button className="flex w-full items-center justify-between text-left" onClick={() => setOpenSteps((current) => ({ ...current, [key]: !current[key] }))}><span className="font-medium">{step.reagents || `Reaction step ${stepIndex + 1}`}</span><ChevronDown className={`size-4 transition ${expanded ? 'rotate-180' : ''}`} /></button>{expanded && <div className="mt-4 space-y-3 text-sm text-muted-foreground"><p><strong className="text-foreground">Conditions:</strong> {step.conditions || 'Not specified'}</p><p><strong className="text-foreground">Mechanism:</strong> {step.explanation || 'Explanation unavailable.'}</p>{step.explanationHindi && <p><strong className="text-foreground">हिंदी:</strong> {step.explanationHindi}</p>}<p className="flex items-center gap-2"><span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${step.hazardLevel?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' : step.hazardLevel?.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>Hazard: {step.hazardLevel || 'unknown'}</span>{step.hazardNote && <span>{step.hazardNote}</span>}</p></div>}</div></div>})}</div>{route.greenerAlternative && <div className="mt-5 flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><Leaf className="size-5 shrink-0" /><p><strong>Greener alternative available.</strong> {route.greenerAlternative}</p></div>}<div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-sm text-muted-foreground"><MessageSquare className="size-4" /> Was this route useful?<button aria-label="Route helpful" onClick={() => sendFeedback(routeIndex, 'up')} className={`rounded-md p-2 hover:bg-secondary ${feedback[routeIndex] === 'up' ? 'bg-secondary text-primary' : ''}`}><ThumbsUp className="size-4" /></button><button aria-label="Route not helpful" onClick={() => sendFeedback(routeIndex, 'down')} className={`rounded-md p-2 hover:bg-secondary ${feedback[routeIndex] === 'down' ? 'bg-secondary text-destructive' : ''}`}><ThumbsDown className="size-4" /></button></div><button className="flex items-center gap-2 text-sm font-medium text-primary"><FileText className="size-4" /> Download as PDF</button></div></div>}</article>)}</div></div>
}

export function CheckIcon() { return <Check className="size-4" /> }
export function ArrowIcon() { return <ArrowRight className="size-4" /> }
