'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Proposal {
  id: string
  title: string
  status: string
  budget: number | null
  expectedCompletion: string | null
  createdAt: string
  submittedBy: { name: string }
  assignedLead: { name: string } | null
  milestones: { completed: boolean }[]
}

const COLUMNS = [
  { key: 'UNDER_REVIEW', label: '🟡 Under Review', color: 'border-yellow-400 bg-yellow-50' },
  { key: 'APPROVED', label: '🔵 Approved', color: 'border-blue-400 bg-blue-50' },
  { key: 'IN_EXECUTION', label: '🟠 In Execution', color: 'border-orange-400 bg-orange-50' },
  { key: 'COMPLETED', label: '🟢 Completed', color: 'border-green-400 bg-green-50' },
  { key: 'DROPPED', label: '🔴 Dropped', color: 'border-red-400 bg-red-50' },
]

export default function BoardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/proposals')
      .then((r) => r.json())
      .then((data) => {
        setProposals(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📋 Live Proposal Board</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const items = proposals.filter((p) => p.status === col.key)
          return (
            <div key={col.key} className={`border-t-4 rounded-lg p-3 min-h-[300px] ${col.color}`}>
              <h2 className="font-bold text-sm mb-3">
                {col.label}{' '}
                <span className="bg-white px-2 py-0.5 rounded-full text-xs">{items.length}</span>
              </h2>
              <div className="space-y-3">
                {items.map((p) => {
                  const completedMilestones = p.milestones.filter((m) => m.completed).length
                  const totalMilestones = p.milestones.length

                  return (
                    <Link
                      href={`/board/${p.id}`}
                      key={p.id}
                      className="block bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition border"
                    >
                      <h3 className="font-semibold text-sm mb-2">{p.title}</h3>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>👤 {p.submittedBy.name}</p>
                        {p.assignedLead && <p>🎯 Lead: {p.assignedLead.name}</p>}
                        {p.budget && <p>💰 ₹{p.budget.toLocaleString()}</p>}
                        {p.expectedCompletion && (
                          <p>📅 {new Date(p.expectedCompletion).toLocaleDateString()}</p>
                        )}
                        {totalMilestones > 0 && (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>
                                {completedMilestones}/{totalMilestones}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full"
                                style={{
                                  width: `${(completedMilestones / totalMilestones) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
                {items.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-8">No proposals</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}