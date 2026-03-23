import { categories } from "./r2"
import { getAllAudioFiles } from "./r2"

export async function searchAudio(query: string) {
  try {
    const allAudio = await getAllAudioFiles()
    
    if (!query || query.length < 2) {
      return []
    }
    
    const lowerQuery = query.toLowerCase()
    
    const results = allAudio.filter(audio => 
      audio.title.toLowerCase().includes(lowerQuery) ||
      audio.speaker.toLowerCase().includes(lowerQuery) ||
      (audio.categoryName && audio.categoryName.toLowerCase().includes(lowerQuery))
    )
    
    return results.slice(0, 10)
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}