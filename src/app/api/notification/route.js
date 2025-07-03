import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: /api/notification?unread=true
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const notifications = await prisma.notification.findMany({
      where: unreadOnly ? { read: false } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({data: notifications}, { status: 200 });
  } catch (error) {
    console.error('[GET NOTIFICATIONS ERROR]', error);
    return NextResponse.json({ message: 'Gagal mengambil notifikasi' }, { status: 500 });
  }
}

// POST: Tambah notifikasi baru
export async function POST(req) {
  try {
    const body = await req.json();
    const { type, message, link } = body;

    if (!type || !message || !link) {
      return NextResponse.json({ message: 'Field wajib tidak boleh kosong' }, { status: 400 });
    }

    const newNotif = await prisma.notification.create({
      data: {
        type,
        message,
        link,
      },
    });

    return NextResponse.json(newNotif, { status: 201 });
  } catch (error) {
    console.error('[CREATE NOTIFICATION ERROR]', error);
    return NextResponse.json({ message: 'Gagal membuat notifikasi' }, { status: 500 });
  }
}

// PATCH: Tandai notifikasi sebagai sudah dibaca
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });
      return NextResponse.json({ message: 'Semua notifikasi ditandai telah dibaca' });
    }

    if (!id) {
      return NextResponse.json({ message: 'ID notifikasi diperlukan' }, { status: 400 });
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json({ message: 'Notifikasi ditandai telah dibaca' });
  } catch (error) {
    console.error('[PATCH NOTIFICATION ERROR]', error);
    return NextResponse.json({ message: 'Gagal update notifikasi' }, { status: 500 });
  }
}
