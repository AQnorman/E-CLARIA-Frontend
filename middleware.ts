import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isHomePage = request.nextUrl.pathname === '/';

  // If user is not authenticated and trying to access dashboard
  if (!token && isDashboardPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user is authenticated and trying to access auth pages
  if (token && isAuthPage && !isHomePage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/'],
};