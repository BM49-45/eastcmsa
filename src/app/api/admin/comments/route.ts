import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Comment, CommentStatus } from '@/types/comment'
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const comments = db.collection('comments')

    // Build query
    const query: any = {}
    if (status && status !== 'all') {
      query.status = status
    }
    if (type && type !== 'all') {
      query.itemType = type
    }
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } }
      ]
    }

    const [items, total] = await Promise.all([
      comments
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      comments.countDocuments(query)
    ])

    const transformedComments: Comment[] = items.map(item => ({
      _id: item._id.toString(),
      content: item.content,
      userId: item.userId,
      userName: item.userName,
      userEmail: item.userEmail,
      userRole: item.userRole,
      itemId: item.itemId,
      itemType: item.itemType,
      itemTitle: item.itemTitle,
      parentId: item.parentId,
      status: item.status,
      likes: item.likes || 0,
      reports: item.reports || 0,
      isEdited: item.isEdited || false,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      repliedAt: item.repliedAt,
      metadata: item.metadata
    }))

    return NextResponse.json({
      comments: transformedComments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Comments API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}