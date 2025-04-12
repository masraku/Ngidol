import EventDetailClient from '@/components/EventDetailClient';
import axios from 'axios';


// Metadata dinamis
export async function generateMetadata({ params }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await axios.get(`${baseUrl}/api/event/${params.id}`);
    const event = res.data;

    return {
      title: `${event.name} | EventKu`,
      photo: event.photos,
    };
  } catch (error) {
    return {
      title: 'Event Tidak Ditemukan',
      description: 'Event yang Anda cari tidak ditemukan',
    };
  }
}

// Halaman detail event
export default async function EventDetailPage({ params }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await axios.get(`${baseUrl}/api/event/${params.id}`);
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
