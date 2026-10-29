import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    return NextResponse.json({ total: users.length });
  } catch (error) {
    console.error('Gagal mengambil user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
