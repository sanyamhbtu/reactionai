'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function SessionNav() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  if (isPending) return <div className="h-9 w-24" aria-hidden="true" />
  if (!session?.user) return <a href="/sign-in" className="hidden text-sm font-semibold text-muted-foreground hover:text-primary sm:block">Sign in</a>
  async function logout() { await authClient.signOut(); router.refresh(); router.push('/') }
  return <div className="flex items-center gap-3"><a href="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-primary">Dashboard</a><button type="button" onClick={logout} className="hidden text-sm font-semibold text-muted-foreground hover:text-primary sm:block">Sign out</button></div>
}
