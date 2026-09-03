import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { smiles } = await request.json() as { smiles?: string }
    const value = smiles?.trim()
    if (!value) return NextResponse.json({ error: 'A SMILES structure is required.' }, { status: 400 })
    const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(value)}/property/IUPACName,Title,CanonicalSMILES,IsomericSMILES/JSON`, { next: { revalidate: 86400 } })
    const data = await response.json().catch(() => ({})) as { PropertyTable?: { Properties?: Array<{ IUPACName?: string; Title?: string; ConnectivitySMILES?: string; CanonicalSMILES?: string; IsomericSMILES?: string }> } }
    if (!response.ok) return NextResponse.json({ error: 'We could not identify that structure. Check the drawing and try again.' }, { status: 404 })
    const property = data.PropertyTable?.Properties?.[0]
    if (!property) return NextResponse.json({ error: 'No compound match was found for this structure.' }, { status: 404 })
    return NextResponse.json({ name: property.Title || property.IUPACName || 'Unknown compound', iupacName: property.IUPACName || null, canonicalSmiles: property.CanonicalSMILES || property.ConnectivitySMILES || value, isomericSmiles: property.IsomericSMILES || value })
  } catch {
    return NextResponse.json({ error: 'Structure lookup is temporarily unavailable.' }, { status: 502 })
  }
}
