'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const role = (session?.user as any)?.role

  const isAdmin = role === 'ADMIN' || role === 'EB' || role === 'CORE'

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ⚡ ECON <span className="text-yellow-400">Portal</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/board" className="hover:text-yellow-400 transition">
            Proposal Board
          </Link>
          <Link href="/events" className="hover:text-yellow-400 transition">
            Events
          </Link>
          <Link href="/dashboard" className="hover:text-yellow-400 transition">
            Dashboard
          </Link>
          {session && (
            <Link href="/submit" className="hover:text-yellow-400 transition">
              Submit Proposal
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="bg-yellow-500 text-black px-3 py-1 rounded font-semibold hover:bg-yellow-400"
            >
              Admin
            </Link>
          )}
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs">
                {session.user?.name}{' '}
                <span className="bg-gray-700 px-2 py-0.5 rounded text-yellow-300">{role}</span>
              </span>
              <button
                onClick={() => signOut()}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hover:text-yellow-400">
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 text-sm">
          <Link href="/board" onClick={() => setMenuOpen(false)}>Proposal Board</Link>
          <Link href="/events" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          {session && <Link href="/submit" onClick={() => setMenuOpen(false)}>Submit Proposal</Link>}
          {isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
          {session ? (
            <button onClick={() => signOut()} className="text-red-400 text-left">Logout</button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}