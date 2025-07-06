import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

function getUserIdFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) return null;

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

export async function POST(_, { params }) {
  try {
    const userId = getUserIdFromToken();
    const eventId = parseInt(params.eventId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.user.findFirst({
      where: {
        id: userId,
        savedEvents: {
          some: { id: eventId }
        }
      }
    });

    if (existing) {
      return NextResponse.json({ message: 'Event sudah disimpan sebelumnya' }, { status: 200 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        savedEvents: {
          connect: { id: eventId }
        }
      }
    });

    return NextResponse.json({ message: 'Event berhasil disimpan' }, { status: 200 });
  } catch (error) {
    console.error('Error saving event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const userId = getUserIdFromToken();
    const eventId = parseInt(params.eventId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        savedEvents: {
          disconnect: { id: eventId }
        }
      }
    });

    return NextResponse.json({ message: 'Event berhasil dihapus dari simpanan' }, { status: 200 });
  } catch (error) {
    console.error('Error unsaving event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(_, { params }) {
  try {
    const userId = getUserIdFromToken();
    const eventId = parseInt(params.eventId);

    if (!userId) {
      return NextResponse.json({ saved: false }, { status: 200 });
    }

    const existing = await prisma.user.findFirst({
      where: {
        id: userId,
        savedEvents: {
          some: { id: eventId }
        }
      }
    });

    return NextResponse.json({ saved: !!existing }, { status: 200 });
  } catch (error) {
    console.error('Error checking saved event:', error);
    return NextResponse.json({ saved: false }, { status: 200 });
  }
}
