import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { CommentStats } from '@/types/comment'
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const comments = db.collection('comments')

    const [
      total,
      pending,
      approved,
      rejected,
      spam,
      reports
    ] = await Promise.all([
      comments.countDocuments(),
      comments.countDocuments({ status: 'pending' }),
      comments.countDocuments({ status: 'approved' }),
      comments.countDocuments({ status: 'rejected' }),
      comments.countDocuments({ status: 'spam' }),
      comments.countDocuments({ reports: { $gt: 0 } })
    ])

    const stats: CommentStats = {
      total,
      pending,
      approved,
      rejected,
      spam,
      reports
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Comments Stats API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}