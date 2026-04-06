'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Send, Trash2, Edit2, Check, X, Loader2, MessageCircle, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Message {
  id: string
  text: string
  userId: string
  userName: string
  userImage?: string | null
  createdAt: string
  editedAt?: string | null
  isEdited?: boolean
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Check if user is admin
  const isAdmin = session?.user?.email === 'admin@eastcmsa.com' || session?.user?.role === 'admin'

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/community/messages')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setMessages(data)
      setError(null)
    } catch (err) {
      setError('Imeshindwa kupakia ujumbe')
    } finally {
      setIsFetching(false)
    }
  }, [])

  // Load messages and poll every 3 seconds
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status !== 'authenticated') {
      alert('Tafadhali ingia ili kutuma ujumbe')
      return
    }

    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/community/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage.trim() })
      })
      if (!res.ok) throw new Error('Failed')
      setNewMessage('')
      await fetchMessages()
    } catch (err) {
      setError('Imeshindwa kutuma ujumbe')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete - Admin au mwenyewe
  const handleDelete = async (messageId: string, messageUserId: string) => {
    // Kama si admin na si mwenyewe - kataa
    if (!isAdmin && session?.user?.id !== messageUserId) {
      alert('Unaweza kufuta ujumbe wako tu!')
      return
    }

    const confirmMessage = isAdmin && session?.user?.id !== messageUserId
      ? 'Kama admin, utafuta ujumbe wa mtumiaji mwingine. Endelea?'
      : 'Futa ujumbe huu?'

    if (!confirm(confirmMessage)) return

    try {
      const res = await fetch(`/api/community/messages?id=${messageId}`, { method: 'DELETE' })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed')
      }
      await fetchMessages()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Imeshindwa kufuta ujumbe')
    }
  }

  // Edit - Mwenyewe tu
  const startEdit = (message: Message) => {
    if (session?.user?.id !== message.userId) {
      alert('Unaweza kuhariri ujumbe wako tu!')
      return
    }
    setEditingId(message.id)
    setEditText(message.text)
  }

  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return

    try {
      const res = await fetch('/api/community/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: editingId, text: editText.trim() })
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed')
      }
      setEditingId(null)
      setEditText('')
      await fetchMessages()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Imeshindwa kuhariri ujumbe')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  const handleImageError = (userId: string) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }))
  }

  const getUserInitial = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U'
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-xl font-bold text-white text-center">Jumuiya</h1>
          <p className="text-gray-400 text-center text-sm">
            {status === 'authenticated'
              ? `Karibu, ${session.user.name}${isAdmin ? ' (Msimamizi)' : ''}`
              : 'Ingia ili uhusike'}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-2">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 text-red-400 text-sm text-center">
            {error}
            <button onClick={fetchMessages} className="ml-2 underline">Jaribu tena</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-4 pb-32">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Hakuna ujumbe bado. Kuwa wa kwanza!</p>
            {status !== 'authenticated' && (
              <Link href="/login" className="inline-block mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                Ingia kuzungumza
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isOwn = session?.user?.id === msg.userId
              const showImageError = imageErrors[msg.userId]
              const canDelete = isAdmin || isOwn
              const canEdit = isOwn

              return (
                <div key={msg.id} className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  {/* Avatar - Left side for others */}
                  {!isOwn && (
                    <div className="flex-shrink-0">
                      {msg.userImage && !showImageError ? (
                        <Image
                          src={msg.userImage}
                          alt={msg.userName}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          onError={() => handleImageError(msg.userId)}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{getUserInitial(msg.userName)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[70%] ${isOwn ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-100'} rounded-2xl px-3 py-2 shadow`}>
                    {!isOwn && (
                      <div className="flex items-center gap-1 mb-0.5">
                        <p className="text-xs font-semibold text-emerald-400">{msg.userName}</p>
                        {/* Ikiwa mtumiaji ni admin (angalia email) - tumia isAdmin kulinganisha na email */}
                        {msg.userId === session?.user?.id && isAdmin && (
                          <Shield size={10} className="text-emerald-400" />
                        )}
                      </div>
                    )}

                    {editingId === msg.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-gray-700 text-white rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          rows={2}
                          autoFocus
                          placeholder="Hariri ujumbe wako..."
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={saveEdit}
                            className="p-1 hover:bg-green-700 rounded transition"
                            title="Hifadhi"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 hover:bg-red-700 rounded transition"
                            title="Ghairi"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm break-words">{msg.text}</p>
                    )}

                    <div className="flex items-center justify-end gap-2 mt-0.5">
                      <span className="text-[10px] opacity-70">
                        {formatTime(msg.createdAt)}
                        {msg.isEdited && ' (imehaririwa)'}
                      </span>

                      {/* Action Buttons */}
                      {!editingId && (
                        <div className="flex gap-1">
                          {/* Edit - Only message owner */}
                          {canEdit && (
                            <button
                              onClick={() => startEdit(msg)}
                              className="opacity-50 hover:opacity-100 transition"
                              title="Hariri ujumbe wako"
                            >
                              <Edit2 size={12} />
                            </button>
                          )}
                          
                          {/* Delete - Admin OR owner */}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(msg.id, msg.userId)}
                              className="opacity-50 hover:opacity-100 hover:text-red-400 transition"
                              title={isOwn ? "Futa ujumbe wako" : "Futa ujumbe (Msimamizi)"}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Avatar - Right side for own messages */}
                  {isOwn && (
                    <div className="flex-shrink-0">
                      {session?.user?.image && !imageErrors['current'] ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          onError={() => handleImageError('current')}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{getUserInitial(session?.user?.name || 'U')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Fixed Input at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={status === 'authenticated' ? 'Andika ujumbe...' : 'Ingia kuzungumza'}
              disabled={status !== 'authenticated'}
              className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status !== 'authenticated' || !newMessage.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white rounded-full px-5 py-2 transition"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}