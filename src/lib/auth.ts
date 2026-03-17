import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "./mongodb"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
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
        
        const user = await db.collection("users").findOne({ 
          email: credentials.email 
        })

        if (!user) {
          return null
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!passwordMatch) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
          image: user.image,
          bio: user.bio,
          location: user.location,
          website: user.website
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.bio = user.bio
        token.location = user.location
        token.website = user.website
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
        // Add optional fields
        session.user.bio = token.bio || ""
        session.user.location = token.location || ""
        session.user.website = token.website || ""
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role: string
    bio?: string
    location?: string
    website?: string
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      bio?: string
      location?: string
      website?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    id: string
    bio?: string
    location?: string
    website?: string
  }
}