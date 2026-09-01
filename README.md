# ReactionAI

> A clear, focused chemistry learning workspace powered by Groq.

ReactionAI helps students and curious chemistry learners turn difficult questions into short, understandable explanations. Ask about a reaction, mechanism, molecule, concept, or SMILES string and get a concise answer in easy English, Hindi, or both.

## Why ReactionAI exists

Chemistry often becomes difficult for a simple reason: the useful explanation is buried under unfamiliar terminology, long textbook paragraphs, or disconnected reaction steps.

ReactionAI is designed to make the first step easier. It helps you:

- Understand chemistry concepts without unnecessary complexity
- Explore reaction logic and likely products before deeper study
- Break down unfamiliar mechanisms and molecules
- Prepare better questions for teachers, mentors, or lab discussions
- Learn through short explanations instead of overwhelming blocks of text

ReactionAI is a learning assistant, not a replacement for laboratory work, peer review, textbooks, or experimental validation.

## What it does

1. **Accepts a chemistry question** — Write a natural-language question or paste a SMILES string.
2. **Adds learning context** — Choose Student or Research mode and select English, Hindi, or both.
3. **Sends the request to Groq** — The server securely forwards the request to Groq’s OpenAI-compatible API.
4. **Returns a concise explanation** — The model answers with the key idea first, using plain language and a short format.

## Example questions

- Why does esterification need an acid catalyst?
- Explain the difference between SN1 and SN2 reactions.
- What product is likely formed when this molecule reacts with bromine?
- Explain this SMILES string in simple English.
- Why is benzene unusually stable?

## Technology stack

- **Next.js 16** — App Router, route handlers, and the application framework
- **React 19** — Interactive client-side workspace
- **TypeScript** — Type-safe application code
- **Tailwind CSS 4** — Responsive styling and design tokens
- **Lucide React** — Accessible interface icons
- **Groq API** — Fast language-model inference through the OpenAI-compatible API
- **OpenAI-compatible `fetch` integration** — Server-side requests to Groq without exposing the API key in the browser
- **Vercel** — Deployment and hosting

## Project structure

```text
app/
├── api/
│   ├── feedback/route.ts   # Feedback endpoint
│   └── predict/route.ts    # Groq prediction endpoint
├── globals.css              # Global theme and Tailwind styles
├── layout.tsx               # Root layout and metadata
└── page.tsx                 # Landing page and workspace shell

components/
├── dna-helix.tsx            # Chemistry-themed workspace visual
├── reactionai-tool.tsx      # Question form and prediction results
└── ui/button.tsx            # Shared button component

lib/
└── utils.ts                 # Shared utility helpers
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- A Groq account and API key
- pnpm, npm, or another compatible package manager

### Install dependencies

```bash
pnpm install
```

### Configure the environment

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Never commit `.env.local` or expose the Groq key in client-side code. The key is read only by the server route at `app/api/predict/route.ts`.

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
pnpm build
pnpm start
```

## API reference

### `POST /api/predict`

Generates a concise chemistry explanation through Groq.

#### Request body

```json
{
  "input": "Why does esterification need acid?",
  "mode": "student",
  "language": "english"
}
```

Supported values:

- `mode`: `student` or `research`
- `language`: `english`, `hindi`, or `both`
- `input`: up to 4,000 characters

#### Successful response

```json
{
  "answer": "An acid catalyst helps esterification by ...",
  "keyPoint": "",
  "safetyNote": ""
}
```

#### Error behavior

The API returns clear HTTP errors for missing input, invalid configuration, invalid API keys, rate limits, provider failures, and timeouts. Provider credentials and model calls remain on the server.

## Responsible use

ReactionAI should be used for learning, brainstorming, and building intuition. Always verify important chemistry with reliable sources and qualified instructors. Do not treat an AI-generated answer as proof that a reaction is experimentally safe, feasible, or optimized. Avoid using the tool as a substitute for appropriate lab training, risk assessment, PPE, waste handling, or institutional safety procedures.

## Deployment

The project is connected to Vercel and can be deployed from the Vercel dashboard or through the linked v0 project. Add `GROQ_API_KEY` to the Vercel project environment variables for each environment where predictions should work.

## Development notes

- Keep Groq calls server-side.
- Keep responses short and easy to understand.
- Prefer accessible labels and semantic HTML when changing the interface.
- Test both desktop and mobile layouts before shipping.
- Do not add real API keys to source control.

## Continue with v0

This repository is linked to the v0 project for ReactionAI. Continue iterating on the project here:

[Open the ReactionAI v0 project](https://v0.app/chat/projects/prj_9KsuUINtRwFPW4RQObsuwErSfRcc)

## License

No license has been specified yet. Add a license before distributing or accepting external contributions.
