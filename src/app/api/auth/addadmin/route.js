import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, name, password } = await req.json();

    // Cek kalau admin sudah ada
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return NextResponse.json({ success: false, message: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true, message: 'Admin berhasil dibuat', admin: newAdmin });
  } catch (error) {
    console.error('[CREATE ADMIN ERROR]', error);
    return NextResponse.json({ success: false, message: 'Gagal membuat admin' }, { status: 500 });
  }
}
