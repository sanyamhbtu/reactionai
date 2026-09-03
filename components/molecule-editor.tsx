'use client'

import { useState } from 'react'
import { Editor } from 'ketcher-react'
import { StandaloneStructServiceProvider } from 'ketcher-standalone'
import 'ketcher-react/dist/index.css'

type Structure = { smiles: string; molfile?: string }

export function MoleculeEditor({ onStructure }: { onStructure: (structure: Structure) => void }) {
  const [ketcher, setKetcher] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [compound, setCompound] = useState<{ name: string; iupacName?: string | null; canonicalSmiles?: string } | null>(null)
  const [provider] = useState(() => new StandaloneStructServiceProvider())

  async function identify() {
    if (!ketcher) return
    setBusy(true); setError('')
    try {
      const smiles = (await ketcher.getSmiles()).trim()
      if (!smiles) throw new Error('Draw a molecule before identifying it.')
      const molfile = await ketcher.getMolfile()
      const response = await fetch('/api/structure', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smiles }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not identify this structure.')
      setCompound(data)
      onStructure({ smiles: data.isomericSmiles || smiles, molfile })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not read this structure.') } finally { setBusy(false) }
  }

  return <div className="mt-5 rounded-lg border border-border bg-card p-3 sm:p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-semibold text-primary">Draw a molecule</p><p className="text-xs text-muted-foreground">Use the editor, then identify the compound.</p></div><button type="button" onClick={identify} disabled={!ketcher || busy} className="rounded-md bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground disabled:opacity-50">{busy ? 'Identifying…' : 'Identify structure'}</button></div><div className="h-[360px] overflow-hidden rounded-md border border-border bg-background sm:h-[420px]"><Editor staticResourcesUrl="/ketcher/" structServiceProvider={provider as any} errorHandler={(message) => setError(String(message))} onInit={setKetcher} /></div>{error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}{compound && <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 p-3 text-sm"><p className="font-semibold text-primary">{compound.name}</p>{compound.iupacName && <p className="mt-1 text-xs text-muted-foreground">IUPAC: {compound.iupacName}</p>}<code className="mt-2 block break-all font-mono text-xs text-primary">{compound.canonicalSmiles}</code></div>}</div>
}
