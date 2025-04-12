import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // pastikan path prisma kamu sesuai

export async function GET() {
  try {
    const allEvents = await prisma.event.findMany({
      orderBy: { date: 'desc' }, // urutkan agar yang paling baru di atas
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const archivedEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;
    });

    return NextResponse.json(archivedEvents);
  } catch (error) {
    console.error('Error getting archived events:', error);
    return NextResponse.json({ error: 'Failed to load archived events' }, { status: 500 });
  }
}
