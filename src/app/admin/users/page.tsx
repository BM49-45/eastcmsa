"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  gender?: string
  location?: string
  role: string
  status: "active" | "inactive" | "blocked"
  isSubscribed: boolean
  createdAt: string
  lastLogin?: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/users")

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Failed to fetch users:", error)
      setError(error.message || "Imeshindwa kupakia watumiaji. Tafadhali jaribu tena.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      })

      const data = await res.json()

      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId))
        setShowDeleteModal(false)
        setUserToDelete(null)

        // If the deleted user is the current admin, log them out
        if (data.deletedUserEmail) {
          // You can handle session invalidation here
        }
      } else {
        throw new Error(data.error || "Failed to delete")
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
      setError("Imeshindwa kufuta mtumiaji. Tafadhali jaribu tena.")
    }
  }

  const handleBulkDelete = async () => {
    for (const userId of selectedUsers) {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
    }
    setUsers(users.filter(u => !selectedUsers.includes(u._id)))
    setSelectedUsers([])
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      })

      if (res.ok) {
        setUsers(users.map(u =>
          u._id === userId ? { ...u, role: newRole } : u
        ))
      }
    } catch (error) {
      console.error("Failed to update role:", error)
      setError("Imeshindwa kubadilisha nafasi. Tafadhali jaribu tena.")
    }
  }

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setUsers(users.map(u =>
          u._id === userId ? { ...u, status: newStatus } : u
        ))
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      setError("Imeshindwa kubadilisha hali. Tafadhali jaribu tena.")
    }
  }

  const handleSubscriptionToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSubscribed: !currentStatus })
      })

      if (res.ok) {
        setUsers(users.map(u =>
          u._id === userId ? { ...u, isSubscribed: !currentStatus } : u
        ))
      }
    } catch (error) {
      console.error("Failed to update subscription:", error)
      setError("Imeshindwa kubadilisha usajili. Tafadhali jaribu tena.")
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm))
  )

  const getGenderLabel = (gender: string) => {
    if (gender === 'male') return 'Me'
    if (gender === 'female') return 'Ke'
    return '-'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Inapakia watumiaji...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hitilafu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchUsers}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Jaribu Tena
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wasimamizi Watumiaji</h1>
            <p className="text-gray-600 mt-2">Tazama na usimamie watumiaji wote wa mfumo</p>
          </div>
          <div className="flex gap-3">
            {selectedUsers.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Futa Waliochaguliwa ({selectedUsers.length})
              </button>
            )}
            <Link
              href="/admin/users/add"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ongeza Mtumiaji
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tafuta kwa jina, barua pepe au simu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-600">Hakuna watumiaji waliopatikana</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 p-4">
                    <input
                      type="checkbox"
                      title="Chagua wote"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map(u => u._id))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                      checked={selectedUsers.length === users.length && users.length > 0}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Mtumiaji</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Mawasiliano</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Jinsia</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Nafasi</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Hali</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Anayejisajili</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Anayejiunga</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        title={`Chagua ${user.name}`}
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user._id])
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user._id))
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600">{user.phone || '-'}</p>
                      <p className="text-xs text-gray-400">{user.location || '-'}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{getGenderLabel(user.gender || '')}</span>
                    </td>
                    <td className="p-4">
                      <select
                        title="Chagua nafasi"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="user">Mtumiaji</option>
                        <option value="admin">Msimamizi</option>
                        <option value="moderator">Msimamizi</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        title="Chagua hali"
                        value={user.status}
                        onChange={(e) => handleStatusChange(user._id, e.target.value as User['status'])}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${user.status === 'active'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : user.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                      >
                        <option value="active">Amewezeshwa</option>
                        <option value="inactive">Haewezeshwi</option>
                        <option value="blocked">Amefungwa</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleSubscriptionToggle(user._id, user.isSubscribed)}
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${user.isSubscribed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {user.isSubscribed ? 'Amejiunga' : 'Hajajiunga'}
                      </button>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('sw')}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                          aria-label={`Hariri ${user.name}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setUserToDelete(user._id)
                            setShowDeleteModal(true)
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          aria-label={`Futa ${user.name}`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thibitisha Kufuta</h3>
              <p className="text-gray-600 mb-6">
                Je, una uhakika unataka kumfuta mtumiaji huyu? Kitendo hiki hakiwezi kutenduliwa.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setUserToDelete(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ghairi
                </button>
                <button
                  type="button"
                  onClick={() => userToDelete && handleDelete(userToDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Futa Mtumiaji
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}