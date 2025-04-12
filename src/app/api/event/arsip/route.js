import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // pastikan path prisma kamu sesuai

export async function GET() {
  try {
    // Fetch all events sorted by date
    const allEvents = await prisma.Event.findMany({
      orderBy: { date: 'desc' }, // Sort to get the latest first
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter events that are more than 1 day past their end date
    const archivedEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      // Check if the event is older than 1 day
      const diffTime = Math.abs(today - eventDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 1;
    });

    return NextResponse.json(archivedEvents);
  } catch (error) {
    console.error('Error getting archived events:', error);
    return NextResponse.json({ error: 'Failed to load archived events' }, { status: 500 });
  }
}
