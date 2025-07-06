import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const runtime = "nodejs";

// POST: Login
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // 1. Cek sebagai admin
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return NextResponse.json(
          { success: false, message: "Password salah" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const res = NextResponse.json({
        success: true,
        role: "admin",
        user: { id: admin.id, name: admin.name, email: admin.email },
      });

      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 3600,
      });

      return res;
    }

    // 2. Cek sebagai user
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return NextResponse.json(
          { success: false, message: "Password salah" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: "user" },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      const res = NextResponse.json({
        success: true,
        role: "user",
        user: { id: user.id, name: user.name, email: user.email },
      });

      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7200,
      });

      return res;
    }

    // Email tidak ditemukan
    return NextResponse.json(
      { success: false, message: "Email tidak ditemukan" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}

// GET: Verifikasi token dan ambil user
export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const { id, role } = decoded;

    let userData = null;

    if (role === "admin") {
      userData = await prisma.admin.findUnique({
        where: { id },
        select: { id: true, email: true, name: true },
      });
    } else if (role === "user") {
      userData = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true },
      });
    }

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user: userData, role });
  } catch (error) {
    console.error("Token error:", error);
    return NextResponse.json(
      { success: false, message: "Token tidak valid" },
      { status: 401 }
    );
  }
}
