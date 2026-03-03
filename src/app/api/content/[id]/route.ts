import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// =====================
// DELETE /api/content/[id]
// =====================
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const client = await clientPromise
    const db = client.db('eastcmsa')

    const result = await db.collection('content').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Content not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}

// =====================
// PUT /api/content/[id]
// =====================
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const client = await clientPromise
    const db = client.db('eastcmsa')

    const result = await db.collection('content').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 1) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Content not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    )
  }
}