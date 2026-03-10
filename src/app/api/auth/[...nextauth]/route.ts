import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth({
  ...authOptions,
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
    // Baada ya login nenda home page
    newUser: '/', // Kwa user wapya
  }
})

export { handler as GET, handler as POST }