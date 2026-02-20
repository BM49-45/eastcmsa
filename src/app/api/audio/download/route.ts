import { NextRequest, NextResponse } from 'next/server'
import { existsSync, createReadStream } from 'fs'
import { join } from 'path'
import { statSync } from 'fs'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const file = searchParams.get('file')
  
  if (!category || !file) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Category and file parameters are required',
        example: '/api/audio/download?category=tawhiid&file=01-al-usuul-athalatha-part-1.mp3'
      },
      { status: 400 }
    )
  }
  
  try {
    // Security: Prevent directory traversal
    if (file.includes('..') || category.includes('..')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file path' },
        { status: 400 }
      )
    }
    
    const filePath = join(process.cwd(), 'public', 'audio', category, file)
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Audio file not found',
          path: filePath 
        },
        { status: 404 }
      )
    }
    
    const stats = statSync(filePath)
    const stream = createReadStream(filePath)
    
    // Create response with proper headers
    const response = new NextResponse(stream as any)
    
    response.headers.set('Content-Type', 'audio/mpeg')
    response.headers.set('Content-Length', stats.size.toString())
    response.headers.set('Content-Disposition', `attachment; filename="${file}"`)
    response.headers.set('Cache-Control', 'public, max-age=86400') // Cache for 1 day
    
    return response
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Download failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}