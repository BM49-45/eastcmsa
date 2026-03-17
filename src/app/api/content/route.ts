// src/app/api/content/route.ts
import { NextResponse } from 'next/server';
import { getContent, deleteContent } from '@/services/contentService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const contents = await getContent();
    return NextResponse.json(contents);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400 }
      );
    }
    
    const result = await deleteContent(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}