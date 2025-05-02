// app/page.jsx
import axios from 'axios';
import EventList from '@/components/EventList';
import Maintenance from '@/components/Maintenance';

export const metadata = {
  title: 'Muchitsujo Event',
  openGraph: {
    title: 'Muchitsujo Event',
    description: 'Temukan event menarik yang akan datang di Mikseru',
    url: 'https://muchitsujo.site',
    siteName: 'Muchitsujo Event',
    images: [
      {
        url: '/assets/logo.svg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  description: 'Temukan event menarik yang akan datang di Muchitsujo',
};

export default async function Home() {

  let events = [];

  try {
    const res = await axios.get(`/api/event`);
    events = res.data;
  } catch (error) {
    console.error('Gagal mengambil data events:', error.message);
    // Bisa juga tampilkan fallback UI di sini
  }

  return (
    <main>
      {/* <Maintenance/> */}
      <EventList events={events} />
    </main>
  );
}
