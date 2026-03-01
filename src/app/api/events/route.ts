import { prisma } from '@/lib/prisma'
import { getCurrentUser, isAdmin } from '@/lib/session'
import { NextResponse } from 'next/server'

// GET — all events
export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      proposal: {
        select: { id: true, title: true, budget: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(events)
}

// POST — create/update event report
export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { proposalId, attendance, budgetSpent, insights, learnings, feedbackRating, photos } =
    await req.json()

  const event = await prisma.event.upsert({
    where: { proposalId },
    update: {
      attendance: attendance ? parseInt(attendance) : null,
      budgetSpent: budgetSpent ? parseFloat(budgetSpent) : null,
      insights,
      learnings,
      feedbackRating: feedbackRating ? parseFloat(feedbackRating) : null,
      photos: photos || '[]',
    },
    create: {
      proposalId,
      attendance: attendance ? parseInt(attendance) : null,
      budgetSpent: budgetSpent ? parseFloat(budgetSpent) : null,
      insights,
      learnings,
      feedbackRating: feedbackRating ? parseFloat(feedbackRating) : null,
      photos: photos || '[]',
    },
  })

  return NextResponse.json(event)
}