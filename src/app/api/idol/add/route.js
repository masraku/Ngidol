import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseServerClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from '@/lib/notification';

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

    // Parse sosmeds
    let sosmeds = [];
    try {
      sosmeds = JSON.parse(sosmedsRaw || '[]');
    } catch {
      return NextResponse.json({ error: 'Format sosmed tidak valid' }, { status: 400 });
    }

    // Parse members & songs
    let members = [];
    let songs = [];
    try {
      members = JSON.parse(formData.get('members') || '[]');
      songs = JSON.parse(formData.get('songs') || '[]');
    } catch {
      return NextResponse.json({ error: 'Format member atau lagu tidak valid' }, { status: 400 });
    }

    // --- Upload Idol Image ---
    const idolImageName = `idol/${uuidv4()}-${imageFile.name}`;
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const { error: idolUploadError } = await supabaseServerClient.storage
      .from('idol')
      .upload(idolImageName, buffer, {
        contentType: imageFile.type,
      });

    if (idolUploadError) {
      console.error('Upload idol gagal:', idolUploadError);
      return NextResponse.json({ error: 'Gagal upload gambar idol' }, { status: 500 });
    }

    const { data: idolUrlData, error: idolUrlError } = supabaseServerClient.storage
      .from('idol')
      .getPublicUrl(idolImageName);

    if (idolUrlError || !idolUrlData?.publicUrl) {
      return NextResponse.json({ error: 'Gagal mendapatkan URL gambar idol' }, { status: 500 });
    }

    const idolImageUrl = idolUrlData.publicUrl;

    // --- Upload Member Images (paralel) ---
    const uploadedMembers = await Promise.all(
      members.map(async (member, i) => {
        const file = formData.get(`memberImage-${i}`);
        let imageUrl = '';

        if (file && typeof file === 'object' && file.name) {
          const fileName = `member/${uuidv4()}-${file.name}`;
          const fileBuffer = Buffer.from(await file.arrayBuffer());

          const { error: uploadErr } = await supabaseServerClient.storage
            .from('idol')
            .upload(fileName, fileBuffer, { contentType: file.type });

          if (uploadErr) {
            console.error(`Upload member ${member.name} gagal:`, uploadErr);
          } else {
            const { data: urlData } = supabaseServerClient.storage.from('idol').getPublicUrl(fileName);
            imageUrl = urlData?.publicUrl || '';
          }
        }

        return {
          name: member.name,
          image: imageUrl,
          description: member.description || '',
          instagram: member.instagram || null,
          X: member.X || null,
        };
      })
    );

    // --- Simpan ke database ---
    const createdIdol = await prisma.idol.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        sosmeds,
        image: idolImageUrl,
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
      include: {
        members: true,
        songs: true,
      },
    });

    // --- Notifikasi ---
    await createNotification({
      message: `Idol baru "${createdIdol.name}" telah ditambahkan`,
      type: 'Idol',
      link: `/idol/${createdIdol.slug}`,
    });

    return NextResponse.json(createdIdol, { status: 201 });
  } catch (error) {
    console.error('❌ Gagal tambah idol:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
