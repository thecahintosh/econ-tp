'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const links = [
  { href: '/admin', label: '📋 All Proposals' },
  { href: '/admin/reports', label: '📊 Event Reports' },
  { href: '/admin/users', label: '👥 User Approvals' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">⚙️ Admin Panel</h1>
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
          EB + Core Only
        </span>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              pathname === link.href
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  )
}