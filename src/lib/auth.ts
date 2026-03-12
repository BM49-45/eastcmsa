import { type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import clientPromise from "./mongodb"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    return null
  }

  const client = await clientPromise
  const db = client.db("eastcmsa")
  const users = db.collection("users")

  const email = credentials.email.toLowerCase().trim()

  const user = await users.findOne({
    email: email
  })

  if (!user) {
    console.log("User not found:", email)
    return null
  }

  const isValid = await bcrypt.compare(credentials.password, user.password)

  if (!isValid) {
    console.log("Invalid password")
    return null
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role || "user",
    image: user.image || null
  }
}
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.image = token.picture as string | null
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}