'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Trash2,
  Eye,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  User,
  Mail,
  Reply
} from 'lucide-react'
import Link from 'next/link'
import { Comment, CommentStatus } from '@/types/comment'

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0,
    reports: 0
  })

  useEffect(() => {
    fetchComments()
    fetchStats()
  }, [page, statusFilter, typeFilter, search])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(search && { search })
      })

      const res = await fetch(`/api/admin/comments?${params}`)
      const data = await res.json()
      if (res.ok) {
        setComments(data.comments)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/comments/stats')
      const data = await res.json()
      if (res.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedComments.length === 0) return
    
    const confirmMessage = {
      approve: `Approve ${selectedComments.length} comments?`,
      reject: `Reject ${selectedComments.length} comments?`,
      delete: `Delete ${selectedComments.length} comments? This cannot be undone.`
    }[action]

    if (!confirm(confirmMessage)) return

    try {
      const res = await fetch('/api/admin/comments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          commentIds: selectedComments
        })
      })

      if (res.ok) {
        setSelectedComments([])
        fetchComments()
        fetchStats()
      }
    } catch (error) {
      console.error(`Error ${action} comments:`, error)
    }
  }

  const handleStatusChange = async (commentId: string, status: CommentStatus) => {
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        fetchComments()
        fetchStats()
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchComments()
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleReply = async () => {
    if (!replyingTo || !replyContent.trim()) return

    try {
      const res = await fetch('/api/admin/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId: replyingTo._id,
          content: replyContent,
          userId: replyingTo.userId,
          itemId: replyingTo.itemId,
          itemType: replyingTo.itemType,
          itemTitle: replyingTo.itemTitle
        })
      })

      if (res.ok) {
        setShowReplyModal(false)
        setReplyContent('')
        setReplyingTo(null)
        fetchComments()
      }
    } catch (error) {
      console.error('Error replying to comment:', error)
    }
  }

  const getStatusBadge = (status: CommentStatus) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      spam: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }

    const icons = {
      pending: <Clock size={14} className="mr-1" />,
      approved: <Check size={14} className="mr-1" />,
      rejected: <X size={14} className="mr-1" />,
      spam: <AlertTriangle size={14} className="mr-1" />
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${badges[status]}`}>
        {icons[status]}
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <MessageCircle className="mr-2" size={24} />
          Comments Moderation
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.approved}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-red-600 dark:text-red-400">Rejected</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.rejected}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Spam</p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.spam}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-purple-600 dark:text-purple-400">Reports</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.reports}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <label htmlFor="search-comments" className="sr-only">Search comments</label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="search-comments"
              type="text"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              aria-label="Search comments"
              title="Search comments by content, user name, or email"
            />
          </div>
          
          <div>
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CommentStatus | 'all')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              aria-label="Filter comments by status"
              title="Select comment status to filter"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="spam">Spam</option>
            </select>
          </div>

          <div>
            <label htmlFor="type-filter" className="sr-only">Filter by content type</label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              aria-label="Filter comments by content type"
              title="Select content type to filter"
            >
              <option value="all">All Types</option>
              <option value="lecture">Lectures</option>
              <option value="book">Books</option>
              <option value="event">Events</option>
              <option value="article">Articles</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedComments.length > 0 && (
          <div className="mt-4 flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedComments.length} selected
            </span>
            <button
              onClick={() => handleBulkAction('approve')}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
              aria-label={`Approve ${selectedComments.length} selected comments`}
              title={`Approve ${selectedComments.length} comments`}
            >
              <Check size={16} className="mr-1" />
              Approve
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center"
              aria-label={`Reject ${selectedComments.length} selected comments`}
              title={`Reject ${selectedComments.length} comments`}
            >
              <X size={16} className="mr-1" />
              Reject
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm flex items-center"
              aria-label={`Delete ${selectedComments.length} selected comments`}
              title={`Delete ${selectedComments.length} comments`}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Comments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <label htmlFor="select-all" className="sr-only">Select all comments</label>
                  <input
                    id="select-all"
                    type="checkbox"
                    checked={selectedComments.length === comments.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedComments(comments.map(c => c._id))
                      } else {
                        setSelectedComments([])
                      }
                    }}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    aria-label="Select all comments"
                    title="Select all comments"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
                  </td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No comments found
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <label htmlFor={`comment-${comment._id}`} className="sr-only">Select comment</label>
                      <input
                        id={`comment-${comment._id}`}
                        type="checkbox"
                        checked={selectedComments.includes(comment._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedComments([...selectedComments, comment._id])
                          } else {
                            setSelectedComments(selectedComments.filter(id => id !== comment._id))
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        aria-label={`Select comment by ${comment.userName}`}
                        title={`Select comment from ${comment.userName}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-md">
                        <p className="text-gray-900 dark:text-white">
                          {comment.content}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <span>on {comment.itemType}</span>
                          <Link 
                            href={`/${comment.itemType}s/${comment.itemId}`}
                            className="text-green-600 hover:underline"
                            title={`View ${comment.itemType}`}
                          >
                            {comment.itemTitle}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {comment.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comment.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span title="Likes">❤️ {comment.likes}</span>
                        <span title="Reports">🚩 {comment.reports}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(comment.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStatusChange(comment._id, 'approved')}
                          className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                          aria-label="Approve comment"
                          title="Approve this comment"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(comment._id, 'rejected')}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          aria-label="Reject comment"
                          title="Reject this comment"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(comment)
                            setShowReplyModal(true)
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          aria-label="Reply to comment"
                          title="Reply to this comment"
                        >
                          <Reply size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          aria-label="Delete comment"
                          title="Delete this comment"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
            aria-label="Previous page"
            title="Go to previous page"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
            aria-label="Next page"
            title="Go to next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && replyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Reply to Comment
            </h3>
            
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Original comment:
              </p>
              <p className="text-gray-900 dark:text-white">
                {replyingTo.content}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                By {replyingTo.userName}
              </p>
            </div>

            <label htmlFor="reply-content" className="sr-only">Reply content</label>
            <textarea
              id="reply-content"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white mb-4"
              aria-label="Reply content"
              title="Type your reply message"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReplyModal(false)
                  setReplyContent('')
                  setReplyingTo(null)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Cancel reply"
                title="Cancel replying"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyContent.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                aria-label="Send reply"
                title="Send your reply"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}