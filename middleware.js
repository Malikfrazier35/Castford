import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rewrite the homepage to the v3 landing page
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/site/landing.html', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
