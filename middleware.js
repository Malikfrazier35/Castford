import { NextResponse } from 'next/server';

// Castford route → static HTML map.
// Keep this in sync with middleware config.matcher below.
const ROUTE_MAP = {
  '/':           '/site/landing.html',
  '/login':      '/site/login.html',
  '/signup':     '/site/signup.html',
  '/logout':     '/site/logout.html',

  // Role-specific command centers
  '/cfo':        '/site/dashboard/cfo.html',
  '/ceo':        '/site/dashboard/ceo.html',
  '/controller': '/site/dashboard/controller.html',
  '/fpa':        '/site/dashboard/fpa.html',
  '/standard':   '/site/dashboard/standard.html',
  '/cashflow':   '/site/dashboard/cashflow.html',
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const target = ROUTE_MAP[pathname];
  if (target) {
    return NextResponse.rewrite(new URL(target, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/logout',
    '/cfo',
    '/ceo',
    '/controller',
    '/fpa',
    '/standard',
    '/cashflow',
  ],
};
