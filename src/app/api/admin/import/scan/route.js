import { NextResponse } from 'next/server';
import { scanImportUrl } from '@/lib/importScanner';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req) {
  try {
    const body = await req.json();
    const type = body?.type === 'idol' ? 'idol' : 'event';
    const urls = Array.isArray(body?.urls) ? body.urls : [];
    const uniqueUrls = [...new Set(urls.map((url) => String(url).trim()).filter(Boolean))].slice(0, 8);

    if (uniqueUrls.length === 0) {
      return NextResponse.json({ error: 'Minimal masukkan satu URL' }, { status: 400 });
    }

    const results = await Promise.all(
      uniqueUrls.map(async (url) => {
        try {
          return await scanImportUrl(url, type);
        } catch (error) {
          return {
            ok: false,
            type,
            sourceUrl: url,
            error: error.message || 'Gagal scan URL',
          };
        }
      })
    );

    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Gagal menjalankan scanner' },
      { status: 500 }
    );
  }
}
