import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseServerClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from '@/lib/notification';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name')?.toString();
    const slug = formData.get('slug')?.toString();
    const description = formData.get('description')?.toString();
    const imageFile = formData.get('image');
    const sosmedsRaw = formData.get('sosmeds')?.toString();
    const categoryIdRaw = formData.get('categoryId')?.toString();

    const categoryId = parseInt(categoryIdRaw, 10);
    if (!categoryId || isNaN(categoryId)) {
      return NextResponse.json({ error: 'Kategori wajib dipilih' }, { status: 400 });
    }

    if (!name || !slug || !description || !imageFile || typeof imageFile !== 'object') {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    // Cek slug unik
    const existing = await prisma.idol.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 });
    }

    // Parse sosial media
    let sosmeds = [];
    try {
      sosmeds = JSON.parse(sosmedsRaw || '[]');
    } catch {
      return NextResponse.json({ error: 'Format sosmed tidak valid' }, { status: 400 });
    }

    let members = [];
    let songs = [];
    try {
      members = JSON.parse(formData.get('members') || '[]');
      songs = JSON.parse(formData.get('songs') || '[]');
    } catch {
      return NextResponse.json({ error: 'Format member atau lagu tidak valid' }, { status: 400 });
    }

    // Upload Idol Image
    const idolFileName = `idol/${uuidv4()}-${imageFile.name}`;
    const idolBuffer = Buffer.from(await imageFile.arrayBuffer());

    const { error: idolUploadError } = await supabaseServerClient.storage
      .from('idol')
      .upload(idolFileName, idolBuffer, { contentType: imageFile.type });

    if (idolUploadError) {
      console.error('❌ Upload idol gagal:', idolUploadError.message);
      return NextResponse.json({ error: 'Gagal upload gambar idol' }, { status: 500 });
    }

    const idolImageUrl = supabaseServerClient.storage
      .from('idol')
      .getPublicUrl(idolFileName).data?.publicUrl;

    // Upload member images in parallel
    const uploadedMembers = await Promise.all(
      members.map(async (member, i) => {
        let image = '';
        const file = formData.get(`memberImage-${i}`);
        if (file && typeof file === 'object') {
          const filename = `member/${uuidv4()}-${file.name}`;
          const buffer = Buffer.from(await file.arrayBuffer());

          const { error } = await supabaseServerClient.storage
            .from('idol')
            .upload(filename, buffer, { contentType: file.type });

          if (error) {
            console.error(`⚠️ Gagal upload member ${member.name}:`, error.message);
          } else {
            image = supabaseServerClient.storage
              .from('idol')
              .getPublicUrl(filename).data?.publicUrl || '';
          }
        }

        return {
          name: member.name,
          image,
          description: member.description || '',
          instagram: member.instagram || null,
          X: member.X || null,
        };
      })
    );

    // Simpan ke DB
    const created = await prisma.idol.create({
      data: {
        name,
        slug,
        description,
        image: idolImageUrl,
        sosmeds,
        categoryId,
        members: {
          create: uploadedMembers,
        },
        songs: {
          create: songs.map((s) => ({
            title: s.title,
            spotifyUrl: s.spotifyUrl,
          })),
        },
      },
      include: { members: true, songs: true },
    });

    // Kirim notifikasi
    await createNotification({
      message: `Idol baru "${created.name}" telah ditambahkan`,
      type: 'Idol',
      link: `/idol/${created.slug}`,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/idol error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
