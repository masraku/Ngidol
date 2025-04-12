import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
    try {
        const formData = await req.formData();

        const name = formData.get('name');
        const date = formData.get('date');
        const time = formData.get('time');
        const location = formData.get('location');
        const guestRaw = formData.get('guest');
        const category = formData.get('category');
        const htm = formData.get('htm');
        const photos = formData.getAll('photos');

        let guest = [];
        try {
            guest = guestRaw ? JSON.parse(guestRaw) : [];
        } catch (err) {
            console.error('[GUEST PARSE ERROR]', guestRaw);
            return NextResponse.json({ message: 'Invalid guest data' }, { status: 400 });
        }

        if (!photos || photos.length === 0) {
            return NextResponse.json({ message: 'No photos provided' }, { status: 400 });
        }

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

        const newEvent = await prisma.event.create({
            data: {
                name,
                date,
                time,
                location,
                guest,
                category,
                htm,
                photos: uploadedPhotos,
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
      const events = await prisma.event.findMany({
        orderBy: { date: 'asc' },
      });
  
      return NextResponse.json(events);
    } catch (error) {
      console.error('[GET EVENTS ERROR]', error);
      return NextResponse.json({ error: 'Gagal mengambil data event' }, { status: 500 });
    }
  }