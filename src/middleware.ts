// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Separate function for handling uploads
function handleUploads(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    return NextResponse.next()
  }
  return null
}

export default withAuth(
  function middleware(req) {
    // First check if it's an uploads request
    const uploadsResponse = handleUploads(req)
    if (uploadsResponse) {
      return uploadsResponse
    }

    // Then handle authentication for protected routes
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes protection
    if (path.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Dashboard route protection - normal users can access their own dashboard
    if (path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      // Allow all authenticated users to access their dashboard
      // But they won't see admin features there
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }
        
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
    }

        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/uploads/:path*' // Add uploads to the matcher
  ]
}