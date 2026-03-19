// src/app/api/admin/comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { CommentStatus } from '@/types/comment'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/comments/[id]
 * Updates the status of a comment.
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Next.js 16 expects params possibly as a Promise
) {
  const { id } = await context.params

  try {
    // Verify admin session
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get new status from request body
    const { status } = await req.json()
    if (!status || !['pending', 'approved', 'rejected', 'spam'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('eastcmsa')
    const comments = db.collection('comments')

    // Update comment status
    const result = await comments.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status as CommentStatus, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /comments/[id] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/comments/[id]
 * Deletes a comment.
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    // Verify admin session
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('eastcmsa')
    const comments = db.collection('comments')

    // Delete comment
    const result = await comments.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /comments/[id] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}