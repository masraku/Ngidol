import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"; // ganti jadi 'bcryptjs' kalau error di production
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin tidak ditemukan" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Password salah" }, { status: 401 });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      admin: { id: admin.id, email: admin.email },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 3600,
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan saat login" }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ success: false, message: "Token tidak ditemukan" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin tidak ditemukan" }, { status: 401 });
    }

    // ✅ Tambahkan return ini
    return NextResponse.json({ success: true, admin });

  } catch (err) {
    console.error("Error verifying token:", err);
    return NextResponse.json({ success: false, message: "Token tidak valid" }, { status: 401 });
  }
}

