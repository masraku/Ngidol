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
    const { idolIds = [], memberIds = [] } = await req.json();

    const [idolCount, memberCount] = await Promise.all([
      prisma.idol.count({ where: { id: { in: idolIds } } }),
      prisma.member.count({ where: { id: { in: memberIds } } }),
    ]);

    if (idolCount !== idolIds.length) return NextResponse.json({ error: 'Beberapa idol tidak valid' }, { status: 400 });
    if (memberCount !== memberIds.length) return NextResponse.json({ error: 'Beberapa member tidak valid' }, { status: 400 });

    const user = await prisma.user.update({
      where: { id: userToken.id },
      data: {
        favoriteIdols: { set: idolIds.map((id) => ({ id })) },
        favoriteMembers: { set: memberIds.map((id) => ({ id })) },
      },
      include: {
        favoriteIdols: true,
        favoriteMembers: { include: { idol: true } },
      },
    });

    return NextResponse.json({
      message: 'Favorit berhasil diperbarui',
      favoriteIdols: user.favoriteIdols,
      favoriteMembers: user.favoriteMembers,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal update favorit' }, { status: 500 });
  }
}
