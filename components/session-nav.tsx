'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function SessionNav() {
  const { data: userSession, isPending } = authClient.useSession()
  const router = useRouter()

  async function logout() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  if (isPending) return <div className="h-5 w-16" aria-hidden="true" />
  const user = userSession?.user
  if (!user) {
    return <a href="/sign-in" className="whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-primary">Sign in</a>
  }

  return <div className="flex items-center gap-3"><a href="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-primary">Dashboard</a><button type="button" onClick={logout} className="whitespace-nowrap text-sm font-semibold text-muted-foreground hover:text-primary">Sign out</button></div>
}
