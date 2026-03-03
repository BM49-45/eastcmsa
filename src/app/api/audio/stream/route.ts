// src/app/api/audio/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('file');

  if (!filename) {
    return new NextResponse('Filename required', { status: 400 });
  }

  // Redirect to public file
  const fileUrl = `/uploads/${filename}`;
  return NextResponse.redirect(new URL(fileUrl, request.url));
}