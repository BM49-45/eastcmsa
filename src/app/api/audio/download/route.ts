// src/app/api/audio/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('file');

  if (!filename) {
    return new NextResponse('Filename required', { status: 400 });
  }

  // Serve file as attachment
  const fileUrl = `/uploads/${filename}`;
  const response = NextResponse.redirect(new URL(fileUrl, request.url));
  
  // Add download headers
  response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
  
  return response;
}