import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Slug tidak valid' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: { Category: true },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Gagal fetch event detail:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const slug = params.slug;
    const body = await req.json();
    const categoryName = body.category;

    const updateData = {
      name: body.name,
      time: body.time,
      location: body.location,
      htm: body.htm,
      link: body.link,
      guest: body.guest,
      photos: body.photos,
    };

    // Validasi dan parsing tanggal
    if (Array.isArray(body.date)) {
      const validDates = body.date.filter(dateStr => !isNaN(new Date(dateStr).getTime()));
      if (validDates.length > 0) {
        updateData.date = validDates;
      } else {
        return NextResponse.json({ message: 'Tidak ada tanggal yang valid' }, { status: 400 });
      }
    } else if (body.date) {
      const d = new Date(body.date);
      if (!isNaN(d.getTime())) {
        updateData.date = [body.date];
      } else {
        return NextResponse.json({ message: 'Tanggal tidak valid' }, { status: 400 });
      }
    }

    // Update kategori jika ada
    if (categoryName) {
      updateData.Category = {
        connect: { name: categoryName },
      };
    }

    const updatedEvent = await prisma.event.update({
      where: { slug },
      data: updateData,
    });

    return NextResponse.json({ message: "Berhasil update event", data: updatedEvent });
  } catch (error) {
    console.error("Gagal update event:", error);
    return NextResponse.json({ message: "Gagal update event", error: error.message }, { status: 500 });
  }
}
