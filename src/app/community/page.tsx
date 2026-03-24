'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Users, MessageCircle, Heart, Share2, UserPlus, 
  Calendar, Clock, ThumbsUp, MessageSquare, Send, Trash2, Edit,
  MoreVertical, Flag, Reply, Eye, Award, Sparkles
} from 'lucide-react'

interface Post {
  _id: string
  userId: string
  userName: string
  userRole: string
  userImage?: string
  content: string
  reactions: { [key: string]: string }
  reactionCounts: { [key: string]: number }
  comments: Comment[]
  commentCount: number
  createdAt: string
  edited?: boolean
  editedAt?: string
}

interface Comment {
  _id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

interface Member {
  _id: string
  name: string
  role: string
  image?: string
  joinedAt: string
  postsCount: number
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'feed' | 'members'>('feed')
  const [posts, setPosts] = useState<Post[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [userReactions, setUserReactions] = useState<{ [key: string]: string }>({})

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
        if (session) {
          const reactions: { [key: string]: string } = {}
          postsData.forEach((post: Post) => {
            if (post.reactions && post.reactions[session.user.id]) {
              reactions[post._id] = post.reactions[session.user.id]
            }
          })
          setUserReactions(reactions)
        }
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

  const handleReaction = async (postId: string, type: string) => {
    if (!session) return
    try {
      const res = await fetch(`/api/community/posts/${postId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      if (res.ok) {
        const data = await res.json()
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return { ...post, reactionCounts: data.reactions }
          }
          return post
        }))
        if (userReactions[postId] === type) {
          const newReactions = { ...userReactions }
          delete newReactions[postId]
          setUserReactions(newReactions)
        } else {
          setUserReactions({ ...userReactions, [postId]: type })
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Je, una uhakika unataka kufuta chapisho hili?')) return
    try {
      const res = await fetch(`/api/community/posts/${postId}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(posts.filter(p => p._id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleEditPost = async (postId: string) => {
    if (!editContent.trim()) return
    try {
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })
      if (res.ok) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, content: editContent, edited: true, editedAt: new Date().toISOString() }
            : post
        ))
        setEditingPost(null)
        setEditContent('')
      }
    } catch (error) {
      console.error('Error editing post:', error)
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
    return date.toLocaleDateString('sw-TZ', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Inapakia jumuiya...</p>
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
            <div className="p-3 bg-white/20 rounded-xl"><Users size={32} /></div>
            <div><h1 className="text-3xl font-bold">Jumuiya ya Waislamu EASTC</h1><p className="text-green-100">Ungana na wanajumuiya wengine, shiriki mawazo na maswali</p></div>
          </div>
          <div className="flex gap-4"><div className="bg-white/10 px-4 py-2 rounded-full text-sm"><span className="font-bold">{members.length}</span> Wanachama</div><div className="bg-white/10 px-4 py-2 rounded-full text-sm"><span className="font-bold">{posts.length}</span> Machapisho</div></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('feed')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'feed' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Machapisho</button>
          <button onClick={() => setActiveTab('members')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'members' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Wanachama</button>
        </div>

        {activeTab === 'feed' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              {session && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <label htmlFor="newPost" className="sr-only">Chapisho jipya</label>
                      <textarea
                        id="newPost"
                        placeholder="Andika chapisho lako..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={3}
                        aria-label="Chapisho jipya"
                        title="Andika chapisho lako hapa"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleCreatePost}
                          disabled={!newPost.trim() || posting}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                          aria-label="Chapisha ujumbe"
                          title="Chapisha ujumbe"
                        >
                          {posting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={16} />} Chapisha
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Posts */}
              {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border"><MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">Hakuna machapisho. Kuwa wa kwanza kuchapisha!</p></div>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                          {post.userName?.charAt(0) || 'U'}
                        </div>
                        <div><h3 className="font-bold">{post.userName}</h3><p className="text-xs text-gray-500">{post.userRole === 'admin' ? 'Msimamizi' : 'Mwanachama'} • {formatDate(post.createdAt)}</p></div>
                      </div>
                      {session?.user?.role === 'admin' && (
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingPost(post._id); setEditContent(post.content) }} className="p-1 text-gray-500 hover:text-blue-600" title="Hariri" aria-label="Hariri chapisho"><Edit size={16} /></button>
                          <button onClick={() => handleDeletePost(post._id)} className="p-1 text-gray-500 hover:text-red-600" title="Futa" aria-label="Futa chapisho"><Trash2 size={16} /></button>
                        </div>
                      )}
                    </div>

                    {editingPost === post._id ? (
                      <div className="mb-4">
                        <label htmlFor={`edit-${post._id}`} className="sr-only">Hariri chapisho</label>
                        <textarea
                          id={`edit-${post._id}`}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-3 border rounded-lg"
                          rows={3}
                          aria-label="Hariri chapisho"
                          title="Hariri maudhui ya chapisho"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setEditingPost(null)} className="px-3 py-1 border rounded-lg" aria-label="Ghairi">Ghairi</button>
                          <button onClick={() => handleEditPost(post._id)} className="px-3 py-1 bg-green-600 text-white rounded-lg" aria-label="Hifadhi mabadiliko">Hifadhi</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}{post.edited && <span className="text-xs text-gray-400 ml-2">(imehaririwa)</span>}</p>
                    )}

                    {/* Reactions */}
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <button onClick={() => handleReaction(post._id, 'like')} className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${userReactions[post._id] === 'like' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`} aria-label="Penda" title="Penda chapisho">
                        <ThumbsUp size={16} /> {post.reactionCounts?.like || 0}
                      </button>
                      <button onClick={() => handleReaction(post._id, 'love')} className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${userReactions[post._id] === 'love' ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`} aria-label="Penda sana" title="Penda sana chapisho">
                        <Heart size={16} /> {post.reactionCounts?.love || 0}
                      </button>
                      <button onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)} className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-lg transition" aria-label="Jibu" title="Jibu chapisho">
                        <MessageSquare size={16} /> {post.commentCount || 0}
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === post._id && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex gap-2">
                          <label htmlFor={`reply-${post._id}`} className="sr-only">Jibu</label>
                          <input
                            id={`reply-${post._id}`}
                            type="text"
                            placeholder="Andika jibu..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="flex-1 p-2 border rounded-lg"
                            aria-label="Jibu chapisho"
                            title="Andika jibu lako hapa"
                          />
                          <button className="px-3 py-2 bg-green-600 text-white rounded-lg" aria-label="Tuma jibu" title="Tuma jibu">Jibu</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border"><h3 className="font-bold mb-4">Wanachama Walio na Shughuli</h3>{members.slice(0, 5).map(m => (<div key={m._id} className="flex items-center gap-3 py-2"><div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold">{m.name.charAt(0)}</div><div><p className="font-medium">{m.name}</p><p className="text-xs text-gray-500">{m.role === 'admin' ? 'Msimamizi' : 'Mwanachama'} • Machapisho {m.postsCount}</p></div></div>))}</div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white"><h3 className="font-bold mb-4">Matukio Yajayo</h3><div className="flex items-start gap-3 mb-3"><Calendar size={16} className="mt-1" /><div><p className="font-medium">Darsa ya Tawhiid</p><p className="text-xs text-green-200">Jumamosi, Baada ya Maghrib</p></div></div><Link href="/events" className="flex items-center justify-center gap-2 mt-4 p-2 bg-white/20 rounded-lg hover:bg-white/30">Tazama Ratiba Kamili →</Link></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map(m => (
              <div key={m._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-4 mb-4"><div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-2xl">{m.name.charAt(0)}</div><div><h3 className="font-bold">{m.name}</h3><p className="text-sm text-green-600">{m.role === 'admin' ? 'Msimamizi' : 'Mwanachama'}</p></div></div>
                <div className="space-y-2 text-sm text-gray-600"><div className="flex items-center gap-2"><Calendar size={14} /> Amejiunga {new Date(m.joinedAt).toLocaleDateString('sw-TZ', { month: 'short', year: 'numeric' })}</div><div className="flex items-center gap-2"><MessageCircle size={14} /> Machapisho {m.postsCount}</div></div>
                <button className="w-full mt-4 p-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 flex items-center justify-center gap-2" aria-label="Fuata" title="Fuata mwanachama"><UserPlus size={16} /> Fuata</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}