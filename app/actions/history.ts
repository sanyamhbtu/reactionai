'use server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { reactionHistory } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}
export async function saveReaction(input: { title: string; mode: string; query: string; result: unknown }) {
  const userId = await getUserId()
  await db.insert(reactionHistory).values({ userId, title: input.title.slice(0, 160), mode: input.mode, input: input.query.slice(0, 4000), result: input.result as Record<string, unknown> })
}
export async function getReactionHistory() {
  const userId = await getUserId()
  return db.select().from(reactionHistory).where(eq(reactionHistory.userId, userId)).orderBy(desc(reactionHistory.createdAt)).limit(30)
}
