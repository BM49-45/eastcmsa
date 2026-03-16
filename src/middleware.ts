import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest){

const token = await getToken({
req,
secret: process.env.NEXTAUTH_SECRET
})

const { pathname } = req.nextUrl

// protect dashboard
if(pathname.startsWith("/dashboard")){
if(!token){
return NextResponse.redirect(new URL("/login",req.url))
}
}

// protect admin
if(pathname.startsWith("/admin")){
if(!token || token.role !== "admin"){
return NextResponse.redirect(new URL("/",req.url))
}
}

return NextResponse.next()

}

export const config = {
matcher:[
"/dashboard/:path*",
"/admin/:path*"
]
}