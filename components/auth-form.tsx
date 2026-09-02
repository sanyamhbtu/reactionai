'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); const data = new FormData(event.currentTarget); const email = String(data.get('email')); const password = String(data.get('password')); const name = String(data.get('name') || 'Chemistry learner'); const result = mode === 'sign-in' ? await authClient.signIn.email({ email, password }) : await authClient.signUp.email({ email, password, name }); setBusy(false); if (result.error) { setError('We could not complete that request. Check your details and try again.'); return } router.push('/dashboard'); router.refresh() }
  return <form onSubmit={submit} className="space-y-4"><div>{mode === 'sign-up' && <label className="mb-2 block text-sm">Name<input name="name" required className="mt-1 w-full rounded-lg border bg-background px-3 py-2" /></label>}<label className="mb-2 block text-sm">Email<input name="email" type="email" required className="mt-1 w-full rounded-lg border bg-background px-3 py-2" /></label><label className="block text-sm">Password<input name="password" type="password" minLength={8} required className="mt-1 w-full rounded-lg border bg-background px-3 py-2" /></label></div>{error && <p className="text-sm text-destructive">{error}</p>}<button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">{busy ? 'Working…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button></form>
}
