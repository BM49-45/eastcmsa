'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
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

// Storage key for localStorage
const STORAGE_KEY = 'community_messages'

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [editText, setEditText] = useState('')
  const [showAuthAlert, setShowAuthAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.email) {
      const adminEmails = ['admin@eastcmsa.com', 'bm49@example.com']
      setIsAdmin(adminEmails.includes(session.user.email) || (session.user as any).role === 'admin')
    }
  }, [session])

  // Load messages from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
          editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined
        }))
        setMessages(messagesWithDates)
      } else {
        // Load sample messages
        const sampleMessages: Message[] = [
          {
            id: '1',
            text: 'Karibu kwenye jumuiya ya EASTCMSA! Jisikie huru kuuliza maswali kuhusu Quran na Darsa.',
            userId: 'system',
            userName: 'Admin',
            createdAt: new Date(),
          },
          {
            id: '2',
            text: 'Darsa ya Fiqhi itakuwa Jumatatu saa 6:30 mchana. Karibu sana!',
            userId: 'system',
            userName: 'Admin',
            createdAt: new Date(Date.now() - 3600000),
          }
        ]
        setMessages(sampleMessages)
        saveMessages(sampleMessages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }, [])

  // Save messages to localStorage
  const saveMessages = (msgs: Message[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
    } catch (error) {
      console.error('Error saving messages:', error)
    }
  }

  // Auto-scroll to bottom
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

    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      userImage: session.user.image || undefined,
      createdAt: new Date(),
    }
    
    const updatedMessages = [...messages, newMsg]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setNewMessage('')
    setIsSending(false)
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    if (!isAdmin) {
      alert('Watumiaji wasio admin hawawezi kufuta ujumbe')
      return
    }

    if (!confirm('Je, una uhakika unataka kufuta ujumbe huu?')) return

    const updatedMessages = messages.filter(msg => msg.id !== messageId)
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
  }

  // Edit message
  const startEdit = (message: Message) => {
    if (session?.user?.id !== message.userId) {
      alert('Unaweza tu kuhariri ujumbe wako mwenyewe')
      return
    }
    setEditingMessage(message)
    setEditText(message.text)
  }

  const saveEdit = async () => {
    if (!editingMessage || !editText.trim()) return

    const updatedMessages = messages.map(msg => 
      msg.id === editingMessage.id 
        ? { ...msg, text: editText.trim(), editedAt: new Date() }
        : msg
    )
    
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
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
              <p className="font-semibold">Inahitaji Kujisajili</p>
              <p className="text-sm">Tafadhali ingia au jisajili kushiriki kwenye mazungumzo</p>
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Jumuiya ya Majadiliano
          </h1>
          <p className="text-gray-300 mt-2">
            {status === 'authenticated' 
              ? `Karibu, ${session.user.name}! Shiriki mawazo yako...` 
              : 'Ingia kushiriki kwenye majadiliano'}
          </p>
        </div>

        {/* Messages Container */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <User size={48} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p>Hakuna ujumbe bado. Kuwa wa kwanza kuanza mazungumzo!</p>
                {status !== 'authenticated' && (
                  <Link 
                    href="/login" 
                    className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 transition"
                  >
                    Ingia kuzungumza
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
                          placeholder="Hariri ujumbe wako..."
                          aria-label="Hariri ujumbe"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={saveEdit}
                            className="p-1 hover:bg-green-700 rounded transition"
                            title="Hifadhi mabadiliko"
                            aria-label="Hifadhi mabadiliko"
                          >
                            <Check size={16} aria-hidden="true" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 hover:bg-red-700 rounded transition"
                            title="Ghairi uhariri"
                            aria-label="Ghairi uhariri"
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
                        {message.editedAt && ' (imehaririwa)'}
                      </span>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        {session?.user?.id === message.userId && !editingMessage && (
                          <button
                            onClick={() => startEdit(message)}
                            className="opacity-50 hover:opacity-100 transition"
                            title="Hariri ujumbe"
                            aria-label="Hariri ujumbe"
                          >
                            <Edit2 size={12} aria-hidden="true" />
                          </button>
                        )}
                        {(isAdmin || session?.user?.id === message.userId) && !editingMessage && (
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="opacity-50 hover:opacity-100 transition hover:text-red-400"
                            title="Futa ujumbe"
                            aria-label="Futa ujumbe"
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
                    ? 'Andika ujumbe wako...'
                    : 'Ingia kushiriki kwenye mazungumzo'
                }
                disabled={status !== 'authenticated' || isSending}
                className="flex-1 bg-gray-800/50 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Ujumbe mpya"
                title="Andika ujumbe wako hapa"
              />
              <button
                type="submit"
                disabled={status !== 'authenticated' || !newMessage.trim() || isSending}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition"
                title="Tuma ujumbe"
                aria-label="Tuma ujumbe"
              >
                {isSending ? (
                  <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send size={20} aria-hidden="true" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Note about local storage */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Kumbuka: Ujumbe unahifadhiwa kwenye kifaa chako kwa sasa. Kwa ushirikiano wa watumiaji wote, tutaongeza database baadaye.
        </p>
      </div>
    </div>
  )
}