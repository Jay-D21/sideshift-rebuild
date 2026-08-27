import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtected = createRouteMatcher(['/dashboard(.*)', '/creator(.*)'])

export async function proxy(request: import('next/server').NextRequest) {
  const handler = clerkMiddleware(async (auth, req) => {
    if (isProtected(req)) {
      await auth.protect()
    }
  })
  return handler(request, {} as any)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/__clerk/(.*)',
  ],
}