import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/category - ambil semua kategori
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('[GET CATEGORY ERROR]', error);
        return NextResponse.json({ message: 'Gagal mengambil kategori' }, { status: 500 });
    }
}

// POST /api/category - tambah kategori baru
export async function POST(req) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ message: 'Nama kategori wajib diisi' }, { status: 400 });
        }

        const existing = await prisma.category.findUnique({ where: { name } });

        if (existing) {
            return NextResponse.json({ message: 'Kategori sudah ada' }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: { name },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('[POST CATEGORY ERROR]', error);
        return NextResponse.json({ message: 'Gagal menambahkan kategori' }, { status: 500 });
    }
}
