import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET;

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // ========================
  // 1. Proteksi route admin
  // ========================
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL("/user/auth", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL("/user/auth", req.url));
      }

      const response = NextResponse.next();
      response.headers.set('X-Auth-Status', 'authenticated');
      response.headers.set('X-User-Type', 'admin');
      return response;
    } catch (err) {
      console.error("Invalid admin token:", err);
      return NextResponse.redirect(new URL("/user/auth", req.url));
    }
  }

  // ========================
  // 2. Proteksi khusus user yang WAJIB login
  // ========================
  const protectedUserPaths = ['/user/mypage', '/user/preferences'];

  if (protectedUserPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/user/auth", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      if (payload.role !== 'user') {
        return NextResponse.redirect(new URL("/user/auth", req.url));
      }

      const response = NextResponse.next();
      response.headers.set('X-Auth-Status', 'authenticated');
      response.headers.set('X-User-Type', 'user');
      return response;
    } catch (err) {
      console.error("Invalid user token:", err);
      return NextResponse.redirect(new URL("/user/auth", req.url));
    }
  }

  // ========================
  // 3. Jalur /user lain (opsional login)
  // ========================
  if (pathname.startsWith('/user')) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        const response = NextResponse.next();
        response.headers.set('X-Auth-Status', 'authenticated');
        response.headers.set('X-User-Type', payload.role);
        return response;
      } catch (err) {
        console.warn("Invalid token di route umum /user:", err);
        // Token invalid, lanjut tetap
      }
    }

    return NextResponse.next();
  }

  // ========================
  // 4. Default: lanjut tanpa proteksi
  // ========================
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*'
  ],
};
