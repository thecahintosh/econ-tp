import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const [total, byStatus, proposals, users] = await Promise.all([
    prisma.proposal.count(),
    prisma.proposal.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.proposal.findMany({
      select: { createdAt: true, updatedAt: true, status: true, budget: true },
    }),
    prisma.user.findMany({
      select: {
        name: true,
        _count: { select: { proposals: true } },
      },
      orderBy: { proposals: { _count: 'desc' } },
      take: 5,
    }),
  ])

  const statusCounts: Record<string, number> = {}
  byStatus.forEach((s) => {
    statusCounts[s.status] = s._count
  })

  const approved = (statusCounts['APPROVED'] || 0) + (statusCounts['IN_EXECUTION'] || 0) + (statusCounts['COMPLETED'] || 0)
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

  const completed = statusCounts['COMPLETED'] || 0
  const totalNonReview = total - (statusCounts['UNDER_REVIEW'] || 0)
  const executionRate = totalNonReview > 0 ? Math.round((completed / totalNonReview) * 100) : 0

  // Budget utilization
  const events = await prisma.event.findMany({
    include: { proposal: { select: { budget: true } } },
  })
  const totalBudget = events.reduce((sum, e) => sum + (e.proposal.budget || 0), 0)
  const totalSpent = events.reduce((sum, e) => sum + (e.budgetSpent || 0), 0)
  const budgetUtil = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  const topContributors = users.map((u) => ({
    name: u.name,
    count: u._count.proposals,
  }))

  return NextResponse.json({
    totalProposals: total,
    statusCounts,
    approvalRate,
    executionRate,
    budgetUtilization: budgetUtil,
    totalBudget,
    totalSpent,
    topContributors,
  })
}