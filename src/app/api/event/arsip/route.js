import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const allEvents = await prisma.Event.findMany({
      orderBy: { date: 'desc' }, // urutkan berdasarkan tanggal event
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set waktu hari ini ke tengah malam

    // Filter event yang sudah lewat 1 hari dari tanggal event
    const archivedEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); // Set waktu event ke tengah malam juga
      return eventDate < today; // Hanya ambil event yang sudah lewat (tanggalnya lebih kecil dari hari ini)
    });

    return NextResponse.json(archivedEvents); // Kirim hasil event yang sudah lewat
  } catch (error) {
    console.error('Error getting archived events:', error);
    return NextResponse.json({ error: 'Failed to load archived events' }, { status: 500 });
  }
}
