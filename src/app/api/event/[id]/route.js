import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // pastikan file ini sudah ada

export async function GET(req, { params }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
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
    const { id } = params;
    const body = await req.json(); 
    const categoryName = body.category;

    const updateData = {
      name: body.name,
      date: body.date,
      time: body.time,
      location: body.location,
      htm: body.htm,
      guest: body.guest,
      photos: body.photos,
    };
    
    if (categoryName) {
      updateData.Category = {
        connect: { name: categoryName }
      };
    }
    
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return Response.json({ message: "Berhasil update event", data: updatedEvent });
  } catch (error) {
    console.error("Gagal update event:", error);
    return Response.json({ message: "Gagal update event", error: error.message }, { status: 500 });
  }
}
