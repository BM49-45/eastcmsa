import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import clientPromise from '@/lib/mongodb';

// Force Node.js runtime for file system operations
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}-${safeFileName}`;
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, buffer);

    // Save to database
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    await db.collection("contents").insertOne({
      title,
      category,
      fileUrl: `/uploads/${filename}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      views: 0,
      likes: 0,
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}