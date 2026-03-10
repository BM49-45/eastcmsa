// src/app/api/user/profile-picture/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { writeFile } from 'fs/promises'
import path from 'path'
import { 
  ensureUploadDirs, 
  generateFileName, 
  getPublicUrl, 
  deleteFile,
  isValidFileType,
  isValidFileSize,
  AVATAR_DIR 
} from '@/lib/fileUtils'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure upload directories exist
    await ensureUploadDirs()

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!isValidFileType(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WEBP' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (!isValidFileSize(file.size)) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 })
    }

    // Get current user to delete old image
    const client = await clientPromise
    const db = client.db('eastcmsa')
    const users = db.collection('users')

    const user = await users.findOne({ _id: new ObjectId(session.user.id) })
    
    // Delete old image if exists
    if (user?.image) {
      const oldImagePath = path.join(process.cwd(), 'public', user.image)
      await deleteFile(oldImagePath)
    }

    // Save new file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filename = generateFileName(file.name)
    const filepath = path.join(AVATAR_DIR, filename)
    
    await writeFile(filepath, buffer)

    // Public URL for the image
    const imageUrl = getPublicUrl(filename)
    
    // Update user in database
    await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { 
        $set: { 
          image: imageUrl,
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    })
  } catch (error) {
    console.error('Profile picture upload error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}