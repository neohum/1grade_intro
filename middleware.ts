export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /login, /register
     * - /api/auth (NextAuth endpoints)
     * - /(marketing) pages
     * - Static files (_next, images, favicon, etc.)
     */
    '/((?!login|register|api/auth|_next/static|_next/image|images|logo\\.svg|favicon\\.ico).*)',
  ],
};
