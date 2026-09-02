import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { auth } from '@/lib/auth'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')
  return <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12"><section className="w-full rounded-2xl border bg-card p-8 shadow-sm"><p className="font-mono text-xs uppercase tracking-widest text-primary">ReactionAI</p><h1 className="mt-3 text-3xl font-bold">Welcome back</h1><p className="mt-2 text-muted-foreground">Save your chemistry work and revisit your routes.</p><div className="mt-8"><AuthForm mode="sign-in" /></div><p className="mt-6 text-center text-sm text-muted-foreground">New here? <Link className="text-primary underline" href="/sign-up">Create an account</Link></p></section></main>
}
