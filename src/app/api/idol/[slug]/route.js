import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { categories } from '@/data/events';

export async function GET(req, { params }) {
  const { slug } = params;

  try {
    const idol = await prisma.idol.findUnique({
      where: { slug },
      include: {
        members: true,
        songs: true,
        category: true,
      },
    });

    if (!idol) {
      return NextResponse.json({ error: 'Idol tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(idol);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data idol' }, { status: 500 });
  }
}
