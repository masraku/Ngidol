import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';


export async function GET(req, { params }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Slug tidak valid' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        category: true,
        guests: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
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
    const formData = await req.formData();

    const name = formData.get('name');
    const time = formData.get('time');
    const location = formData.get('location');
    const htm = formData.get('htm');
    const link = formData.get('link');
    const dateRaw = formData.get('date');
    const category = formData.get('category');
    const guestsRaw = formData.get('guest');
    const photos = formData.getAll('photos');

    const updateData = {
      name,
      time,
      location,
      htm,
      link,
    };

    // Handle date
    if (dateRaw) {
      const dateArr = JSON.parse(dateRaw);
      if (Array.isArray(dateArr)) {
        const validDates = dateArr.filter(d => !isNaN(new Date(d).getTime()));
        updateData.date = validDates.map(d => new Date(d));
      }
    }

    // Handle category
    if (category) {
      const categoryData = await prisma.category.findUnique({
        where: { name: category }
      });
      if (categoryData) {
        updateData.categoryId = categoryData.id;
      }
    }

    // Handle guests
    if (guestsRaw) {
      const guests = JSON.parse(guestsRaw);
      if (Array.isArray(guests)) {
        updateData.guests = {
          set: [],
          connect: guests.map(g => ({ id: g.id })),
        };
      }
    }

    // Upload foto ke Supabase jika ada
    const uploadedPhotos = [];
    for (const photo of photos) {
      if (photo && photo.size > 0 && photo.type.startsWith('image/')) {
        const buffer = Buffer.from(await photo.arrayBuffer());
        const filename = `event/${Date.now()}-${uuidv4()}`;
        const { data, error } = await supabase.storage
          .from('event')
          .upload(filename, buffer, {
            contentType: photo.type,
          });

        if (error) {
          throw new Error('Gagal upload foto');
        }

        const photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event/${filename}`;
        uploadedPhotos.push(photoUrl);
      }
    }

    if (uploadedPhotos.length > 0) {
      updateData.photos = uploadedPhotos;
    }

    const updatedEvent = await prisma.event.update({
      where: { slug },
      data: updateData,
      include: {
        category: true,
        guests: {
          select: { id: true, name: true, image: true }
        }
      }
    });

    return NextResponse.json({ message: "Berhasil update event", data: updatedEvent });
  } catch (error) {
    console.error("Gagal update event:", error);
    return NextResponse.json({ message: "Gagal update event", error: error.message }, { status: 500 });
  }
}
