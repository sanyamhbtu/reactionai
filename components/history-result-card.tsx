'use client'

import { useState } from 'react'

type HistoryItem = {
  title: string
  mode: string
  input: string
  createdAt: string
  result: unknown
}

function formatInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g).filter(Boolean).map((part, index) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) return <strong key={index}>{part.slice(2, -2)}</strong>
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) return <em key={index}>{part.slice(1, -1)}</em>
    return <span key={index}>{part}</span>
  })
}

function ResultContent({ content }: { content: string }) {
  const lines = content.replace(/\r/g, '').split('\n')
  return <div className="space-y-3 text-sm leading-6 text-foreground">{lines.map((raw, index) => {
    const line = raw.trim()
    if (!line) return <div key={index} className="h-1" />
    const heading = line.match(/^\*{0,2}(Reaction|Mechanism|Precautions|Toxic or harmful chemicals|Lab disposal|Safety flags|Alternative routes|Feasibility|Reagents and conditions)\*{0,2}:?$/i)
    if (heading) return <h4 key={index} className="border-b border-border pb-1 font-bold tracking-wide text-primary">{heading[1]}</h4>
    const ordered = line.match(/^\d+[.)]\s+(.*)$/)
    const unordered = line.match(/^[-•]\s+(.*)$/)
    if (ordered) return <p key={index} className="pl-5"><span className="font-semibold text-accent">{line.match(/^\d+/)?.[0]}.</span> {formatInline(ordered[1])}</p>
    if (unordered) return <p key={index} className="pl-5 before:mr-2 before:text-accent before:content-['•']">{formatInline(unordered[1])}</p>
    const equation = line.includes('→') || line.includes('⇌')
    return equation ? <div key={index} className="overflow-x-auto rounded-md border border-accent/30 bg-accent/5 px-3 py-2 font-mono text-sm">{formatInline(line)}</div> : <p key={index}>{formatInline(line)}</p>
  })}</div>
}

export function HistoryResultCard({ item }: { item: HistoryItem }) {
  const [open, setOpen] = useState(false)
  const result = item.result as { answer?: string }
  const answer = result.answer || item.input
  return <>
    <button type="button" onClick={() => setOpen(true)} className="block w-full border border-border bg-card p-5 text-left transition hover:border-primary hover:bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary">
      <div className="flex items-center justify-between gap-4"><h3 className="font-semibold text-primary">{item.title}</h3><time className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</time></div>
      <p className="mt-2 text-xs uppercase tracking-wider text-accent">{item.mode}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{answer}</p>
      <span className="mt-3 inline-block text-xs font-semibold text-primary underline">Click to view full result</span>
    </button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section role="dialog" aria-modal="true" aria-labelledby="result-title" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-border bg-background p-6 shadow-xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4"><div><p className="text-xs uppercase tracking-wider text-accent">{item.mode}</p><h3 id="result-title" className="mt-1 text-xl font-bold text-primary">{item.title}</h3></div><button type="button" onClick={() => setOpen(false)} aria-label="Close result" className="rounded-md border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-secondary">Close</button></div>
        <div className="pt-5"><ResultContent content={answer} /></div>
      </section>
    </div>}
  </>
}
