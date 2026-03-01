'use client'

import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    )

  const sc = stats.statusCounts

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📊 Transparency Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Proposals" value={stats.totalProposals} color="blue" />
        <StatCard label="Approval Rate" value={`${stats.approvalRate}%`} color="green" />
        <StatCard label="Execution Success" value={`${stats.executionRate}%`} color="orange" />
        <StatCard label="Budget Utilization" value={`${stats.budgetUtilization}%`} color="purple" />
      </div>

      {/* Status Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            <StatusBar label="🟡 Under Review" count={sc.UNDER_REVIEW || 0} total={stats.totalProposals} color="bg-yellow-400" />
            <StatusBar label="🔵 Approved" count={sc.APPROVED || 0} total={stats.totalProposals} color="bg-blue-400" />
            <StatusBar label="🟠 In Execution" count={sc.IN_EXECUTION || 0} total={stats.totalProposals} color="bg-orange-400" />
            <StatusBar label="🟢 Completed" count={sc.COMPLETED || 0} total={stats.totalProposals} color="bg-green-400" />
            <StatusBar label="🔴 Dropped" count={sc.DROPPED || 0} total={stats.totalProposals} color="bg-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">🏆 Most Active Contributors</h2>
          {stats.topContributors.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.topContributors.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '👤'}
                    </span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                    {c.count} proposals
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Budget Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="font-bold text-lg mb-4">💰 Budget Summary</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalBudget?.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Allocated</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">₹{stats.totalSpent?.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{stats.budgetUtilization}%</p>
            <p className="text-sm text-gray-500">Utilization</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  }

  return (
    <div className={`rounded-xl p-5 ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1 opacity-75">{label}</p>
    </div>
  )
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-semibold">{count}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}