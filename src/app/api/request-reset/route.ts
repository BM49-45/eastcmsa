'use server'

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const client = await clientPromise
  const db = client.db('eastcmsa')
  const users = db.collection('users')

  const user = await users.findOne({ email })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Generate numeric OTP 6 digits
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Store OTP in DB with 10 min expiry
  const passwordResets = db.collection('password_resets')
  await passwordResets.updateOne(
    { userId: user._id },
    { $set: { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) } },
    { upsert: true }
  )

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  })

  await transporter.sendMail({
    from: `"East CMSA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Password OTP',
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`
  })

  return NextResponse.json({ message: 'OTP sent to your email' })
}