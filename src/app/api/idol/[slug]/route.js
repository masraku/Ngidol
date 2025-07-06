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

    // Debug log formData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`📝 ${key}: [FILE] ${value.name}`);
      } else {
        console.log(`📝 ${key}:`, value);
      }
    }

    const name = formData.get('name');
    const description = formData.get('description');
    const newSlug = formData.get('slug');
    const imageFile = formData.get('image');

    // Parse sosmed
    let sosmeds = [];
    try {
      sosmeds = JSON.parse(formData.get('sosmeds') || '[]');
    } catch (e) {
      console.error('❌ Gagal parse sosmeds:', e);
      return NextResponse.json({ error: 'Format sosmed tidak valid' }, { status: 400 });
    }

    // Parse members
    let members = [];
    try {
      members = JSON.parse(formData.get('members') || '[]');
    } catch (e) {
      console.error('❌ Gagal parse members:', e);
      return NextResponse.json({ error: 'Format member tidak valid' }, { status: 400 });
    }

    // Parse songs
    let songs = [];
    try {
      songs = JSON.parse(formData.get('songs') || '[]');
    } catch (e) {
      console.error('❌ Gagal parse songs:', e);
      return NextResponse.json({ error: 'Format lagu tidak valid' }, { status: 400 });
    }

    // Parse categoryId
    const categoryIdRaw = formData.get('categoryId');
    const categoryId = categoryIdRaw && categoryIdRaw !== '' ? parseInt(categoryIdRaw, 10) : null;
    if (categoryIdRaw && isNaN(categoryId)) {
      console.error('❌ categoryId tidak valid:', categoryIdRaw);
      return NextResponse.json({ error: 'Kategori tidak valid' }, { status: 400 });
    }

    // Upload idol image jika ada
    let imageUrl = null;
    if (imageFile && typeof imageFile.name === 'string') {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `idol-${uuidv4()}.${fileExt}`;
      const arrayBuffer = await imageFile.arrayBuffer();

      const { error } = await supabase.storage
        .from('idol')
        .upload(fileName, Buffer.from(arrayBuffer), {
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

    // Update idol
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

    // Hapus member dan tambah ulang
    await prisma.member.deleteMany({ where: { idolId: updatedIdol.id } });

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      let image = m.image;

      const memberImageFile = formData.get(`memberImage-${i}`);
      if (memberImageFile && typeof memberImageFile.name === 'string') {
        const ext = memberImageFile.name.split('.').pop();
        const fileName = `member-${uuidv4()}.${ext}`;
        const buffer = await memberImageFile.arrayBuffer();

        const { error } = await supabase.storage
          .from('idol')
          .upload(fileName, Buffer.from(buffer), {
            cacheControl: '3600',
            upsert: false,
            contentType: memberImageFile.type,
          });

        if (error) {
          console.error(`❌ Gagal upload gambar member ${m.name}:`, error.message || error);
          return NextResponse.json({ error: `Gagal upload gambar member: ${m.name}` }, { status: 500 });
        }

        image = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/idol/${fileName}`;
      }

      await prisma.member.create({
        data: {
          idolId: updatedIdol.id,
          name: m.name,
          image,
          description: m.description,
          instagram: m.instagram,
          X: m.X,
        },
      });
    }

    // Hapus dan tambah ulang lagu
    await prisma.song.deleteMany({ where: { idolId: updatedIdol.id } });

    for (let s of songs) {
      await prisma.song.create({
        data: {
          idolId: updatedIdol.id,
          title: s.title,
          spotifyUrl: s.spotifyUrl,
        },
      });
    }

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
