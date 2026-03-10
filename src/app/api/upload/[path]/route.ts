// src/app/api/uploads/[path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', ...params.path)
    
    try {
      const file = await fs.readFile(filePath)
      const ext = path.extname(filePath).toLowerCase()
      
      // Set content type based on file extension
      const contentType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      }[ext] || 'application/octet-stream'

      return new NextResponse(file, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      })
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}