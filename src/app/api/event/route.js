import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { supabaseServerClient as supabase } from '@/lib/supabase'; // ✅ pakai server-side supabase
import { createNotification } from '@/lib/notification';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const time = formData.get('time');
    const location = formData.get('location');
    const link = formData.get('link');
    const htm = formData.get('htm');
    const categoryName = formData.get('category');
    const dateRaw = formData.get('date');
    const guestRaw = formData.get('guest');
    const photos = formData.getAll('photos');

    // Parse array field
    const dates = JSON.parse(dateRaw);
    const guests = JSON.parse(guestRaw);

    // Ambil ID kategori
    let categoryId = null;
    if (categoryName) {
      const category = await prisma.category.findUnique({
        where: { name: categoryName },
      });
      if (category) categoryId = category.id;
    }

    // Upload photos ke Supabase
    const uploadedPhotos = [];
    for (const photo of photos) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const filename = `event/${Date.now()}-${uuidv4()}`;
      const { error } = await supabase.storage
        .from('event')
        .upload(filename, buffer, {
          contentType: photo.type,
        });

      if (error) {
        throw new Error('Gagal upload foto');
      }

      const { data: publicUrlData } = supabase.storage.from('event').getPublicUrl(filename);
      uploadedPhotos.push(publicUrlData.publicUrl);
    }

    // Simpan event ke database
    const event = await prisma.event.create({
      data: {
        name,
        slug,
        time,
        location,
        link,
        htm,
        date: dates.map(d => new Date(d)),
        photos: uploadedPhotos,
        categoryId,
        guests: {
          connect: guests.map(g => ({ id: g.id }))
        },
      },
      include: {
        category: true,
        guests: true
      }
    });

    await createNotification({
      message: `Event baru "${event.name}" telah dibuat`,
      type: `Event`,
      link: `/admin/event/${event.slug}`,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('[EVENT API ERROR]', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan saat menambah event' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 6;
    const skip = (page - 1) * limit;

    const total = await prisma.event.count();

    const events = await prisma.event.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        guests: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
    });

    return NextResponse.json({
      message: 'Events retrieved successfully',
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('[GET EVENTS ERROR]', error);
    return NextResponse.json({
      message: 'Gagal mengambil data event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
