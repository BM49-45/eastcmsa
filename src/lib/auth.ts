import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "./mongodb"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        
        const client = await clientPromise

        const db = client.db("eastcmsa")
        
        const user = await db.collection("users").findOne({
          
          email: credentials?.email
        })

        if (!user) throw new Error("User not found")

        const isValid = await bcrypt.compare(
        credentials!.password,
        user.password
        )

        if (!isValid) throw new Error("Password incorrect")

        return {
        id: user._id.toString(),
        name: user.name,
        mail: user.email,
        role: user.role
      }
    }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },

  secret: process.env.NEXTAUTH_SECRET
}