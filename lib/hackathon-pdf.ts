import PDFDocument from 'pdfkit'

export type HackathonDocument = 'pitch' | 'technical' | 'workflow' | 'impact' | 'future'

const navy = '#073B5C'
const teal = '#0E8C8C'
const ink = '#17324D'
const muted = '#557086'
const pale = '#EAF5F4'

const docs: Record<HackathonDocument, { title: string; kicker: string; sections: [string, string][] }> = {
  pitch: {
    title: 'ReactionAI', kicker: 'Hackathon project brief', sections: [
      ['The idea', 'ReactionAI is a private chemistry notebook that turns natural-language questions, reactants, SMILES, and hand-drawn structures into structured, safety-aware reaction explanations.'],
      ['The gap it fills', 'Chemistry learners often move between disconnected drawing tools, search engines, textbooks, and safety sheets. ReactionAI brings interpretation, explanation, structure input, and a personal history into one focused workspace.'],
      ['Why this project', 'The project was chosen because chemistry is both visual and procedural. A useful assistant must understand molecules, explain mechanisms in plain language, and keep the learner in control of the question.'],
      ['What makes it compelling', 'A student can ask a question, paste SMILES, or draw a molecule, then receive a readable explanation covering reaction, mechanism, precautions, hazards, and disposal guidance.'],
    ]
  },
  technical: {
    title: 'ReactionAI | Technical architecture', kicker: 'How the system is built', sections: [
      ['Frontend', 'Next.js App Router, React, TypeScript, Tailwind CSS, responsive layouts, accessible auth forms, formatted chemistry results, dashboard, and history views.'],
      ['Authentication and data', 'Better Auth provides email and password authentication. Neon Postgres stores users, sessions, accounts, reactions, feedback, and user-scoped history.'],
      ['AI layer', 'A server-side prediction route calls Groq models with a chemistry-focused prompt. Empty responses trigger a retry path and errors are returned without exposing secrets.'],
      ['Molecule intelligence', 'Ketcher provides the interactive structure editor. Standalone Indigo runtime assets support structure processing. PubChem lookup enriches drawn structures with names and canonical SMILES.'],
      ['Security and privacy', 'Protected pages verify sessions on the server. History queries are scoped to the authenticated user. API secrets stay server-side and passwords are handled by Better Auth.'],
    ]
  },
  workflow: {
    title: 'ReactionAI | User workflow', kicker: 'From structure to understanding', sections: [
      ['1. Choose an input', 'The learner enters a natural-language question, types or pastes SMILES, or opens the molecule editor.'],
      ['2. Draw the molecule', 'In Ketcher, the learner selects atoms, draws bonds, connects fragments, creates rings, and edits the structure visually.'],
      ['3. Identify the structure', 'The app exports the drawing, sends the structure for lookup, and returns compound information such as name and canonical SMILES.'],
      ['4. Ask the question', 'The structure and the learner question are sent to the server-side prediction route with the selected forward-reaction or retrosynthesis mode.'],
      ['5. Learn and revisit', 'The response is formatted for reading, safety sections are highlighted, and authenticated users can revisit saved results from the dashboard.'],
    ]
  },
  impact: {
    title: 'ReactionAI | Impact and safety', kicker: 'Designed for responsible learning', sections: [
      ['Learner impact', 'ReactionAI lowers the friction between recognizing a structure and understanding what it means. It supports exploratory learning without forcing beginners to know the right search vocabulary first.'],
      ['Safety by design', 'Responses are instructed to include precautions, toxic or harmful chemicals, and lab disposal guidance. This makes safety part of the answer rather than an afterthought.'],
      ['Responsible boundaries', 'The tool is an educational aid, not a substitute for a qualified chemist, institutional procedures, or a current safety data sheet. Users should verify conditions before laboratory work.'],
      ['Deployment', 'The application is designed for Vercel deployment with a Next.js runtime, Neon Postgres for persistence, and server-side environment variables for authentication and AI access.'],
    ]
  },
  future: {
    title: 'ReactionAI | Future scope', kicker: 'Where the project can go next', sections: [
      ['Better chemistry reasoning', 'Add reaction-condition extraction, reagent recognition, confidence indicators, atom mapping, and stronger validation against curated reaction datasets.'],
      ['Collaboration', 'Introduce shared notebooks, teacher feedback, classroom workspaces, exportable lab reports, and permissioned project sharing.'],
      ['Multimodal learning', 'Support image-to-structure recognition, mechanism sketching, voice questions, and step-by-step interactive lessons.'],
      ['Research and scale', 'Add retrieval from trusted literature and safety sources, model evaluation dashboards, caching, rate limiting, and analytics that measure learning outcomes.'],
    ]
  }
}

export async function createHackathonPdf(kind: HackathonDocument) {
  const definition = docs[kind]
  const doc = new PDFDocument({ size: 'A4', margin: 54, info: { Title: definition.title, Author: 'ReactionAI' } })
  const chunks: Buffer[] = []
  doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
  const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))))
  doc.rect(0, 0, 595, 842).fill('#F8FCFC')
  doc.fillColor(teal).fontSize(10).font('Helvetica-Bold').text('REACTIONAI / HACKATHON PACK', 54, 56, { characterSpacing: 1.5 })
  doc.moveDown(2)
  doc.fillColor(navy).fontSize(31).font('Helvetica-Bold').text(definition.title, 54, 106, { width: 475 })
  doc.fillColor(muted).fontSize(12).font('Helvetica').text(definition.kicker, 54, 160)
  doc.moveTo(54, 188).lineTo(541, 188).strokeColor('#BCD8D8').stroke()
  let y = 220
  definition.sections.forEach(([heading, body], index) => {
    if (y > 700) { doc.addPage(); y = 60 }
    doc.fillColor(teal).fontSize(11).font('Helvetica-Bold').text(heading.toUpperCase(), 54, y, { characterSpacing: 1 })
    y += 22
    doc.fillColor(ink).fontSize(14).font('Helvetica').text(body, 54, y, { width: 475, lineGap: 5 })
    y = doc.y + 34
    if (index < definition.sections.length - 1) { doc.moveTo(54, y - 15).lineTo(541, y - 15).strokeColor('#D7E9E8').stroke() }
  })
  doc.fillColor(muted).fontSize(9).text('ReactionAI • Educational chemistry intelligence • Generated for hackathon review', 54, 790, { width: 487, align: 'center' })
  doc.end()
  return done
}

export const hackathonDocuments = Object.entries(docs).map(([id, value]) => ({ id: id as HackathonDocument, title: value.title, description: value.kicker }))
