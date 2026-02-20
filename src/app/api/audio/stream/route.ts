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
        error: 'Category and file parameters are required'
      },
      { status: 400 }
    )
  }
  
  try {
    // Security check
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
          error: 'Audio file not found'
        },
        { status: 404 }
      )
    }
    
    const stats = statSync(filePath)
    const range = request.headers.get('range')
    
    // Handle range requests for streaming
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1
      const chunksize = (end - start) + 1
      
      const fileStream = createReadStream(filePath, { start, end })
      
      const response = new NextResponse(fileStream as any)
      
      response.headers.set('Content-Range', `bytes ${start}-${end}/${stats.size}`)
      response.headers.set('Accept-Ranges', 'bytes')
      response.headers.set('Content-Length', chunksize.toString())
      response.headers.set('Content-Type', 'audio/mpeg')
      
      return response
    } else {
      // Full file request
      const fileStream = createReadStream(filePath)
      const response = new NextResponse(fileStream as any)
      
      response.headers.set('Content-Length', stats.size.toString())
      response.headers.set('Content-Type', 'audio/mpeg')
      response.headers.set('Accept-Ranges', 'bytes')
      
      return response
    }
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Streaming failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}