'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  IN_EXECUTION: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  DROPPED: 'bg-red-100 text-red-800',
}

export default function ProposalDetailPage() {
  const { id } = useParams()
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/proposals/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProposal(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!proposal || proposal.error) {
    return <div className="text-center py-20 text-gray-500">Proposal not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/board" className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block">
        ← Back to Board
      </Link>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">{proposal.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[proposal.status]}`}>
            {proposal.status.replace('_', ' ')}
          </span>
        </div>

        <p className="text-gray-700 mb-6">{proposal.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Submitted by</p>
            <p className="font-semibold">{proposal.submittedBy.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Assigned Lead</p>
            <p className="font-semibold">{proposal.assignedLead?.name || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Budget</p>
            <p className="font-semibold">{proposal.budget ? `₹${proposal.budget.toLocaleString()}` : '—'}</p>
          </div>
          <div>
            <p className="text-gray-500">Expected Completion</p>
            <p className="font-semibold">
              {proposal.expectedCompletion
                ? new Date(proposal.expectedCompletion).toLocaleDateString()
                : '—'}
            </p>
          </div>
        </div>

        {proposal.decisionSummary && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-1">EB Decision Summary</h3>
            <p className="text-blue-800 text-sm">{proposal.decisionSummary}</p>
          </div>
        )}
      </div>

      {/* Milestones */}
      {proposal.milestones.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">📌 Milestones</h2>
          <div className="space-y-2">
            {proposal.milestones.map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 text-sm">
                <span className={`text-lg ${m.completed ? 'text-green-500' : 'text-gray-300'}`}>
                  {m.completed ? '✅' : '⬜'}
                </span>
                <span className={m.completed ? 'line-through text-gray-400' : ''}>{m.title}</span>
                {m.dueDate && (
                  <span className="text-xs text-gray-400 ml-auto">
                    Due: {new Date(m.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision History */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">📜 Decision History</h2>
        {proposal.decisions.length === 0 ? (
          <p className="text-gray-400 text-sm">No decisions logged yet</p>
        ) : (
          <div className="space-y-3">
            {proposal.decisions.map((d: any) => (
              <div key={d.id} className="border-l-4 border-gray-300 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{d.action}</span>
                  <span className="text-xs text-gray-400">
                    by {d.madeBy.name} ({d.madeBy.role})
                  </span>
                </div>
                {d.note && <p className="text-sm text-gray-600">{d.note}</p>}
                <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Report Link */}
      {proposal.event && (
        <Link
          href={`/events/${proposal.event.id}`}
          className="block bg-green-50 border border-green-200 rounded-xl p-4 text-center hover:bg-green-100 transition"
        >
          📊 View Event Impact Report →
        </Link>
      )}
    </div>
  )
}