// app/page.jsx
import axios from 'axios';
import EventList from '@/components/EventList';

export const metadata = {
  title: 'Mikseru - Jadwal Event',
  description: 'Temukan event menarik yang akan datang di Mikseru',
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
      <EventList events={events} />
    </main>
  );
}
