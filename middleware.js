import { NextResponse } from 'next/server';

// Castford route → static HTML map.
// Keep this in sync with middleware config.matcher below.
//
// Engine-driven dashboards (/ceo, /controller, /fpa, /treasurer) all rewrite
// to the same hub.html. The role is derived from window.location.pathname
// inside hub.html — NO query string in the rewrite target. (Vercel's static
// resolver looks for literal file paths and query strings cause 404s.)
const ROUTE_MAP = {
  '/':           '/site/landing.html',
  '/login':      '/site/login.html',
  '/signup':     '/site/signup.html',
  '/logout':     '/site/logout.html',

  // Role-specific command centers (existing — bespoke HTML per role)
  '/cfo':           '/site/dashboard/cfo.html',
  '/cfo/pnl':       '/site/dashboard/cfo/pnl.html',
  '/cfo/cash':      '/site/dashboard/cfo/cash.html',
  '/cfo/budget':    '/site/dashboard/cfo/budget.html',
  '/cfo/forecast':  '/site/dashboard/cfo/forecast.html',

  // Engine-driven dashboards — all use the same hub.html shell
  // Role is derived from window.location.pathname inside hub.html
  '/ceo':           '/site/dashboard/hub.html',
  '/controller':    '/site/dashboard/hub.html',
  '/fpa':           '/site/dashboard/hub.html',
  '/treasurer':     '/site/dashboard/hub.html',

  // Legacy routes
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
    '/treasurer',
    '/standard',
    '/cashflow',
  ],
};
