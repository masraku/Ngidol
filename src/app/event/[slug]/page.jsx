import EventDetailClient from '@/components/EventDetailClient';
import axios from 'axios';

export async function generateMetadata({ params }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.muchitsujo.site';
    const res = await axios.get(`${baseUrl}/api/event/${params.slug}`);
    const event = res.data;

    const imageUrl = event.photos?.[0]?.startsWith('http')
      ? event.photos[0]
      : `${baseUrl}/assets/logo.svg`; // fallback kalau tidak ada foto

    return {
      title: `${event.name} | EventKu`,
      description: `${event.location} - ${event.time}`,
      openGraph: {
        title: `${event.name} | EventKu`,
        description: `${event.location} - ${event.time}`,
        url: `${baseUrl}/event/${params.slug}`,
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
        title: `${event.name} | EventKu`,
        description: `${event.location} - ${event.time}`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('[Metadata Error]', error);
    return {
      title: 'Event Tidak Ditemukan',
      description: 'Event yang Anda cari tidak ditemukan',
    };
  }
}


export default async function EventDetailPage({ params }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.muchitsujo.site/';
    const res = await axios.get(`${baseUrl}/api/event/${params.slug}`);
    const event = res.data;

    return <EventDetailClient event={event} />;
  } catch (error) {
    return (
      <div className="container py-5 text-center">
        <h2>Event tidak ditemukan</h2>
        <p>Maaf, event yang Anda cari tidak ditemukan.</p>
      </div>
    );
  }
}
