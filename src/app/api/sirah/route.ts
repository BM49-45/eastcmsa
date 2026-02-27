import { NextResponse } from 'next/server'
import { getSirahMetadata } from '@/services/contentService'

export async function GET() {
  try {
    const data = await getSirahMetadata()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sirah metadata' },
      { status: 500 }
    )
  }
}