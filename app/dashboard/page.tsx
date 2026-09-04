import { getReactionHistory } from '@/app/actions/history'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { HistoryResultCard } from '@/components/history-result-card'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const history = await getReactionHistory()
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <header className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Private notebook</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-primary">Your dashboard</h1><p className="mt-3 text-muted-foreground">Welcome back, {session.user.name || session.user.email}.</p></div>
          <div className="flex gap-3"><a href="/" className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-primary hover:bg-secondary">New question</a><a href="/history" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Full history</a></div>
        </header>
        <section className="mt-10 grid gap-4 sm:grid-cols-3"><div className="border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Saved predictions</p><p className="mt-2 text-3xl font-semibold text-primary">{history.length}</p></div><div className="border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Account email</p><p className="mt-2 truncate font-medium text-primary">{session.user.email}</p></div><div className="border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Workspace</p><p className="mt-2 font-medium text-accent">Ready to explore</p></div></section>
        <section className="mt-10"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-primary">Recent reactions</h2><a href="/history" className="text-sm font-semibold text-primary underline">View all</a></div><div className="mt-4 space-y-3">{history.slice(0, 5).map((item) => <HistoryResultCard key={item.id} item={{ title: item.title, mode: item.mode, input: item.input, createdAt: item.createdAt.toISOString(), result: item.result }} />)}{history.length === 0 && <div className="border border-dashed border-border p-10 text-center text-muted-foreground">Your saved reactions will appear here after your first question.</div>}</div></section>
      </div>
    </main>
  )
}
