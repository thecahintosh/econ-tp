import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4">
        ECON <span className="text-yellow-500">Transparency</span> Portal
      </h1>
      <p className="text-xl text-gray-500 mb-2 italic">&quot;Where Ideas Don&apos;t Disappear.&quot;</p>
      <p className="text-gray-600 max-w-xl mb-8">
        Track every proposal from submission to completion. See who&apos;s responsible,
        what&apos;s been decided, and how events actually went.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/board"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          📋 View Proposal Board
        </Link>
        <Link
          href="/dashboard"
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          📊 See Dashboard
        </Link>
        <Link
          href="/events"
          className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          🎯 Event Reports
        </Link>
      </div>
    </div>
  )
}