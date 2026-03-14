import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {

providers: [

CredentialsProvider({

name: "Credentials",

credentials: {
email: { label: "Email", type: "email" },
password: { label: "Password", type: "password" }
},

async authorize(credentials) {

if (!credentials?.email || !credentials?.password) {
throw new Error("Email and password required")
}

const client = await clientPromise
const db = client.db("eastcmsa")

const user:any = await db.collection("users").findOne({
email: credentials.email.toLowerCase()
})

if (!user) {
throw new Error("Email haipo")
}

const valid = await bcrypt.compare(
credentials.password,
user.password
)

if (!valid) {
throw new Error("Password si sahihi")
}

return {
id: user._id.toString(),
name: user.name,
email: user.email,
role: user.role
}

}

})

],

callbacks: {

async jwt({ token, user }) {

if (user) {
token.id = (user as any).id
token.role = (user as any).role
}

return token

},

async session({ session, token }: { session: any, token: any }) {

if (session.user) {
  (session.user as any).id = token.id
  (session.user as any).role = token.role
}

return session

}

},

pages: {
signIn: "/login"
},

session: {
strategy: "jwt"
},

secret: process.env.NEXTAUTH_SECRET

}