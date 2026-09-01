'use client'

import { ArrowRight, BookOpen, CheckCircle2, FlaskConical, ShieldCheck, Sparkles } from 'lucide-react'
import { DnaHelix } from '@/components/dna-helix'
import { ReactionTool } from '@/components/reactionai-tool'

const useCases = [
  ['Learn faster', 'Break down mechanisms, concepts, and unfamiliar molecules in clear language.'],
  ['Plan with context', 'Explore likely products and reaction logic before you open the lab notebook.'],
  ['Ask better questions', 'Turn a rough idea into a focused prompt you can discuss with a teacher or chemist.'],
]

export default function Page() {
  return (
    <main id="top" className="min-h-screen bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8" aria-label="Main navigation">
        <a href="#top" className="flex items-center gap-3 text-lg font-bold tracking-tight text-primary"><span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"><FlaskConical className="size-5" /></span>ReactionAI</a>
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex"><a href="#how-it-works" className="hover:text-primary">How it works</a><a href="#use-cases" className="hover:text-primary">Use cases</a><a href="#try-tool" className="hover:text-primary">Workspace</a></div>
        <a href="#try-tool" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:brightness-95">Open workspace</a>
      </nav>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border-l-2 border-accent pl-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent"><ShieldCheck className="size-3.5" /> Chemistry, made clearer</div>
            <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-primary sm:text-6xl lg:text-7xl">Your reaction<br /><span className="text-accent">thinking partner.</span></h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">Ask about a reaction, mechanism, molecule, or concept. ReactionAI turns complex chemistry into a short, useful explanation you can actually act on.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="#try-tool" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition hover:bg-primary/90">Start asking <ArrowRight className="size-4" /></a><a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3.5 font-semibold text-primary transition hover:bg-secondary"><BookOpen className="size-4" /> See how it works</a></div>
          </div>
          <div className="border border-border bg-secondary/50 p-5 sm:p-8"><div className="mb-5 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-semibold text-primary"><Sparkles className="size-4 text-accent" /> Molecular workspace</span><span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Live</span></div><DnaHelix /><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">A focused place to explore reaction logic, one question at a time.</p></div>
        </div>
      </section>

      <ReactionTool />

      <section id="how-it-works" className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">A simple workflow</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">From question to clarity.</h2><p className="mt-4 leading-7 text-muted-foreground">No complicated setup. Write what you are curious about and get an answer shaped for your level.</p></div><div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">{[['01', 'Write it naturally', 'Type a chemistry question or paste a SMILES string.'], ['02', 'Choose your depth', 'Use Student for learning or Research for more technical context.'], ['03', 'Read and verify', 'Use the concise answer as a starting point, then check trusted sources.']].map(([number, title, text]) => <div key={number} className="bg-card p-7"><span className="font-mono text-sm text-accent">{number}</span><h3 className="mt-8 text-lg font-semibold text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div></div>
      </section>

      <section id="use-cases" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Why ReactionAI</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">Useful before, during, and after study.</h2></div><p className="max-w-xl leading-7 text-muted-foreground">ReactionAI helps you build intuition, prepare for experiments, and communicate chemistry more clearly. It is an assistant for thinking—not a replacement for experimental validation.</p></div><div className="mt-12 grid gap-4 md:grid-cols-3">{useCases.map(([title, text]) => <article key={title} className="border border-border bg-card p-6"><CheckCircle2 className="size-5 text-accent" /><h3 className="mt-8 text-lg font-semibold text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div></section>

      <footer className="border-t border-border bg-primary text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between"><div><a href="#top" className="flex items-center gap-3 text-lg font-bold"><span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground"><FlaskConical className="size-4" /></span>ReactionAI</a><p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">Clearer chemistry for curious minds. Explore thoughtfully, verify carefully.</p></div><div className="flex items-center gap-5 text-sm text-primary-foreground/70"><a href="#try-tool" className="hover:text-primary-foreground">Workspace</a><a href="#how-it-works" className="hover:text-primary-foreground">Guide</a><a href="https://github.com" className="hover:text-primary-foreground">GitHub</a></div></div><div className="mx-auto max-w-7xl border-t border-primary-foreground/15 px-5 py-5 text-xs text-primary-foreground/50 sm:px-8">© 2026 ReactionAI. Built for learning, discovery, and better questions.</div></footer>
    </main>
  )
}
