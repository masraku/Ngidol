import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
    try {
      const formData = await req.formData();
      const name = formData.get('name');
      const time = formData.get('time');
      const location = formData.get('location');
      const link = formData.get('link');
      const category = formData.get('category');
      const htm = formData.get('htm');
      const guestRaw = formData.get('guest');
      const dateRaw = formData.get('date'); // JSON.stringify([...dates])
      const photos = formData.getAll('photos');
  
      if (!name || !dateRaw || !time || !location || !category || !htm || !guestRaw) {
        return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
      }
  
      // Parse tanggal
      let dateArray;
      try {
        const parsed = JSON.parse(dateRaw);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return NextResponse.json({ message: 'Tanggal tidak valid atau kosong' }, { status: 400 });
        }
        dateArray = parsed.map((d) => new Date(d));
      } catch (err) {
        return NextResponse.json({ message: 'Format tanggal tidak valid' }, { status: 400 });
      }
  
      // Parse guest
      let guest = [];
      try {
        guest = JSON.parse(guestRaw);
      } catch (err) {
        return NextResponse.json({ message: 'Format guest tidak valid' }, { status: 400 });
      }
  
      // Validasi kategori
      const foundCategory = await prisma.category.findUnique({
        where: { name: category },
      });
  
      if (!foundCategory) {
        return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 400 });
      }
  
      // Upload foto
      const uploadedPhotos = [];
  
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `public/event/${fileName}`;
  
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event')
          .upload(filePath, photo, {
            cacheControl: '3600',
            upsert: false,
          });
  
        if (uploadError) {
          return NextResponse.json({ message: uploadError.message }, { status: 500 });
        }
  
        const { data: urlData, error: urlError } = supabase.storage
          .from('event')
          .getPublicUrl(uploadData.path);
  
        if (urlError) {
          return NextResponse.json({ message: urlError.message }, { status: 500 });
        }
  
        uploadedPhotos.push(urlData.publicUrl);
      }
  
      // Simpan ke database
      const newEvent = await prisma.event.create({
        data: {
          name,
          date: dateArray, // array of Date
          time,
          location,
          guest,
          link,
          htm,
          photos: uploadedPhotos,
          Category: {
            connect: { id: foundCategory.id },
          },
        },
      });
  
      return NextResponse.json(newEvent, { status: 201 });
    } catch (err) {
      console.error('[EVENT API ERROR]', err);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }



export async function GET() {
    try {
        const events = await prisma.Event.findMany({
            orderBy: { date: 'asc' },
            include: {
                Category: true,
            },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error('[GET EVENTS ERROR]', error);
        return NextResponse.json({ error: 'Gagal mengambil data event' }, { status: 500 });
    }
}