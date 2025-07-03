import { headers } from 'next/headers';
import EventDetailClient from '@/components/EventDetailClient';

export async function generateMetadata({ params }) {
  try {
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const res = await fetch(`${protocol}://${host}/api/event/${params.slug}`);
    const event = await res.json();

    const imageUrl = event.photos?.[0]?.startsWith('http')
      ? event.photos[0]
      : `${protocol}://${host}/assets/logo.svg`;

    return {
      title: `${event.name} | Admin Event Detail`,
      description: `${event.location} - ${event.time}`,
      openGraph: {
        title: `${event.name} | Admin Event Detail`,
        description: `${event.location} - ${event.time}`,
        url: `${protocol}://${host}/admin/event/${params.slug}`,
        type: 'website',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: event.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${event.name} | Admin Event Detail`,
        description: `${event.location} - ${event.time}`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('[Metadata Error]', error);
    return {
      title: 'Event Tidak Ditemukan',
      description: 'Event yang Anda cari tidak ditemukan!',
    };
  }
}

export default async function AdminEventDetailPage({ params }) {
  try {
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const res = await fetch(`${protocol}://${host}/api/event/${params.slug}`, {
      cache: 'no-store',
    });
    const event = await res.json();

    return (
      <div className="container py-4">
        <h1 className="mb-4">Detail Event (Admin)</h1>
        <EventDetailClient event={event} isAdmin />
      </div>
    );
  } catch (error) {
    console.error('[Admin Event Detail Page Error]', error);
    return (
      <div className="container py-5 text-center">
        <h2>Event tidak ditemukan</h2>
        <p>Maaf, event yang Anda cari tidak ditemukan.</p>
      </div>
    );
  }
}
