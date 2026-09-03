'use client'

import { useState } from 'react'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  return <div className="relative md:hidden"><button type="button" aria-expanded={open} aria-controls="mobile-links" onClick={() => setOpen((value) => !value)} className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-primary">Menu</button>{open && <div id="mobile-links" className="absolute right-0 top-11 z-10 flex min-w-44 flex-col gap-1 rounded-lg border border-border bg-card p-2 shadow-lg"><a onClick={() => setOpen(false)} href="#how-it-works" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">How it works</a><a onClick={() => setOpen(false)} href="#use-cases" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">Use cases</a><a onClick={() => setOpen(false)} href="#workspace" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">Workspace</a></div>}</div>
}
