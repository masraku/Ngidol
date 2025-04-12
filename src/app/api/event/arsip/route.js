import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // pastikan path prisma kamu sesuai

export async function GET() {
  try {
    // Fetch all events sorted by date (descending order)
    const allEvents = await prisma.Event.findMany({
      orderBy: { date: 'desc' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight for accurate comparison

    // Filter events that have already passed (i.e., event date is before today)
    const archivedEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); // Set event date to midnight for accurate comparison
      return eventDate < today; // Only archive if the event date is before today
    });

    return NextResponse.json(archivedEvents); // Return archived events as JSON
  } catch (error) {
    console.error('Error getting archived events:', error);
    return NextResponse.json({ error: 'Failed to load archived events' }, { status: 500 });
  }
}
