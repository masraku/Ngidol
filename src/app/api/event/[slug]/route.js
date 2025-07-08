import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseClient as supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from '@/lib/notification';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET /api/event/[slug]
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
            image: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('❌ Gagal GET event:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}

// PUT /api/event/[slug]
export async function PUT(req, { params }) {
  try {
    const slug = params.slug;
    const formData = await req.formData();

    const name = formData.get('name')?.toString();
    const time = formData.get('time')?.toString();
    const location = formData.get('location')?.toString();
    const htm = formData.get('htm')?.toString();
    const link = formData.get('link')?.toString();
    const dateRaw = formData.get('date');
    const categoryName = formData.get('category')?.toString();
    const guestsRaw = formData.get('guest');
    const photos = formData.getAll('photos');

    if (!name || !time || !location || !htm || !dateRaw || !categoryName) {
      return NextResponse.json({ message: 'Data wajib diisi' }, { status: 400 });
    }

    const updateData = { name, time, location, htm, link };

    // Handle date array
    const parsedDates = JSON.parse(dateRaw);
    if (!Array.isArray(parsedDates)) {
      return NextResponse.json({ message: 'Format tanggal salah' }, { status: 400 });
    }
    updateData.date = parsedDates.map(d => new Date(d));

    // Handle kategori
    const category = await prisma.category.findUnique({ where: { name: categoryName } });
    if (!category) {
      return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 400 });
    }
    updateData.categoryId = category.id;

    // Handle guest idol
    if (guestsRaw) {
      const guestList = JSON.parse(guestsRaw);
      if (!Array.isArray(guestList)) {
        return NextResponse.json({ message: 'Format guest salah' }, { status: 400 });
      }

      updateData.guests = {
        set: [],
        connect: guestList.map(g => ({ id: g.id })),
      };
    }

    // Upload photo baru
    const uploadedPhotos = [];
    for (const photo of photos) {
      if (photo && photo.size > 0 && photo.type.startsWith('image/')) {
        const buffer = Buffer.from(await photo.arrayBuffer());
        const filename = `event/${Date.now()}-${uuidv4()}`;
        const { error } = await supabase.storage
          .from('event')
          .upload(filename, buffer, { contentType: photo.type });

        if (error) {
          console.error('❌ Upload foto gagal:', error.message);
          return NextResponse.json({ message: 'Upload foto gagal' }, { status: 500 });
        }

        const photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event/${filename}`;
        uploadedPhotos.push(photoUrl);
      }
    }

    // Jika ada foto baru, timpa semua foto lama
    if (uploadedPhotos.length > 0) {
      updateData.photos = uploadedPhotos;
    }

    const updated = await prisma.event.update({
      where: { slug },
      data: updateData,
      include: {
        category: true,
        guests: { select: { id: true, name: true, image: true } },
      },
    });

    await createNotification({
      message: `Event "${updated.name}" telah diperbarui`,
      type: 'Event',
      link: `/event/${updated.slug}`,
    });

    return NextResponse.json({ message: 'Berhasil update event', data: updated });
  } catch (error) {
    console.error('❌ PUT event error:', error);
    return NextResponse.json({ message: 'Gagal update event', error: error.message }, { status: 500 });
  }
}

// DELETE /api/event/[slug]
export async function DELETE(req, { params }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Slug tidak valid' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true, photos: true },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event tidak ditemukan' }, { status: 404 });
    }

    // Hapus gambar dari Supabase
    const paths = (event.photos || []).map(url => {
      const segments = url.split('/event/');
      return segments[1] ? `event/${segments[1]}` : null;
    }).filter(Boolean);

    if (paths.length > 0) {
      const { error } = await supabase.storage.from('event').remove(paths);
      if (error) console.error('⚠️ Gagal hapus gambar:', error.message);
    }

    await prisma.event.delete({ where: { slug } });

    return NextResponse.json({ message: 'Event berhasil dihapus' });
  } catch (error) {
    console.error('❌ DELETE event error:', error);
    return NextResponse.json({ message: 'Gagal menghapus event', error: error.message }, { status: 500 });
  }
}
