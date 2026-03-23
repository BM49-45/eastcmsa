import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getAllAudioFiles } from '@/lib/r2'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    
    // Get content from database
    const dbContent = await db.collection('contents').find({}).sort({ createdAt: -1 }).toArray()
    
    // Get content from R2
    const r2Content = await getAllAudioFiles()
    
    const allContent = [
      ...dbContent.map(c => ({
        id: c._id.toString(),
        title: c.title,
        speaker: c.speaker,
        category: c.category,
        duration: c.duration || '00:00',
        size: c.size || '0 MB',
        downloads: c.downloads || 0,
        views: c.views || 0,
        url: c.url,
        filename: c.filename,
        createdAt: c.createdAt,
        status: c.status || 'published'
      })),
      ...r2Content.map(c => ({
        id: c.id,
        title: c.title,
        speaker: c.speaker,
        category: c.category,
        duration: c.duration,
        size: c.size,
        downloads: c.downloads || 0,
        views: c.views || 0,
        url: c.url,
        filename: c.filename,
        createdAt: c.createdAt,
        status: 'published'
      }))
    ]

    return NextResponse.json(allContent)
  } catch (error) {
    console.error('Contents API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, speaker, category, duration, size, url, filename } = body

    const client = await clientPromise
    const db = client.db('eastcmsa')

    const result = await db.collection('contents').insertOne({
      title,
      speaker,
      category,
      duration: duration || '00:00',
      size: size || '0 MB',
      url,
      filename,
      downloads: 0,
      views: 0,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    })
  } catch (error) {
    console.error('Create Content Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}