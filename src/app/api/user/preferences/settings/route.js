import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getUserFromToken() {
  try {
    const token = cookies().get('token');
    if (!token) return null;
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (decoded.role !== 'user') return null;
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function PUT(req) {
  const userToken = await getUserFromToken();
  if (!userToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { emailNotifications, eventReminders } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userToken.id },
      data: {
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(eventReminders !== undefined && { eventReminders }),
      },
      select: {
        emailNotifications: true,
        eventReminders: true,
      },
    });

    return NextResponse.json({
      message: 'Pengaturan berhasil diperbarui',
      settings: updatedUser,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal update pengaturan' }, { status: 500 });
  }
}
