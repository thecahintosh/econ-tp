'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        setEvents(data)
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🎯 Event Impact Reports</h1>

      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No event reports yet</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border"
            >
              <h2 className="text-lg font-bold mb-3">{event.proposal.title}</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{event.attendance || '—'}</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {event.feedbackRating ? `${event.feedbackRating}/5` : '—'}
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    ₹{event.budgetSpent?.toLocaleString() || '—'}
                  </p>
                  <p className="text-xs text-gray-500">Spent</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{event.proposal.budget?.toLocaleString() || '—'}
                  </p>
                  <p className="text-xs text-gray-500">Budgeted</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}