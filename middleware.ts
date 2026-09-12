export { default } from 'next-auth/middleware';

export const config = {
  // Protect all routes except auth, public assets, and login page
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)'],
};
