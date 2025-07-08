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
    const { categoryIds } = await req.json();

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json({ error: 'Minimal satu kategori harus dipilih' }, { status: 400 });
    }

    const valid = await prisma.category.count({ where: { id: { in: categoryIds } } });
    if (valid !== categoryIds.length) {
      return NextResponse.json({ error: 'Beberapa kategori tidak valid' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userToken.id },
      data: {
        favoriteCategories: {
          set: categoryIds.map((id) => ({ id })),
        },
      },
      include: { favoriteCategories: true },
    });

    return NextResponse.json({ message: 'Kategori diperbarui', favoriteCategories: user.favoriteCategories });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal update kategori' }, { status: 500 });
  }
}
