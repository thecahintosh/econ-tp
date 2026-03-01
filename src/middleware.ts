import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const path = req.nextUrl.pathname

      // Admin routes need EB/CORE/ADMIN
      if (path.startsWith('/admin')) {
        return token?.role === 'ADMIN' || token?.role === 'EB' || token?.role === 'CORE'
      }

      // Submit proposal needs any authenticated user
      if (path.startsWith('/submit')) {
        return !!token
      }

      return true
    },
  },
})

export const config = {
  matcher: ['/admin/:path*', '/submit'],
}