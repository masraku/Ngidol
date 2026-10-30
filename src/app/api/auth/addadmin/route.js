import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // Only an authenticated admin may create another admin.
    // Without this check the endpoint lets anyone on the internet mint
    // themselves an admin account and take over the admin panel.
    const token = cookies().get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const { email, name, password } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, message: 'Email, nama, dan password wajib diisi' },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: { email, name, password: hashedPassword },
    });

    // Never return the password hash to the client.
    return NextResponse.json({
      success: true,
      message: 'Admin berhasil dibuat',
      admin: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email },
    });
  } catch (error) {
    console.error('[CREATE ADMIN ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat admin' },
      { status: 500 }
    );
  }
}
