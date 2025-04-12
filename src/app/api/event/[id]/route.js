import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // pastikan file ini sudah ada

export async function GET(req, { params }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 });
  }

  try {
    const event = await prisma.Event.findUnique({
      where: { id: parseInt(params.id) },
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
    const { id } = params; // mendapatkan id dari URL parameter
    const body = await req.json(); // mendapatkan data dari request body
    const categoryName = body.category; // kategori event, jika ada

    // Persiapkan data yang akan diupdate
    const updateData = {
      name: body.name,
      time: body.time,
      location: body.location,
      htm: body.htm,
      link: body.link,
      guest: body.guest,
      photos: body.photos,
    };

    // Validasi dan ubah 'date' menjadi array, jika belum
    if (Array.isArray(body.date)) {
      // Jika 'date' sudah array, pastikan tanggalnya valid
      const validDates = body.date.filter(dateStr => {
        const d = new Date(dateStr);
        return !isNaN(d.getTime()); // pastikan tanggal valid
      });
      if (validDates.length > 0) {
        updateData.date = validDates;
      } else {
        return NextResponse.json({ message: 'Tidak ada tanggal yang valid' }, { status: 400 });
      }
    } else if (body.date) {
      // Jika 'date' tidak dalam bentuk array, kita coba ubah jadi array satu tanggal
      const d = new Date(body.date);
      if (!isNaN(d.getTime())) {
        updateData.date = [body.date]; // jadikan array
      } else {
        return NextResponse.json({ message: 'Tanggal tidak valid' }, { status: 400 });
      }
    }

    // Jika kategori ada, hubungkan dengan kategori yang ada
    if (categoryName) {
      updateData.Category = {
        connect: { name: categoryName }
      };
    }

    // Update event di database
    const updatedEvent = await prisma.Event.update({
      where: { id: parseInt(id) }, // mencari event berdasarkan ID
      data: updateData, // data yang akan diupdate
    });

    return NextResponse.json({ message: "Berhasil update event", data: updatedEvent });
  } catch (error) {
    console.error("Gagal update event:", error);
    return NextResponse.json({ message: "Gagal update event", error: error.message }, { status: 500 });
  }
}

