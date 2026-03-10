'use server'

import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, otp, newPassword } = await req.json()
  if (!email || !otp || !newPassword)
    return NextResponse.json({ error: 'Email, OTP and new password are required' }, { status: 400 })

  const client = await clientPromise
  const db = client.db('eastcmsa')

  const users = db.collection('users')
  const passwordResets = db.collection('password_resets')

  const resetRecord = await passwordResets.findOne({ email })
  if (!resetRecord) return NextResponse.json({ error: 'No OTP request found' }, { status: 400 })

  if (resetRecord.expiresAt < new Date()) return NextResponse.json({ error: 'OTP expired' }, { status: 400 })
  if (resetRecord.otp !== otp) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12)

  // Update user password
  await users.updateOne({ email }, { $set: { password: hashedPassword } })

  // Delete OTP record
  await passwordResets.deleteOne({ email })

  return NextResponse.json({ message: 'Password updated successfully' })
}