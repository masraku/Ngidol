import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Hindari Edge Runtime karena kita pakai cookies + prisma
export const dynamic = 'force-dynamic';

function getUserFromToken() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) return null;

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (decoded.role !== 'user') return null; // hanya user, bukan admin

    return decoded;
  } catch (err) {
    console.error('[SESSION] JWT Error:', err.message);
    return null;
  }
}

export async function GET() {
  console.log('[GET] Memuat preferensi user');

  const userToken = getUserFromToken();
  if (!userToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userToken.id },
      include: {
        favoriteCategories: true,
        favoriteIdols: {
          include: { category: true },
        },
        favoriteMembers: {
          include: {
            idol: { include: { category: true } },
          },
        },
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
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memuat preferensi' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  console.log('[PUT] Memproses preferensi user');

  const userToken = getUserFromToken();
  if (!userToken) {
    console.warn('[PUT] Session null. Kemungkinan user belum login atau cookie hilang.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      categoryIds,
      idolIds,
      memberIds,
      emailNotifications,
      eventReminders,
    } = body;

    console.log('[PUT] Body:', body);

    const user = await prisma.user.findUnique({
      where: { id: userToken.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validasi wajib
    if (!categoryIds || categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Minimal satu kategori harus dipilih' },
        { status: 400 }
      );
    }

    const validCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (validCategories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: 'Beberapa kategori tidak valid' },
        { status: 400 }
      );
    }

    if (idolIds?.length) {
      const validIdols = await prisma.idol.findMany({
        where: { id: { in: idolIds } },
      });

      if (validIdols.length !== idolIds.length) {
        return NextResponse.json(
          { error: 'Beberapa idol tidak valid' },
          { status: 400 }
        );
      }
    }

    if (memberIds?.length) {
      const validMembers = await prisma.member.findMany({
        where: { id: { in: memberIds } },
      });

      if (validMembers.length !== memberIds.length) {
        return NextResponse.json(
          { error: 'Beberapa member tidak valid' },
          { status: 400 }
        );
      }
    }

    const updateData = {
      favoriteCategories: { set: categoryIds.map((id) => ({ id })) },
    };

    if (idolIds !== undefined) {
      updateData.favoriteIdols = { set: idolIds.map((id) => ({ id })) };
    }

    if (memberIds !== undefined) {
      updateData.favoriteMembers = { set: memberIds.map((id) => ({ id })) };
    }

    if (emailNotifications !== undefined) {
      updateData.emailNotifications = emailNotifications;
    }

    if (eventReminders !== undefined) {
      updateData.eventReminders = eventReminders;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      include: {
        favoriteCategories: true,
        favoriteIdols: true,
        favoriteMembers: {
          include: { idol: true },
        },
      },
    });

    console.log('[PUT] Preferensi berhasil diperbarui untuk', updatedUser.email);

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
