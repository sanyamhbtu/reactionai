import { FileDown, ShieldCheck } from 'lucide-react'

const documents = [
  ['pitch', 'Executive pitch', 'The problem, gap, motivation, and why ReactionAI matters.'],
  ['technical', 'Technical architecture', 'Stack, AI layer, database, authentication, and security.'],
  ['workflow', 'How it works', 'The journey from a question or drawing to a saved explanation.'],
  ['impact', 'Impact and deployment', 'Learner value, safety boundaries, and where it runs.'],
  ['future', 'Future scope', 'The next ideas for learning, collaboration, and chemistry intelligence.'],
] as const

export function HackathonPack() {
  return <section className="mt-12 border border-border bg-card p-5 sm:p-7" aria-labelledby="hackathon-pack-title">
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">For your presentation</p><h2 id="hackathon-pack-title" className="mt-2 text-2xl font-semibold text-primary">Hackathon pack</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Download polished project briefs covering the story, technology, workflow, deployment, impact, and future scope of ReactionAI.</p></div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-accent" aria-hidden="true" /> Private authenticated downloads</div>
    </div>
    <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {documents.map(([id, title, description]) => <a key={id} href={`/api/hackathon-pdf/${id}`} className="group flex min-h-32 flex-col justify-between border border-border p-4 transition hover:border-accent hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div><h3 className="font-semibold text-primary group-hover:text-accent">{title}</h3><p className="mt-2 text-sm leading-5 text-muted-foreground">{description}</p></div><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Download PDF <FileDown className="size-4" aria-hidden="true" /></span></a>)}
    </div>
  </section>
}
