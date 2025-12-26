import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/api/barcode'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // API routes are accessible (you can add API auth separately if needed)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For dashboard routes, check authentication via cookie/header
  // Note: Since we're using sessionStorage, we can't check it here
  // This middleware is optional - you can remove it if using client-side auth only
  
  // Allow access (client-side components will handle auth)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};