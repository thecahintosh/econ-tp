'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function AdminEventReportPage() {
  const { id } = useParams() // This is the proposalId
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    attendance: '',
    budgetSpent: '',
    insights: '',
    learnings: '',
    feedbackRating: '',
  })

  useEffect(() => {
    fetch(`/api/proposals/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.event) {
          setForm({
            attendance: data.event.attendance?.toString() || '',
            budgetSpent: data.event.budgetSpent?.toString() || '',
            insights: data.event.insights || '',
            learnings: data.event.learnings || '',
            feedbackRating: data.event.feedbackRating?.toString() || '',
          })
        }
        setLoading(false)
      })
  }, [id])

  async function handleSave() {
    setSaving(true)
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId: id, ...form }),
    })
    setSaving(false)
    setMessage('✅ Report saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="text-sm text-gray-500 mb-4">
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-6">📊 Event Impact Report</h2>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-4">{message}</div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Attendance</label>
            <input
              type="number"
              value={form.attendance}
              onChange={(e) => setForm({ ...form, attendance: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget Spent (₹)</label>
            <input
              type="number"
              value={form.budgetSpent}
              onChange={(e) => setForm({ ...form, budgetSpent: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Feedback Rating (out of 5)</label>
          <input
            type="number"
            step="0.1"
            max="5"
            min="0"
            value={form.feedbackRating}
            onChange={(e) => setForm({ ...form, feedbackRating: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Key Insights</label>
          <textarea
            value={form.insights}
            onChange={(e) => setForm({ ...form, insights: e.target.value })}
            rows={4}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="What worked? What surprised you?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Learnings</label>
          <textarea
            value={form.learnings}
            onChange={(e) => setForm({ ...form, learnings: e.target.value })}
            rows={4}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="What would you do differently?"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Event Report'}
        </button>
      </div>
    </div>
  )
}