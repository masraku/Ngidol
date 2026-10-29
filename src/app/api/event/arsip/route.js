import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allEvents = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        guests: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const archivedEvents = allEvents.filter(event => {
      if (!Array.isArray(event.date) || event.date.length === 0) return false;

      return event.date.every((dateValue) => {
        const eventDate = new Date(dateValue);
        if (Number.isNaN(eventDate.getTime())) return false;
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
      });
    });

    return NextResponse.json(archivedEvents);
  } catch (error) {
    console.error('Error getting archived events:', error);
    return NextResponse.json({ error: 'Failed to load archived events' }, { status: 500 });
  }
}
