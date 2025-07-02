import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const idols = await prisma.idol.findMany({
      include: {
        members: true,
        songs: true,
        category: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(idols);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil daftar idol' }, { status: 500 });
  }
}
