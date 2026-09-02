import { getReactionHistory } from '@/app/actions/history'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const items = await getReactionHistory()
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-12"><div className="flex items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-primary">Private notebook</p><h1 className="mt-2 text-4xl font-bold">Reaction history</h1><p className="mt-2 text-muted-foreground">Saved predictions for {session.user.email}.</p></div><a href="/" className="text-sm font-semibold text-primary underline">New prediction</a></div><div className="mt-10 space-y-3">{items.length ? items.map((item) => <article key={item.id} className="rounded-xl border bg-card p-5"><div className="flex items-center justify-between gap-4"><h2 className="font-semibold">{item.title}</h2><time className="text-xs text-muted-foreground">{item.createdAt.toLocaleDateString()}</time></div><p className="mt-2 text-xs uppercase tracking-wider text-primary">{item.mode}</p><p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{String((item.result as { answer?: string }).answer || item.input)}</p></article>) : <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">Your saved predictions will appear here after your first question.</div>}</div></main>
}
