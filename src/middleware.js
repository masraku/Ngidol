import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET;

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // 🔒 Middleware khusus untuk proteksi route admin
  if (pathname.startsWith('/admin')) {
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Admin route detected:', pathname);

    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log('Tidak ada token, redirect ke /login');
      return NextResponse.redirect(new URL("/user/auth", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY), {
        algorithms: ["HS256"],
      });

      // Validasi role jika ingin spesifik
      if (payload.role !== 'admin') {
        console.log('Akses ditolak: bukan admin');
        return NextResponse.redirect(new URL("/user/auth", req.url));
      }

      console.log('Akses diterima: admin terautentikasi');
      const response = NextResponse.next();
      response.headers.set('X-Auth-Status', 'authenticated');
      response.headers.set('X-User-Type', 'admin');
      return response;
    } catch (error) {
      console.error('Token tidak valid:', error);
      return NextResponse.redirect(new URL("/user/auth", req.url));
    }
  }

  // Untuk route lain, biarkan lanjut
  return NextResponse.next();
}

// Apply hanya untuk route /admin/*
export const config = {
  matcher: ['/admin/:path*'],
};
