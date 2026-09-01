'use client'

import { ArrowRight, FlaskConical, ShieldCheck, Sparkles } from 'lucide-react'
import { DnaHelix } from '@/components/dna-helix'
import { ReactionTool } from '@/components/reactionai-tool'

export default function Page() {
  return (
    <main id="top" className="min-h-screen bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-tight text-primary"><span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><FlaskConical className="size-5" /></span>ReactionAI</a>
        <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"><a href="#top" className="hover:text-primary">Home</a><a href="#try-tool" className="hover:text-primary">Try Tool</a><a href="#pricing" className="hover:text-primary">Pricing</a><a href="#about" className="hover:text-primary">About</a></div>
        <a href="#try-tool" className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90">Get started</a>
      </nav>
      <section className="border-y border-border bg-card"><div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24"><div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent"><ShieldCheck className="size-3.5" /> Built for ambitious chemistry</div><h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-primary sm:text-6xl lg:text-7xl">Predict reactions.<br /><span className="text-accent">Plan synthesis.</span><br />In seconds.</h1><p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">Affordable AI chemistry for Indian students, researchers, and small companies. Turn a question into a clearer path from molecule to bench.</p><a href="#try-tool" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition hover:bg-primary/90">Try it now <ArrowRight className="size-4" /></a></div><div className="rounded-3xl border border-border bg-secondary/50 p-5 shadow-sm sm:p-8"><div className="mb-5 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-semibold text-primary"><Sparkles className="size-4 text-accent" /> Live molecular model</span><span className="rounded-full bg-accent/15 px-3 py-1 font-medium text-accent">Running</span></div><DnaHelix /><p className="mt-5 text-center text-sm leading-6 text-muted-foreground">Dynamic structure space for reaction-aware synthesis planning.</p></div></div></section>
      <ReactionTool />
      <section id="about" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"><div className="rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12"><p className="text-sm font-semibold uppercase tracking-widest text-accent">Built for the bench</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">A clearer path from idea to informed experiment.</h2><p className="mt-4 max-w-2xl leading-7 text-primary-foreground/75">Use every prediction as a learning aid, then validate routes with qualified chemists and appropriate laboratory safety controls.</p></div></section>
    </main>
  )
}
