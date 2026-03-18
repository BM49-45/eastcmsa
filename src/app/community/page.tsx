'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, MessageCircle, Heart, Share2, UserPlus, 
  Calendar, MapPin, Award, Clock, ChevronRight,
  ThumbsUp, MessageSquare, Send, AlertCircle
} from 'lucide-react'

interface User {
  id: string
  name: string
  role: 'admin' | 'moderator' | 'member'
  avatar?: string
  joinedAt: string
  postsCount: number
  commentsCount: number
}

interface Post {
  id: string
  userId: string
  userName: string
  userRole: string
  content: string
  likes: number
  comments: number
  createdAt: string
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  // Fetch real data
  useEffect(() => {
    fetchCommunityData()
  }, [])

  const fetchCommunityData = async () => {
    setLoading(true)
    try {
      const [postsRes, membersRes] = await Promise.all([
        fetch('/api/community/posts'),
        fetch('/api/community/members')
      ])

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData)
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json()
        setMembers(membersData)
      }
    } catch (error) {
      console.error('Error fetching community data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    setPosting(true)
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost })
      })

      if (res.ok) {
        const newPostData = await res.json()
        setPosts([newPostData, ...posts])
        setNewPost('')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' })
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'sasa hivi'
    if (diffMins < 60) return `dakika ${diffMins} zilizopita`
    if (diffHours < 24) return `saa ${diffHours} zilizopita`
    if (diffDays < 7) return `siku ${diffDays} zilizopita`
    
    return date.toLocaleDateString('sw-TZ', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Inapakia jumuiya...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Jumuiya ya Waislamu EASTC</h1>
              <p className="text-green-100">Ungana na wanajumuiya wengine, shiriki mawazo na maswali</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <span className="font-bold">{members.length}</span> Wanachama
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <span className="font-bold">{posts.length}</span> Machapisho
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'feed'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Machapisho
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'members'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Wanachama
          </button>
        </div>

        {activeTab === 'feed' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Posts Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    W
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Andika chapisho lako..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim() || posting}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {posting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Inachapisha...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Chapisha
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts */}
              {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                  <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hakuna machapisho</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Kuwa wa kwanza kuchapisha kwenye jumuiya!
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                          {post.userName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{post.userName}</h3>
                          <p className="text-xs text-gray-500">
                            {post.userRole === 'admin' ? 'Msimamizi' : 
                             post.userRole === 'moderator' ? 'Mratibu' : 'Mwanachama'} • {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                    
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <ThumbsUp size={18} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">
                        <MessageSquare size={18} />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Members */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-4">Wanachama Walio na Shughuli</h3>
                {members.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Hakuna wanachama bado</p>
                ) : (
                  <div className="space-y-3">
                    {members.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-gray-500">
                            {member.role === 'admin' ? 'Msimamizi' : 
                             member.role === 'moderator' ? 'Mratibu' : 'Mwanachama'} • Machapisho {member.postsCount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Events - Real data would come from API */}
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
                <h3 className="font-bold mb-4">Matukio Yajayo</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="mt-1" />
                    <div>
                      <p className="font-medium">Darsa ya Tawhiid</p>
                      <p className="text-xs text-green-200">Jumamosi, Baada ya Maghrib</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="mt-1" />
                    <div>
                      <p className="font-medium">Muhadhara wa Semister</p>
                      <p className="text-xs text-green-200">Tarehe husika itawekwa, 09:00 asubuhi</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/events"
                  className="flex items-center justify-center gap-2 mt-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Tazama Ratiba Kamili
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Members Tab
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hakuna wanachama</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Wanachama wataonekana hapa watakapojisajili
                </p>
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-green-600">
                        {member.role === 'admin' ? 'Msimamizi' : 
                         member.role === 'moderator' ? 'Mratibu' : 'Mwanachama'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>Amejiunga {new Date(member.joinedAt).toLocaleDateString('sw-TZ', { month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={14} />
                      <span>Machapisho {member.postsCount}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 p-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2">
                    <UserPlus size={16} />
                    Fuata
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}