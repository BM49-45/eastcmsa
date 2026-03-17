import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, commentIds } = await req.json()

    if (!action || !commentIds || !Array.isArray(commentIds)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const comments = db.collection('comments')

    const objectIds = commentIds.map(id => new ObjectId(id))

    let update: any = {}
    switch (action) {
      case 'approve':
        update = { $set: { status: 'approved' } }
        break
      case 'reject':
        update = { $set: { status: 'rejected' } }
        break
      case 'delete':
        await comments.deleteMany({ _id: { $in: objectIds } })
        return NextResponse.json({ success: true, deletedCount: commentIds.length })
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const result = await comments.updateMany(
      { _id: { $in: objectIds } },
      update
    )

    return NextResponse.json({ 
      success: true, 
      modifiedCount: result.modifiedCount 
    })
  } catch (error) {
    console.error('Bulk Action API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}