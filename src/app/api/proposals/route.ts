import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// GET all proposals (public)
export async function GET() {
  const proposals = await prisma.proposal.findMany({
    include: {
      submittedBy: { select: { id: true, name: true } },
      assignedLead: { select: { id: true, name: true } },
      milestones: true,
      _count: { select: { decisions: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(proposals)
}

// POST new proposal (authenticated)
export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, description, budget, expectedCompletion } = await req.json()

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description required' }, { status: 400 })
  }

  const proposal = await prisma.proposal.create({
    data: {
      title,
      description,
      budget: budget ? parseFloat(budget) : null,
      expectedCompletion: expectedCompletion ? new Date(expectedCompletion) : null,
      submittedById: user.id,
      decisions: {
        create: {
          action: 'SUBMITTED',
          note: 'Proposal submitted for review',
          madeById: user.id,
        },
      },
    },
  })

  return NextResponse.json(proposal, { status: 201 })
}