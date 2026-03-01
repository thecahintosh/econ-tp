'use client'

import { useEffect, useState } from 'react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  function loadUsers() {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
  }

  async function toggleApproval(userId: string, currentStatus: boolean) {
    await fetch('/api/users/approve', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, approved: !currentStatus }),
    })
    loadUsers()
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>

  const pendingUsers = users.filter((u) => !u.approved)
  const approvedUsers = users.filter((u) => u.approved)

  return (
    <div>
      {/* Pending Approvals */}
      {pendingUsers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-orange-600">⏳ Pending Approvals</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-orange-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 font-semibold">Registered</th>
                  <th className="text-left px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleApproval(u.id, u.approved)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-500"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Users */}
      <h2 className="text-lg font-bold mb-4">👥 All Users</h2>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-left px-4 py-3 font-semibold">Role</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {approvedUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-green-600 text-xs">✓ Approved</span>
                </td>
                <td className="px-4 py-3">
                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => toggleApproval(u.id, u.approved)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}