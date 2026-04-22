import { NextResponse } from 'next/server';

// Castford route → static HTML map.
// Keep this in sync with middleware config.matcher below.
const ROUTE_MAP = {
  '/':           '/site/landing.html',
  '/login':      '/site/login.html',
  '/signup':     '/site/signup.html',
  '/logout':     '/site/logout.html',

  // Role-specific command centers
  '/cfo':           '/site/dashboard/cfo.html',
  '/cfo/pnl':       '/site/dashboard/cfo/pnl.html',
  '/cfo/cash':      '/site/dashboard/cfo/cash.html',
  '/cfo/budget':    '/site/dashboard/cfo/budget.html',
  '/cfo/forecast':  '/site/dashboard/cfo/forecast.html',
  '/ceo':           '/site/dashboard/hub.html?role=ceo',
  '/controller':    '/site/dashboard/controller.html',
  '/fpa':           '/site/dashboard/fpa.html',
  '/standard':      '/site/dashboard/standard.html',
  '/cashflow':      '/site/dashboard/cashflow.html',
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
    '/cfo/pnl',
    '/cfo/cash',
    '/cfo/budget',
    '/cfo/forecast',
    '/ceo',
    '/controller',
    '/fpa',
    '/standard',
    '/cashflow',
  ],
};
