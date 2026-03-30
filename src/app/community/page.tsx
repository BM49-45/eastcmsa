'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { 
  getMessages, 
  addMessage, 
  updateMessage, 
  deleteMessage 
} from '@/lib/storage'
import { Send, Trash2, Edit2, Check, X, AlertCircle, User, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Message {
  id: string
  text: string
  userId: string
  userName: string
  userImage?: string
  createdAt: Date
  editedAt?: Date
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [editText, setEditText] = useState('')
  const [showAuthAlert, setShowAuthAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.email) {
      const adminEmails = ['admin@eastcmsa.com', 'your-email@example.com']
      setIsAdmin(adminEmails.includes(session.user.email))
    }
  }, [session])

  // Load messages
  useEffect(() => {
    const loadMessages = () => {
      const loaded = getMessages()
      setMessages(loaded)
    }
    
    loadMessages()
    
    // Listen for storage changes (if multiple tabs)
    const handleStorageChange = () => {
      loadMessages()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
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
    
    const newMsg = addMessage({
      text: newMessage.trim(),
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      userImage: session.user.image || undefined,
    })
    
    setMessages(prev => [...prev, newMsg])
    setNewMessage('')
    setIsLoading(false)
  }

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    if (!isAdmin) {
      alert('Only admins can delete messages')
      return
    }

    if (!confirm('Are you sure you want to delete this message?')) return

    deleteMessage(messageId)
    setMessages(prev => prev.filter(m => m.id !== messageId))
  }

  // Edit message
  const startEdit = (message: Message) => {
    if (session?.user?.id !== message.userId) {
      alert('You can only edit your own messages')
      return
    }
    setEditingMessage(message)
    setEditText(message.text)
  }

  const saveEdit = async () => {
    if (!editingMessage || !editText.trim()) return

    const updated = updateMessage(editingMessage.id, editText.trim())
    if (updated) {
      setMessages(prev => prev.map(m => m.id === updated.id ? updated : m))
    }
    setEditingMessage(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingMessage(null)
    setEditText('')
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatFullDate = (date: Date) => {
    return date.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Auth Alert */}
      {showAuthAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-amber-500/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-400">
            <AlertCircle size={20} aria-hidden="true" />
            <div>
              <p className="font-semibold">Registration Required</p>
              <p className="text-sm">Please sign up or log in to join the conversation</p>
            </div>
            <Link 
              href="/auth/signin" 
              className="ml-4 px-4 py-2 bg-white text-amber-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Community Discussion
          </h1>
          <p className="text-gray-300 mt-2">
            {status === 'authenticated' 
              ? `Welcome, ${session.user.name}! Share your thoughts...` 
              : 'Sign in to join the discussion'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Messages are saved locally in your browser
          </p>
        </div>

        {/* Messages Container */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <User size={48} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p>No messages yet. Be the first to start the conversation!</p>
                {status !== 'authenticated' && (
                  <Link 
                    href="/auth/signin" 
                    className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 transition"
                  >
                    Sign in to chat
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
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
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
                    } rounded-2xl px-4 py-2 shadow-lg`}
                  >
                    {session?.user?.id !== message.userId && (
                      <p className="text-xs font-semibold text-emerald-400 mb-1">
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
                          placeholder="Edit your message..."
                          aria-label="Edit message text"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={saveEdit}
                            className="p-1 hover:bg-green-700 rounded transition"
                            title="Save changes"
                            aria-label="Save edited message"
                          >
                            <Check size={16} aria-hidden="true" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 hover:bg-red-700 rounded transition"
                            title="Cancel editing"
                            aria-label="Cancel message edit"
                          >
                            <X size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm break-words">{message.text}</p>
                    )}
                    
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span 
                        className="text-[10px] opacity-70 cursor-help"
                        title={formatFullDate(message.createdAt)}
                      >
                        {formatTime(message.createdAt)}
                        {message.editedAt && ' (edited)'}
                      </span>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        {session?.user?.id === message.userId && !editingMessage && (
                          <button
                            onClick={() => startEdit(message)}
                            className="opacity-50 hover:opacity-100 transition"
                            title="Edit message"
                            aria-label="Edit this message"
                          >
                            <Edit2 size={12} aria-hidden="true" />
                          </button>
                        )}
                        {(isAdmin || session?.user?.id === message.userId) && !editingMessage && (
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="opacity-50 hover:opacity-100 transition hover:text-red-400"
                            title="Delete message"
                            aria-label="Delete this message"
                          >
                            <Trash2 size={12} aria-hidden="true" />
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
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
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
          <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  status === 'authenticated'
                    ? 'Type your message...'
                    : 'Sign in to join the conversation'
                }
                disabled={status !== 'authenticated'}
                className="flex-1 bg-gray-800/50 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="New message input"
                title="Type your message here"
              />
              <button
                type="submit"
                disabled={status !== 'authenticated' || !newMessage.trim() || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition"
                title="Send message"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send size={20} aria-hidden="true" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}