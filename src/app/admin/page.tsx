'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  IN_EXECUTION: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  DROPPED: 'bg-red-100 text-red-800',
}

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/proposals')
      .then((r) => r.json())
      .then((data) => {
        setProposals(data)
        setLoading(false)
      })
  }, [])

  const filtered = filter === 'ALL' ? proposals : proposals.filter((p) => p.status === filter)

  if (loading)
    return <div className="text-center py-10 text-gray-400">Loading proposals...</div>

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'UNDER_REVIEW', 'APPROVED', 'IN_EXECUTION', 'COMPLETED', 'DROPPED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.replace('_', ' ')} {s === 'ALL' ? `(${proposals.length})` : `(${proposals.filter((p) => p.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Proposal</th>
              <th className="text-left px-4 py-3 font-semibold">Submitted By</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Lead</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-left px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-gray-500">{p.submittedBy.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[p.status]}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.assignedLead?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/proposals/${p.id}`}
                    className="bg-gray-900 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}