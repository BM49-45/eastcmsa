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
          throw new Error("Email na password zinahitajika")
        }

        try {
          const client = await clientPromise
          const db = client.db("eastcmsa")
          const users = db.collection("users")

          // Tafuta user kwa email
          const user = await users.findOne({ email: credentials.email })
          
          if (!user) {
            throw new Error("Email haipo")
          }

          // Compare password
          const isValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValid) {
            throw new Error("Password si sahihi")
          }

          // Return user data (bila password)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
            image: user.image || null
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
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