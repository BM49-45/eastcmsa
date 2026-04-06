'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Send, Trash2, Edit2, Check, X, AlertCircle, User, Loader2, MessageCircle, Lock, Globe } from 'lucide-react'
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
  isDeleted?: boolean
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [editText, setEditText] = useState('')
  const [showAuthAlert, setShowAuthAlert] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.email) {
      const adminEmails = ['admin@eastcmsa.com', 'bm49@eastcmsa.com']
      setIsAdmin(adminEmails.includes(session.user.email))
    }
  }, [session])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/community/messages')
      if (!res.ok) throw new Error('Failed to fetch messages')
      const data = await res.json()
      setMessages(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Imeshindwa kupakia ujumbe. Jaribu tena.')
    } finally {
      setIsFetching(false)
    }
  }, [])

  // Initial fetch and polling every 2 seconds
  useEffect(() => {
    fetchMessages()
    
    const interval = setInterval(() => {
      fetchMessages()
    }, 2000)
    
    return () => clearInterval(interval)
  }, [fetchMessages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (status !== 'authenticated') {
      setShowAuthAlert(true)
      setTimeout(() => setShowAuthAlert(false), 3000)
      return
    }

    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/community/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage.trim() })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to send')
      }

      setNewMessage('')
      await fetchMessages() // Refresh immediately
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Imeshindwa kutuma ujumbe. Jaribu tena.')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    if (!isAdmin) {
      alert('Watumiaji pekee ndio wanaweza kufuta ujumbe.')
      return
    }

    if (!confirm('Je, una uhakika unataka kufuta ujumbe huu?')) return

    try {
      const res = await fetch(`/api/community/messages?id=${messageId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')
      
      await fetchMessages()
    } catch (err) {
      console.error('Error deleting message:', err)
      alert('Imeshindwa kufuta ujumbe. Jaribu tena.')
    }
  }

  // Edit message
  const startEdit = (message: Message) => {
    if (session?.user?.id !== message.userId) {
      alert('Unaweza tu kuhariri ujumbe wako mwenyewe.')
      return
    }
    setEditingMessage(message)
    setEditText(message.text)
  }

  const saveEdit = async () => {
    if (!editingMessage || !editText.trim()) return

    try {
      const res = await fetch('/api/community/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: editingMessage.id,
          text: editText.trim()
        })
      })

      if (!res.ok) throw new Error('Failed to edit')
      
      setEditingMessage(null)
      setEditText('')
      await fetchMessages()
    } catch (err) {
      console.error('Error editing message:', err)
      alert('Imeshindwa kuhariri ujumbe. Jaribu tena.')
    }
  }

  const cancelEdit = () => {
    setEditingMessage(null)
    setEditText('')
  }

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 size={48} className="text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Inapakia jumuiya...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      {/* Auth Alert */}
      {showAuthAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-amber-500/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-400">
            <AlertCircle size={20} aria-hidden="true" />
            <div>
              <p className="font-semibold">Inahitaji Kujisajili</p>
              <p className="text-sm">Tafadhali ingia au jisajili ili kushiriki kwenye jumuiya</p>
            </div>
            <Link 
              href="/login" 
              className="ml-4 px-4 py-2 bg-white text-amber-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
            >
              Ingia
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Jumuiya ya EASTCMSA
          </h1>
          <p className="text-gray-300 mt-1 text-sm">
            {status === 'authenticated' 
              ? `Karibu, ${session.user.name}!` 
              : 'Ingia ili kushiriki kwenye majadiliano'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
            {error}
            <button onClick={fetchMessages} className="ml-3 underline hover:text-red-200">
              Jaribu Tena
            </button>
          </div>
        )}

        {/* Messages Container */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4" ref={containerRef}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <MessageCircle size={48} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p>Hakuna ujumbe bado. Kuwa wa kwanza kuanza mazungumzo!</p>
                {status !== 'authenticated' && (
                  <Link 
                    href="/login" 
                    className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 transition"
                  >
                    Ingia ili kuchat
                  </Link>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    session?.user?.id === message.userId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Avatar for other users */}
                  {session?.user?.id !== message.userId && (
                    <div className="flex-shrink-0">
                      {message.userImage ? (
                        <Image
                          src={message.userImage}
                          alt={message.userName}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {message.userName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[70%] ${
                      session?.user?.id === message.userId
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-800/80 text-gray-100'
                    } rounded-2xl px-3 py-2 shadow-lg`}
                  >
                    {session?.user?.id !== message.userId && (
                      <p className="text-xs font-semibold text-emerald-400 mb-0.5">
                        {message.userName}
                      </p>
                    )}
                    
                    {editingMessage?.id === message.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      <p className="text-sm break-words">{message.text}</p>
                    )}
                    
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className="text-[10px] opacity-70">
                        {formatTime(message.createdAt)}
                        {message.isEdited && ' (imehaririwa)'}
                      </span>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        {session?.user?.id === message.userId && !editingMessage && (
                          <button
                            onClick={() => startEdit(message)}
                            className="opacity-50 hover:opacity-100 transition"
                            title="Hariri"
                          >
                            <Edit2 size={10} />
                          </button>
                        )}
                        {isAdmin && !editingMessage && (
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="opacity-50 hover:opacity-100 transition hover:text-red-400"
                            title="Futa"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Avatar for current user */}
                  {session?.user?.id === message.userId && (
                    <div className="flex-shrink-0">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  status === 'authenticated'
                    ? 'Andika ujumbe wako...'
                    : 'Ingia ili kushiriki...'
                }
                disabled={status !== 'authenticated'}
                className="flex-1 bg-gray-800/50 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={status !== 'authenticated' || !newMessage.trim() || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition"
                title="Tuma ujumbe"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}