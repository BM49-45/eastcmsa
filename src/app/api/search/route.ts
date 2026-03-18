import { NextRequest, NextResponse } from "next/server"
import { getAllAudioFiles } from "@/lib/r2"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() || ''

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    console.log('🔍 Searching for:', query)

    // Get all audio files
    const allAudio = await getAllAudioFiles()
    console.log(`📊 Total audio files: ${allAudio.length}`)

    // Search in titles and speakers
    const results = allAudio
      .filter(audio => {
        const titleMatch = audio.title?.toLowerCase().includes(query)
        const speakerMatch = audio.speaker?.toLowerCase().includes(query)
        const categoryMatch = audio.category?.toLowerCase().includes(query)
        return titleMatch || speakerMatch || categoryMatch
      })
      .map(audio => ({
        id: audio.id,
        title: audio.title,
        speaker: audio.speaker,
        category: audio.category,
        type: audio.category as 'tawhiid' | 'fiqh' | 'sirah' | 'lecture',
        url: `/${audio.category}`,
        date: audio.createdAt
      }))
      .slice(0, 10) // Limit to 10 results

    console.log(`✅ Found ${results.length} results for "${query}"`)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}