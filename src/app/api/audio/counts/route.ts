import { NextResponse } from 'next/server'
import { getAllAudioFiles } from '@/lib/r2'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allAudio = await getAllAudioFiles()
    
    // Calculate counts per category - tumia 'mihadhara' sio 'lecture'
    const counts = {
      total: allAudio.length,
      tawhiid: allAudio.filter(audio => audio.category === 'tawhiid').length,
      fiqh: allAudio.filter(audio => audio.category === 'fiqh').length,
      sirah: allAudio.filter(audio => audio.category === 'sirah').length,
      lecture: allAudio.filter(audio => audio.category === 'mihadhara').length,  // ✅ Mihadhara
    }
    
    const totalDownloads = allAudio.reduce((sum, audio) => sum + (audio.downloads || 0), 0)
    const totalViews = allAudio.reduce((sum, audio) => sum + (audio.views || 0), 0)
    const totalLikes = allAudio.reduce((sum, audio) => sum + (audio.likes || 0), 0)
    
    return NextResponse.json({
      counts,
      totalDownloads,
      totalViews,
      totalLikes,
      audioFiles: allAudio
    })
  } catch (error) {
    console.error('Error fetching audio counts:', error)
    return NextResponse.json({ error: 'Failed to fetch audio counts' }, { status: 500 })
  }
}