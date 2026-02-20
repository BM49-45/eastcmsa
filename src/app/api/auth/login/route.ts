import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'

let users: any[] = [{
  id: '1', name: 'Demo User', email: 'demo@eastcmsa.com',
  password: '$2a$12$K9qjL.7l3C4T5V6gH8J9lO1pQ2rS3tU4vW5xY6zA7B8C9D0E1F2G3H4',
  phone: '+255 700 000 000', role: 'USER', receiveUpdates: true,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
}]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    if (!email || !password) {
      return NextResponse.json({ error: 'Barua pepe na nenosiri vinahitajika' }, { status: 400 })
    }
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json({ error: 'Barua pepe au nenosiri siyo sahihi' }, { status: 401 })
    }
    let isValid = false
    if (email === 'demo@eastcmsa.com') {
      isValid = password === 'demo123'
    } else {
      isValid = await compare(password, user.password)
    }
    if (!isValid) {
      return NextResponse.json({ error: 'Barua pepe au nenosiri siyo sahihi' }, { status: 401 })
    }
    const session = { userId: user.id, email: user.email, name: user.name, role: user.role, expires: Date.now() + 24 * 60 * 60 * 1000 }
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ message: 'Umeingia kikamilifu', user: userWithoutPassword, session })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Hitilafu katika kuingia', details: process.env.NODE_ENV === 'development' ? error.message : undefined }, { status: 500 })
  }
}