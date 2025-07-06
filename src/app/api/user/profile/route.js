import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    if (decoded.role !== 'user') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        favoriteCategories: true,
        favoriteIdols: true,
        favoriteMembers: {
          include: { idol: true }
        },
        savedEvents: {
          include: {
            category: true,
            guests: true
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
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
        favoriteMembers: user.favoriteMembers
      },
      savedEvents: user.savedEvents
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}