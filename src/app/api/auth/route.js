import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"; // Ganti ke 'bcryptjs' jika build error
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email dan password wajib diisi" }, { status: 400 });
    }

    // Cari admin berdasarkan email
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin tidak ditemukan" }, { status: 401 });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Password salah" }, { status: 401 });
    }

    // Buat JWT token dengan role admin
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Kirim token sebagai cookie
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      admin: { id: admin.id, email: admin.email },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 3600, // 1 jam
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan saat login" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ success: false, message: "Token tidak ditemukan" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 403 });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin tidak ditemukan" }, { status: 401 });
    }

    return NextResponse.json({ success: true, admin });

  } catch (err) {
    console.error("Error verifying token:", err);
    return NextResponse.json({ success: false, message: "Token tidak valid" }, { status: 401 });
  }
}
