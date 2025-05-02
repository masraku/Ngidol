// app/page.jsx
import axios from 'axios';
import EventList from '@/components/EventList';
import Maintenance from '@/components/Maintenance';

export const metadata = {
  title: 'Muchitsujo Event',
  description: 'Temukan event menarik yang akan datang di Muchitsujo Event',
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
