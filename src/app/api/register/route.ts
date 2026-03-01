import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Determine if approval is needed
    const requestedRole = role || 'MEMBER'
    const needsApproval = ['EB', 'CORE'].includes(requestedRole)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: needsApproval ? requestedRole : 'MEMBER',
        approved: !needsApproval, // false if EB/CORE, true otherwise
      },
    })

    if (needsApproval) {
      return NextResponse.json({
        message: 'Registration submitted. Awaiting admin approval.',
        needsApproval: true,
      })
    }

    return NextResponse.json({ message: 'Registered successfully' })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}