'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminReportsPage() {
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/proposals')
      .then((r) => r.json())
      .then((data) => {
        // Show completed proposals or those with events
        setProposals(data.filter((p: any) => p.status === 'COMPLETED'))
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Completed Proposals — Event Reports</h2>
      {proposals.length === 0 ? (
        <p className="text-gray-400">No completed proposals yet</p>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-400">by {p.submittedBy.name}</p>
              </div>
              <Link
                href={`/admin/reports/${p.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-500"
              >
                {p.event ? 'Edit Report' : 'Create Report'}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}