import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nama kategori wajib diisi' }, { status: 400 });
    }

    // Cek apakah kategori sudah ada
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: 'Kategori sudah ada' }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (err) {
    console.error('Gagal tambah kategori:', err);
    return NextResponse.json({ error: 'Gagal tambah kategori' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }, // opsional: urutkan berdasarkan nama
    });

    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (err) {
    console.error('Gagal fetch kategori:', err);
    return NextResponse.json({ error: 'Gagal fetch kategori' }, { status: 500 });
  }
}