import { prisma } from '@/lib/prisma'
import { getCurrentUser, isAdmin } from '@/lib/session'
import { NextResponse } from 'next/server'

// GET single proposal with all details
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: params.id },
    include: {
      submittedBy: { select: { id: true, name: true, email: true } },
      assignedLead: { select: { id: true, name: true, email: true } },
      milestones: { orderBy: { createdAt: 'asc' } },
      decisions: {
        include: { madeBy: { select: { name: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      },
      event: true,
    },
  })

  if (!proposal) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(proposal)
}

// PATCH — update proposal (admin only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { status, assignedLeadId, decisionSummary, decisionNote, budget, expectedCompletion } = body

  // Build update data
  const updateData: any = {}
  if (status) updateData.status = status
  if (assignedLeadId !== undefined) updateData.assignedLeadId = assignedLeadId || null
  if (decisionSummary !== undefined) updateData.decisionSummary = decisionSummary
  if (budget !== undefined) updateData.budget = budget ? parseFloat(budget) : null
  if (expectedCompletion !== undefined)
    updateData.expectedCompletion = expectedCompletion ? new Date(expectedCompletion) : null

  const proposal = await prisma.proposal.update({
    where: { id: params.id },
    data: updateData,
  })

  // Log decision if status changed or note provided
  if (status || decisionNote) {
    await prisma.decisionLog.create({
      data: {
        proposalId: params.id,
        action: status || 'UPDATED',
        note: decisionNote || `Status changed to ${status}`,
        madeById: user.id,
      },
    })
  }

  return NextResponse.json(proposal)
}