import { prisma } from '@/lib/prisma'
import { getCurrentUser, isAdmin } from '@/lib/session'
import { NextResponse } from 'next/server'

// POST — add milestone
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { title, dueDate } = await req.json()

  const milestone = await prisma.milestone.create({
    data: {
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      proposalId: params.id,
    },
  })

  return NextResponse.json(milestone, { status: 201 })
}

// PATCH — toggle milestone completion
export async function PATCH(req: Request) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { milestoneId, completed } = await req.json()

  const milestone = await prisma.milestone.update({
    where: { id: milestoneId },
    data: { completed },
  })

  return NextResponse.json(milestone)
}