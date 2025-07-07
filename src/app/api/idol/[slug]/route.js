import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseServerClient as supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from '@/lib/notification';

export async function GET(req, { params }) {
  const { slug } = params;

  try {
    const idol = await prisma.idol.findUnique({
      where: { slug },
      include: {
        members: true,
        songs: true,
        category: true,
      },
    });

    if (!idol) {
      return NextResponse.json({ error: 'Idol tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(idol);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data idol' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { slug } = params;
  console.log('📥 PATCH /api/idol/[slug] called with slug:', slug);

  try {
    const formData = await req.formData();

    // --- Get all fields ---
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const newSlug = formData.get('slug')?.toString();
    const imageFile = formData.get('image');
    const categoryIdRaw = formData.get('categoryId')?.toString();

    if (!name || !newSlug) {
      return NextResponse.json({ error: 'Nama dan slug wajib diisi' }, { status: 400 });
    }

    // --- Sosmed ---
    let sosmeds = [];
    try {
      sosmeds = JSON.parse(formData.get('sosmeds') || '[]');
    } catch (e) {
      return NextResponse.json({ error: 'Format sosmed tidak valid' }, { status: 400 });
    }

    // --- Members ---
    let members = [];
    try {
      members = JSON.parse(formData.get('members') || '[]');
    } catch (e) {
      return NextResponse.json({ error: 'Format member tidak valid' }, { status: 400 });
    }

    // --- Songs ---
    let songs = [];
    try {
      songs = JSON.parse(formData.get('songs') || '[]');
    } catch (e) {
      return NextResponse.json({ error: 'Format lagu tidak valid' }, { status: 400 });
    }

    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : null;
    if (categoryIdRaw && isNaN(categoryId)) {
      return NextResponse.json({ error: 'Kategori tidak valid' }, { status: 400 });
    }

    // --- Upload Idol Image if Exists ---
    let imageUrl = null;
    if (imageFile && typeof imageFile.name === 'string') {
      const ext = imageFile.name.split('.').pop();
      const fileName = `idol-${uuidv4()}.${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { error } = await supabase.storage
        .from('idol')
        .upload(fileName, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: imageFile.type,
        });

      if (error) {
        console.error('❌ Gagal upload idol image:', error.message || error);
        return NextResponse.json({ error: 'Gagal upload gambar idol' }, { status: 500 });
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/idol/${fileName}`;
    }

    // --- Update Idol ---
    const updatedIdol = await prisma.idol.update({
      where: { slug },
      data: {
        name,
        slug: newSlug,
        description,
        sosmeds,
        image: imageUrl || undefined,
        categoryId: categoryId || undefined,
      },
    });

    // --- Delete old members and songs (in parallel) ---
    await Promise.all([
      prisma.member.deleteMany({ where: { idolId: updatedIdol.id } }),
      prisma.song.deleteMany({ where: { idolId: updatedIdol.id } }),
    ]);

    // --- Upload Member Images in Parallel ---
    const uploadedMemberImages = await Promise.all(
      members.map(async (m, i) => {
        const memberImageFile = formData.get(`memberImage-${i}`);
        if (memberImageFile && typeof memberImageFile.name === 'string') {
          const ext = memberImageFile.name.split('.').pop();
          const fileName = `member-${uuidv4()}.${ext}`;
          const buffer = Buffer.from(await memberImageFile.arrayBuffer());

          const { error } = await supabase.storage
            .from('idol')
            .upload(fileName, buffer, {
              cacheControl: '3600',
              upsert: false,
              contentType: memberImageFile.type,
            });

          if (error) {
            console.error(`❌ Gagal upload gambar member ${m.name}:`, error.message || error);
            throw new Error(`Gagal upload gambar member: ${m.name}`);
          }

          return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/idol/${fileName}`;
        }

        return m.image || null;
      })
    );

    // --- Create Member Entries ---
    await prisma.member.createMany({
      data: members.map((m, i) => ({
        idolId: updatedIdol.id,
        name: m.name,
        image: uploadedMemberImages[i],
        description: m.description,
        instagram: m.instagram,
        X: m.X,
      })),
    });

    // --- Create Songs ---
    if (songs.length > 0) {
      await prisma.song.createMany({
        data: songs.map((s) => ({
          idolId: updatedIdol.id,
          title: s.title,
          spotifyUrl: s.spotifyUrl,
        })),
      });
    }

    // --- Create Notification ---
    await createNotification({
      message: `Idol "${updatedIdol.name}" telah diperbarui`,
      type: 'Idol',
      link: `/idol/${updatedIdol.slug}`,
    });

    return NextResponse.json({ message: 'Idol berhasil diperbarui' });

  } catch (error) {
    console.error('❌ PATCH /api/idol/[slug] error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat memperbarui idol' }, { status: 500 });
  }
}
