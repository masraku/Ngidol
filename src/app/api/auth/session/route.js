// /api/auth/session/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const { id, role } = decoded;

    const user = await prisma[role].findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user, role });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
