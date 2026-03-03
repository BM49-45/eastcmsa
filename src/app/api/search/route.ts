import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    // Search in contents collection
    const searchRegex = new RegExp(query, 'i')
    
    const contents = await db.collection("contents")
      .find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { speaker: searchRegex }
        ]
      })
      .limit(20)
      .toArray()

    // Transform results to match frontend format
    const results = contents.map(content => ({
      id: content._id,
      type: content.type || 'audio',
      title: content.title,
      category: content.category,
      url: `/${content.category || 'lectures'}`,
      description: content.description || '',
      duration: content.duration,
      date: content.date,
      author: content.speaker,
      views: content.views || 0,
      downloads: content.downloads || 0
    }))

    // Filter by type if specified
    const filteredResults = type && type !== 'all' 
      ? results.filter(r => r.type === type)
      : results

    return NextResponse.json({ results: filteredResults })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}