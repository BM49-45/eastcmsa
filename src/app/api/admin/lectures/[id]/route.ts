import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Define the correct type for Next.js 15+
type RouteParams = { params: Promise<{ id: string }> }

/**
 * GET /api/lectures/[id]
 * Get a single lecture by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await the params Promise to get the actual params
    const { id } = await context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid lecture ID' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const lecture = await db
      .collection('lectures')
      .findOne({ _id: new ObjectId(id) })

    if (!lecture) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 })
    }

    return NextResponse.json(lecture)
  } catch (error) {
    console.error('Error in GET /api/lectures/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/lectures/[id]
 * Update a lecture by ID
 */
export async function PATCH(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid lecture ID' }, { status: 400 })
    }

    const body = await request.json()
    const client = await clientPromise
    const db = client.db('eastcmsa')

    // Remove _id if it exists in the body to prevent modification
    if (body._id) {
      delete body._id
    }

    const result = await db
      .collection('lectures')
      .updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...body,
            updatedAt: new Date()
          }
        }
      )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Lecture updated successfully',
      modifiedCount: result.modifiedCount 
    })
  } catch (error) {
    console.error('Error in PATCH /api/lectures/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/lectures/[id]
 * Delete a lecture by ID
 */
export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid lecture ID' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const result = await db
      .collection('lectures')
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Lecture deleted successfully',
      deletedCount: result.deletedCount 
    })
  } catch (error) {
    console.error('Error in DELETE /api/lectures/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}