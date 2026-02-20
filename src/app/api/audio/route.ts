import { NextRequest, NextResponse } from 'next/server'
import { readdirSync, existsSync, readFileSync, statSync } from 'fs'
import { join, extname } from 'path'

// TEMPORARY: Let's simplify the API first
export async function GET(request: NextRequest) {
  console.log('🔊 [DEBUG API] Starting debug mode...')
  
  try {
    const audioBasePath = join(process.cwd(), 'public', 'audio')
    console.log('📁 Audio base path:', audioBasePath)
    console.log('📁 Current working directory:', process.cwd())
    
    // Check if audio directory exists
    if (!existsSync(audioBasePath)) {
      console.error('❌ Audio directory does NOT exist!')
      return NextResponse.json(
        {
          success: false,
          error: 'Audio directory not found',
          path: audioBasePath,
          suggestion: 'Create public/audio/ folder',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }
    
    // List ALL directories in audio folder
    const allItems = readdirSync(audioBasePath, { withFileTypes: true })
    console.log('📦 All items in audio folder:', allItems.map(item => ({
      name: item.name,
      isDirectory: item.isDirectory(),
      isFile: item.isFile()
    })))
    
    const categories = allItems
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    console.log('📂 Found categories:', categories)
    console.log('🔍 Looking for "tawhiid" in categories:', categories.includes('tawhiid'))
    
    // Check specifically for tawhiid folder
    const tawhiidPath = join(audioBasePath, 'tawhiid')
    const tawhiidExists = existsSync(tawhiidPath)
    console.log('📁 tawhiid folder exists?', tawhiidExists)
    console.log('📁 tawhiid full path:', tawhiidPath)
    
    if (tawhiidExists) {
      // List files in tawhiid folder
      const tawhiidFiles = readdirSync(tawhiidPath)
      console.log('📄 Files in tawhiid folder:', tawhiidFiles)
      
      // Check for metadata.json
      const metadataPath = join(tawhiidPath, 'metadata.json')
      const metadataExists = existsSync(metadataPath)
      console.log('📋 metadata.json exists?', metadataExists)
      
      if (metadataExists) {
        try {
          const metadataContent = readFileSync(metadataPath, 'utf8')
          console.log('📋 metadata.json content length:', metadataContent.length)
          const metadata = JSON.parse(metadataContent)
          console.log('📋 metadata.files count:', metadata.files?.length || 0)
          
          // Process tawhiid files
          const tawhiidAudios = []
          if (metadata.files && Array.isArray(metadata.files)) {
            for (const file of metadata.files) {
              const filePath = join(tawhiidPath, file.filename)
              if (existsSync(filePath)) {
                const stats = statSync(filePath)
                tawhiidAudios.push({
                  id: `tawhiid-${file.filename}`,
                  title: file.title,
                  filename: file.filename,
                  category: 'tawhiid',
                  size: file.size || stats.size,
                  sizeMB: ((file.size || stats.size) / (1024 * 1024)).toFixed(2),
                  duration: file.duration,
                  speaker: file.speaker,
                  date: file.date,
                  url: `/audio/tawhiid/${file.filename}`,
                  downloadUrl: `/api/audio/download?category=tawhiid&file=${encodeURIComponent(file.filename)}`,
                  extension: 'mp3'
                })
              }
            }
          }
          
          console.log(`✅ Processed ${tawhiidAudios.length} tawhiid audios`)
          
          // Return SIMPLE response that matches your frontend
          return NextResponse.json({
            success: true,
            message: 'Audio data loaded successfully',
            data: {
              // OLD FORMAT (for compatibility)
              tawhiid: tawhiidAudios,
              // NEW FORMAT (for future)
              categories: {
                tawhiid: {
                  info: {
                    name: 'Tawhiid',
                    description: 'Misingi ya Umoja wa Mungu na Uislamu',
                    totalFiles: tawhiidAudios.length
                  },
                  files: tawhiidAudios
                }
              },
              debug: {
                categoriesFound: categories,
                tawhiidFolderExists: tawhiidExists,
                tawhiidFilesCount: tawhiidFiles.length,
                metadataExists: metadataExists
              }
            },
            timestamp: new Date().toISOString()
          })
          
        } catch (error: any) {
          console.error('❌ Error reading metadata:', error)
          return NextResponse.json({
            success: false,
            error: 'Error reading metadata.json',
            details: error.message,
            timestamp: new Date().toISOString()
          }, { status: 500 })
        }
      } else {
        return NextResponse.json({
          success: false,
          error: 'metadata.json not found in tawhiid folder',
          suggestion: 'Create metadata.json file',
          filesInFolder: tawhiidFiles,
          timestamp: new Date().toISOString()
        }, { status: 404 })
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'tawhiid folder not found',
        availableCategories: categories,
        suggestion: 'Create public/audio/tawhiid/ folder',
        timestamp: new Date().toISOString()
      }, { status: 404 })
    }
    
  } catch (error: any) {
    console.error('❌ Fatal error in API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}