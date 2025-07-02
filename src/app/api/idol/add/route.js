import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import supabase from '@/app/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const slug = formData.get('slug');
    const description = formData.get('description');
    const imageFile = formData.get('image');
    const sosmedsRaw = formData.get('sosmeds');
    const members = JSON.parse(formData.get('members') || '[]');
    const songs = JSON.parse(formData.get('songs') || '[]');

    // Parse sosmeds array
    let sosmeds = [];
    try {
      sosmeds = JSON.parse(sosmedsRaw || '[]');
    } catch (e) {
      return NextResponse.json({ error: 'Format sosmed tidak valid' }, { status: 400 });
    }

    // Validasi wajib
    if (!name || !slug || !description || !imageFile || typeof imageFile !== 'object') {
      return NextResponse.json({ error: 'Field wajib tidak boleh kosong' }, { status: 400 });
    }

    // Cek slug unik
    const existing = await prisma.idol.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 });
    }

    // Upload foto idol ke Supabase
    const idolImageName = `idol/${uuidv4()}-${imageFile.name}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('idol')
      .upload(idolImageName, Buffer.from(arrayBuffer), {
        contentType: imageFile.type,
      });

    if (uploadError) {
      console.error('Upload gagal:', uploadError);
      return NextResponse.json({ error: 'Gagal upload gambar idol' }, { status: 500 });
    }

    const { data: idolImageUrlData } = supabase.storage.from('idol').getPublicUrl(idolImageName);
    const idolImageUrl = idolImageUrlData.publicUrl;

    // Upload gambar member
    const uploadedMembers = await Promise.all(
      members.map(async (member, i) => {
        const file = formData.get(`memberImage-${i}`);
        let imageUrl = '';

        if (file && typeof file === 'object') {
          const fileName = `member/${uuidv4()}-${file.name}`;
          const buffer = await file.arrayBuffer();

          const { error: memberUploadErr } = await supabase.storage
            .from('idol')
            .upload(fileName, Buffer.from(buffer), { contentType: file.type });

          if (memberUploadErr) {
            console.error('Gagal upload foto member:', memberUploadErr);
          } else {
            const { data: urlData } = supabase.storage.from('idol').getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
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

    // Simpan ke database
    const createdIdol = await prisma.idol.create({
      data: {
        name,
        slug,
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
      include: { members: true, songs: true },
    });

    return NextResponse.json(createdIdol, { status: 201 });
  } catch (error) {
    console.error('Gagal tambah idol:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
