import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Auth is handled by Clerk middleware.
  // Role-based redirects are handled by dashboard/layout.tsx and creator/layout.tsx.
  return NextResponse.next({ request })
}

