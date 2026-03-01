'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((e: any) => e.id === id)
        setEvent(found)
        setLoading(false)
      })
  }, [id])

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    )

  if (!event) return <div className="text-center py-20 text-gray-500">Event not found</div>

  const budgetUsed =
    event.proposal.budget && event.budgetSpent
      ? Math.round((event.budgetSpent / event.proposal.budget) * 100)
      : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/events" className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block">
        ← Back to Events
      </Link>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-2">{event.proposal.title}</h1>
        <p className="text-sm text-gray-400 mb-6">
          Report created {new Date(event.createdAt).toLocaleDateString()}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{event.attendance || '—'}</p>
            <p className="text-xs text-gray-500 mt-1">Attendees</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {event.feedbackRating ? `${event.feedbackRating}⭐` : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Feedback</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">
              ₹{event.budgetSpent?.toLocaleString() || '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Spent</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {budgetUsed !== null ? `${budgetUsed}%` : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Budget Used</p>
          </div>
        </div>

        {/* Budget Bar */}
        {budgetUsed !== null && (
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-1">
              <span>Budget Utilization</span>
              <span>
                ₹{event.budgetSpent?.toLocaleString()} / ₹{event.proposal.budget?.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${budgetUsed > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Insights */}
        {event.insights && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">💡 Key Insights</h2>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{event.insights}</p>
          </div>
        )}

        {/* Learnings */}
        {event.learnings && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-2">📝 Learnings</h2>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{event.learnings}</p>
          </div>
        )}
      </div>
    </div>
  )
}