import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {

    const { pathname } = req.nextUrl
    const token = req.nextauth?.token

    // Allow uploads
    if (pathname.startsWith("/uploads/")) {
      return NextResponse.next()
    }

    // Admin protection
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Dashboard protection
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    // Profile protection
    if (pathname.startsWith("/profile")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    // Settings protection
    if (pathname.startsWith("/settings")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },

  {
    callbacks: {

      authorized: ({ token, req }) => {

        const { pathname } = req.nextUrl

        if (pathname.startsWith("/uploads")) {
          return true
        }

        if (pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }

        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/profile") ||
          pathname.startsWith("/settings")
        ) {
          return !!token
        }

        return true
      }

    }
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/uploads/:path*"
  ]
}