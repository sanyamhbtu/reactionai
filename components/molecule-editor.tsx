'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Ketcher } from 'ketcher-core'
import { IndigoProvider } from 'ketcher-react'
import 'ketcher-react/dist/index.css'

const Editor = dynamic(() => import('ketcher-react').then((module) => module.Editor), { ssr: false })

export function MoleculeEditor({ onSmiles }: { onSmiles: (smiles: string) => void }) {
  const [ketcher, setKetcher] = useState<Ketcher | null>(null)
  const [open, setOpen] = useState(false)
  async function useStructure() { if (!ketcher) return; const smiles = await ketcher.getSmiles(); onSmiles(smiles); setOpen(false) }
  return <div className="mt-3"><button type="button" onClick={() => setOpen((value) => !value)} className="rounded-lg border px-3 py-2 text-sm font-semibold text-primary hover:bg-secondary">{open ? 'Hide molecule editor' : 'Draw a molecule instead'}</button>{open && <div className="mt-3 overflow-hidden rounded-lg border bg-white"><div className="h-[420px]"><Editor staticResourcesUrl="/ketcher/" structServiceProvider={IndigoProvider} errorHandler={(message) => console.warn('[v0] Ketcher:', message)} onInit={setKetcher} /></div><div className="flex justify-end border-t bg-card p-3"><button type="button" onClick={() => void useStructure()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Use this structure</button></div></div>}</div>
}
