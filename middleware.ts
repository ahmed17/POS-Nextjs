export { default } from 'next-auth/middleware';

export const config = {
  // Protect all routes under (root) group (home, orders, product, records, settings, analytics)
  // But exclude /login, /api/auth, and the landing page /
  matcher: [
    '/home/:path*',
    '/orders/:path*',
    '/product/:path*',
    '/records/:path*',
    '/settings/:path*',
    '/analytics/:path*',
    '/technologies/:path*',
  ],
};
