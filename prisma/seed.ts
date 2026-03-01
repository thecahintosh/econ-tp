import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10)
  const memberHash = await bcrypt.hash('member123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@econ.org' },
    update: {},
    create: {
      name: 'ECON Admin',
      email: 'admin@econ.org',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  })
  
  const eb = await prisma.user.upsert({
    where: { email: 'eb@econ.org' },
    update: {},
    create: {
      name: 'EB Member',
      email: 'eb@econ.org',
      passwordHash: adminHash,
      role: 'EB',
    },
  })
  
  const member = await prisma.user.upsert({
    where: { email: 'member@econ.org' },
    update: {},
    create: {
      name: 'Regular Member',
      email: 'member@econ.org',
      passwordHash: memberHash,
      role: 'MEMBER',
    },
  })

  // Sample proposals
  await prisma.proposal.create({
    data: {
      title: 'Weekly Economics Quiz Night',
      description: 'A fun weekly quiz covering micro, macro, and current economic affairs.',
      status: 'APPROVED',
      budget: 500,
      submittedById: member.id,
      assignedLeadId: eb.id,
      expectedCompletion: new Date('2025-03-30'),
      decisionSummary: 'Approved unanimously. Budget allocated from events fund.',
      milestones: {
        create: [
          { title: 'Prepare question bank', completed: true },
          { title: 'Book venue', completed: true },
          { title: 'Run pilot session', completed: false },
        ],
      },
      decisions: {
        create: [
          { action: 'SUBMITTED', note: 'Initial submission', madeById: member.id },
          { action: 'APPROVED', note: 'Great idea, approved with full budget', madeById: eb.id },
        ],
      },
    },
  })

  await prisma.proposal.create({
    data: {
      title: 'ECON Newsletter Launch',
      description: 'Monthly newsletter covering club activities and economic insights.',
      status: 'UNDER_REVIEW',
      submittedById: member.id,
    },
  })

  await prisma.proposal.create({
    data: {
      title: 'Guest Speaker: Central Bank Policy',
      description: 'Invite a central bank economist for a talk on monetary policy.',
      status: 'COMPLETED',
      budget: 2000,
      submittedById: eb.id,
      assignedLeadId: eb.id,
      decisionSummary: 'Approved. Speaker confirmed.',
      event: {
        create: {
          attendance: 85,
          budgetSpent: 1800,
          insights: 'Students showed high interest in monetary policy careers.',
          learnings: 'Book speakers 3 weeks in advance minimum.',
          feedbackRating: 4.6,
          photos: '[]',
        },
      },
    },
  })

  await prisma.proposal.create({
    data: {
      title: 'Stock Market Simulation',
      description: 'Virtual stock trading competition over 2 weeks.',
      status: 'DROPPED',
      submittedById: member.id,
      decisionSummary: 'Dropped due to lack of platform budget.',
    },
  })

  console.log('Seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())