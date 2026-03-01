'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
export default function AdminManageProposal() {
  const { id } = useParams()
  const router = useRouter()
  const [proposal, setProposal] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Form state
  const [status, setStatus] = useState('')
  const [assignedLeadId, setAssignedLeadId] = useState('')
  const [decisionSummary, setDecisionSummary] = useState('')
  const [decisionNote, setDecisionNote] = useState('')
  const [budget, setBudget] = useState('')
  const [expectedCompletion, setExpectedCompletion] = useState('')

  // Milestone form
  const [newMilestone, setNewMilestone] = useState('')
  const [milestoneDue, setMilestoneDue] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`/api/proposals/${id}`).then((r) => r.json()),
      fetch('/api/users').then((r) => r.json()),
    ]).then(([proposalData, usersData]) => {
      setProposal(proposalData)
      setUsers(usersData)
      setStatus(proposalData.status)
      setAssignedLeadId(proposalData.assignedLeadId || '')
      setDecisionSummary(proposalData.decisionSummary || '')
      setBudget(proposalData.budget?.toString() || '')
      setExpectedCompletion(
        proposalData.expectedCompletion
          ? new Date(proposalData.expectedCompletion).toISOString().split('T')[0]
          : ''
      )
      setLoading(false)
    })
  }, [id])

  async function handleSave() {
    setSaving(true)
    setMessage('')

    await fetch(`/api/proposals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        assignedLeadId,
        decisionSummary,
        decisionNote,
        budget,
        expectedCompletion,
      }),
    })

    // Refresh proposal data
    const updated = await fetch(`/api/proposals/${id}`).then((r) => r.json())
    setProposal(updated)
    setDecisionNote('')
    setSaving(false)
    setMessage('✅ Saved successfully')
    setTimeout(() => setMessage(''), 3000)
  }

  async function addMilestone() {
    if (!newMilestone.trim()) return

    await fetch(`/api/proposals/${id}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newMilestone, dueDate: milestoneDue || null }),
    })

    const updated = await fetch(`/api/proposals/${id}`).then((r) => r.json())
    setProposal(updated)
    setNewMilestone('')
    setMilestoneDue('')
  }

  async function toggleMilestone(milestoneId: string, completed: boolean) {
    await fetch(`/api/proposals/${id}/milestones`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneId, completed: !completed }),
    })

    const updated = await fetch(`/api/proposals/${id}`).then((r) => r.json())
    setProposal(updated)
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.push('/admin')}
        className="text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        ← Back to Admin
      </button>

      <h2 className="text-xl font-bold mb-6">{proposal.title}</h2>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-4">{message}</div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Update Form */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h3 className="font-bold text-lg">Update Proposal</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_EXECUTION">In Execution</option>
              <option value="COMPLETED">Completed</option>
              <option value="DROPPED">Dropped</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assign Lead</label>
            <select
              value={assignedLeadId}
              onChange={(e) => setAssignedLeadId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">— Unassigned —</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expected Completion</label>
            <input
              type="date"
              value={expectedCompletion}
              onChange={(e) => setExpectedCompletion(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">EB Decision Summary</label>
            <textarea
              value={decisionSummary}
              onChange={(e) => setDecisionSummary(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Decision Note <span className="text-gray-400">(logged in history)</span>
            </label>
            <input
              type="text"
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="e.g., Approved after budget revision"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Right: Milestones + Decision Log */}
        <div className="space-y-6">
          {/* Milestones */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">📌 Milestones</h3>

            <div className="space-y-2 mb-4">
              {proposal.milestones.map((m: any) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                  onClick={() => toggleMilestone(m.id, m.completed)}
                >
                  <span className="text-lg">{m.completed ? '✅' : '⬜'}</span>
                  <span className={m.completed ? 'line-through text-gray-400' : ''}>
                    {m.title}
                  </span>
                </div>
              ))}
              {proposal.milestones.length === 0 && (
                <p className="text-gray-400 text-sm">No milestones yet</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                placeholder="New milestone..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={milestoneDue}
                onChange={(e) => setMilestoneDue(e.target.value)}
                className="border rounded-lg px-2 py-2 text-sm"
              />
              <button
                onClick={addMilestone}
                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-500"
              >
                Add
              </button>
            </div>
          </div>

          {/* Decision History */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">📜 Decision Log</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {proposal.decisions.map((d: any) => (
                <div key={d.id} className="border-l-4 border-gray-300 pl-3 py-1">
                  <p className="font-semibold text-sm">
                    {d.action}{' '}
                    <span className="font-normal text-gray-400">
                      by {d.madeBy.name}
                    </span>
                  </p>
                  {d.note && <p className="text-sm text-gray-600">{d.note}</p>}
                  <p className="text-xs text-gray-400">
                    {new Date(d.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick link to create event report */}
          {(status === 'COMPLETED' || proposal.status === 'COMPLETED') && (
            <Link
              href={`/admin/reports/${id}`}
              className="block bg-green-50 border border-green-300 rounded-xl p-4 text-center text-green-700 font-semibold hover:bg-green-100"
            >
              📊 Create / Edit Event Report
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}