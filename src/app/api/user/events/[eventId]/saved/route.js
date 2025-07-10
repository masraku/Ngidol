//api/user/events/[eventId]/saved/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(_, { params }) {
  const { eventId } = params;

  const token = cookies().get('token');
  console.log('📥 GET /api/user/events/:eventId/saved called with:', eventId);

  if (!token || !eventId) {
    return NextResponse.json({ saved: false });
  }

  const parsedId = parseInt(eventId);
  if (isNaN(parsedId)) {
    return NextResponse.json({ saved: false }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    if (decoded.role !== 'user') {
      return NextResponse.json({ saved: false });
    }

    const saved = await prisma.event.findFirst({
      where: {
        id: parsedId,
        savedByUsers: {
          some: { id: decoded.id },
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ saved: !!saved });
  } catch (err) {
    console.error('Error checking saved event:', err);
    return NextResponse.json({ saved: false });
  }
}

