'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitProposalPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    expectedCompletion: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/board')
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📝 Submit a Proposal</h1>

      {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Proposal Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Budget (₹)</label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Completion</label>
            <input
              type="date"
              value={form.expectedCompletion}
              onChange={(e) => setForm({ ...form, expectedCompletion: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Proposal'}
        </button>
      </form>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Your proposal will appear on the board with "Under Review" status</li>
          <li>The Executive Board will review and decide</li>
          <li>You'll be able to track the decision and progress publicly</li>
          <li>If approved, a lead will be assigned and milestones will be set</li>
        </ul>
      </div>
    </div>
  )
}