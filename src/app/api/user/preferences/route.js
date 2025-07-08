import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getUserFromToken() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    if (!token) return null;

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (decoded.role !== 'user') return null;
    return decoded;
  } catch (err) {
    console.error('[SESSION] JWT Error:', err.message);
    return null;
  }
}

export async function GET() {
  const userToken = await getUserFromToken();
  if (!userToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userToken.id },
      include: {
        favoriteCategories: true,
        favoriteIdols: { include: { category: true } },
        favoriteMembers: { include: { idol: { include: { category: true } } } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailNotifications: user.emailNotifications,
        eventReminders: user.eventReminders,
        favoriteCategories: user.favoriteCategories,
        favoriteIdols: user.favoriteIdols,
        favoriteMembers: user.favoriteMembers,
      },
    });
  } catch (error) {
    console.error('[GET] Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat memuat preferensi' }, { status: 500 });
  }
}

export async function PUT(req) {
  const userToken = await getUserFromToken();
  if (!userToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      categoryIds,
      idolIds,
      memberIds,
      emailNotifications,
      eventReminders,
    } = await req.json();

    if (!categoryIds || categoryIds.length === 0) {
      return NextResponse.json({ error: 'Minimal satu kategori harus dipilih' }, { status: 400 });
    }

    // ✅ Gunakan prisma.count untuk validasi cepat
    const [catCount, idolCount, memberCount] = await Promise.all([
      prisma.category.count({ where: { id: { in: categoryIds } } }),
      idolIds?.length ? prisma.idol.count({ where: { id: { in: idolIds } } }) : Promise.resolve(0),
      memberIds?.length ? prisma.member.count({ where: { id: { in: memberIds } } }) : Promise.resolve(0),
    ]);

    if (catCount !== categoryIds.length) {
      return NextResponse.json({ error: 'Beberapa kategori tidak valid' }, { status: 400 });
    }
    if (idolIds?.length && idolCount !== idolIds.length) {
      return NextResponse.json({ error: 'Beberapa idol tidak valid' }, { status: 400 });
    }
    if (memberIds?.length && memberCount !== memberIds.length) {
      return NextResponse.json({ error: 'Beberapa member tidak valid' }, { status: 400 });
    }

    const updateData = {
      favoriteCategories: { set: categoryIds.map((id) => ({ id })) },
      ...(idolIds !== undefined && { favoriteIdols: { set: idolIds.map((id) => ({ id })) } }),
      ...(memberIds !== undefined && { favoriteMembers: { set: memberIds.map((id) => ({ id })) } }),
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(eventReminders !== undefined && { eventReminders }),
    };

    const updatedUser = await prisma.user.update({
      where: { id: userToken.id },
      data: updateData,
      include: {
        favoriteCategories: true,
        favoriteIdols: true,
        favoriteMembers: { include: { idol: true } },
      },
    });

    return NextResponse.json({
      message: 'Preferensi berhasil diperbarui',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailNotifications: updatedUser.emailNotifications,
        eventReminders: updatedUser.eventReminders,
        favoriteCategories: updatedUser.favoriteCategories,
        favoriteIdols: updatedUser.favoriteIdols,
        favoriteMembers: updatedUser.favoriteMembers,
      },
    });
  } catch (error) {
    console.error('[PUT] Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui preferensi' },
      { status: 500 }
    );
  }
}
