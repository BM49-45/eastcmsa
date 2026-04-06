'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Send, Trash2, Edit2, Check, X, Loader2, MessageCircle } from 'lucide-react'
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
  const [isAdmin, setIsAdmin] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check admin
  useEffect(() => {
    if (session?.user) {
      const adminEmails = ['admin@eastcmsa.com', 'bm49@eastcmsa.com']
      if (adminEmails.includes(session.user.email || '') || session.user.role === 'admin') {
        setIsAdmin(true)
      }
    }
  }, [session])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/community/messages')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setMessages(data)
      setError(null)
    } catch (err) {
      setError('Failed to load messages')
    } finally {
      setIsFetching(false)
    }
  }, [])

  // Load messages and poll every 2 seconds
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 2000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (status !== 'authenticated') {
      alert('Please login to send message')
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
      setError('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete message
  const handleDelete = async (messageId: string, messageUserId: string) => {
    const canDelete = isAdmin || session?.user?.id === messageUserId
    if (!canDelete) {
      alert('You can only delete your own messages')
      return
    }
    if (!confirm('Delete this message?')) return

    try {
      const res = await fetch(`/api/community/messages?id=${messageId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      await fetchMessages()
    } catch (err) {
      alert('Failed to delete message')
    }
  }

  // Edit message
  const startEdit = (message: Message) => {
    if (session?.user?.id !== message.userId) {
      alert('You can only edit your own messages')
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
      if (!res.ok) throw new Error('Failed')
      setEditingId(null)
      setEditText('')
      await fetchMessages()
    } catch (err) {
      alert('Failed to edit message')
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

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 py-3">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-xl font-bold text-white text-center">Community</h1>
          <p className="text-gray-400 text-center text-sm">
            {status === 'authenticated' 
              ? `Welcome, ${session.user.name}${isAdmin ? ' (Admin)' : ''}` 
              : 'Login to join'}
          </p>
        </div>
      </div>

      {/* Messages Container - Takes remaining space */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 text-red-400 text-sm text-center mb-4">
              {error}
              <button onClick={fetchMessages} className="ml-2 underline">Retry</button>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Be the first!</p>
              {status !== 'authenticated' && (
                <Link href="/login" className="inline-block mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                  Login to Chat
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isOwn = session?.user?.id === msg.userId
                const canDelete = isAdmin || isOwn
                
                return (
                  <div key={msg.id} className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    {/* Avatar - Left side for others */}
                    {!isOwn && (
                      <div className="flex-shrink-0">
                        {msg.userImage ? (
                          <Image src={msg.userImage} alt={msg.userName} width={32} height={32} className="rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{msg.userName?.charAt(0).toUpperCase() || 'U'}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`max-w-[70%] ${isOwn ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-100'} rounded-2xl px-3 py-2 shadow`}>
                      {!isOwn && (
                        <p className="text-xs font-semibold text-emerald-400 mb-0.5">
                          {msg.userName}
                        </p>
                      )}
                      
                      {editingId === msg.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            rows={2}
                            autoFocus
                            aria-label="Edit message text"
                            placeholder="Edit your message..."
                          />
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={saveEdit} 
                              className="p-1 hover:bg-green-700 rounded transition"
                              title="Save changes"
                              aria-label="Save changes"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={cancelEdit} 
                              className="p-1 hover:bg-red-700 rounded transition"
                              title="Cancel editing"
                              aria-label="Cancel editing"
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
                          {msg.isEdited && ' (edited)'}
                        </span>
                        
                        {/* Action Buttons */}
                        {!editingId && (
                          <div className="flex gap-1">
                            {isOwn && (
                              <button 
                                onClick={() => startEdit(msg)} 
                                className="opacity-50 hover:opacity-100 transition"
                                title="Edit message"
                                aria-label="Edit message"
                              >
                                <Edit2 size={10} />
                              </button>
                            )}
                            {canDelete && (
                              <button 
                                onClick={() => handleDelete(msg.id, msg.userId)} 
                                className="opacity-50 hover:opacity-100 hover:text-red-400 transition"
                                title="Delete message"
                                aria-label="Delete message"
                              >
                                <Trash2 size={10} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Avatar - Right side for own messages */}
                    {isOwn && (
                      <div className="flex-shrink-0">
                        {session?.user?.image ? (
                          <Image src={session.user.image} alt={session.user.name || 'User'} width={32} height={32} className="rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{session?.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className="flex-shrink-0 bg-gray-900 border-t border-gray-800 p-3">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <label htmlFor="message-input" className="sr-only">Message</label>
            <input
              id="message-input"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={status === 'authenticated' ? 'Type a message...' : 'Login to chat'}
              disabled={status !== 'authenticated'}
              className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              title="Type your message here"
              aria-label="Type your message here"
            />
            <button
              type="submit"
              disabled={status !== 'authenticated' || !newMessage.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white rounded-full px-5 py-2 transition"
              title="Send message"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}