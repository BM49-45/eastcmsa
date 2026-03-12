import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, receiveUpdates } = await req.json()
    
    const cleanEmail = email.toLowerCase().trim()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const users = db.collection('users')

    // Check if user exists
    const existingUser = await users.findOne({ email: cleanEmail })    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Determine role - kwa sasa wote ni 'user'
    // Admin itaundwa manually kwenye database
    const role = 'user'

    // Create user
    const result = await users.insertOne({
      name,
      email: cleanEmail,
      phone: phone || '',
      password: hashedPassword,
      role, // 'user' au 'admin'
      image: null,
      emailNotifications: receiveUpdates ?? true,
      darkMode: false,
      stats: {
        lectures: 0,
        books: 0,
        likes: 0,
        comments: 0,
        downloads: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Create user object without password for response
    const userWithoutPassword = {
      _id: result.insertedId,
      name,
      email: cleanEmail,
      phone: phone || '',
      role,
      image: null,
      emailNotifications: receiveUpdates ?? true,
      createdAt: new Date()
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}