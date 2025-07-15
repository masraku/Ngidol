import axios from 'axios';
import EventList from '@/components/EventList';
import Maintenance from '@/components/Maintenance';

export const metadata = {
  title: 'Muchitsujo Event',
  description: 'Gabut? Bingung weekend mau ke mana? semua event seru ada di sini.',
  keywords: ['event', 'konser', 'cosplay', 'idoru', 'muchitsujo'],
  authors: [{ name: 'Muchitsujo Team' }],
  openGraph: {
    title: 'Muchitsujo Event',
    description: 'Gabut? Bingung weekend mau ke mana? semua event seru ada di sini.',
    url: 'https://muchitsujo.site',
    type: 'website',
    images: [
      {
        url: 'https://muchitsujo.site/assets/muchit.svg',
        width: 1200,
        height: 630,
        alt: 'Muchitsujo Event',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muchitsujo Event',
    description: 'Gabut? Bingung weekend mau ke mana? semua event seru ada di sini.',
    images: ['https://muchitsujo.site/assets/muchit.svg'],
  },
  icons: {
    icon: '/assets/muchit.svg',
  },
  metadataBase: new URL('https://muchitsujo.site'),
};

export default async function Home() {
  let events = [];

  try {
    const res = await axios.get(`/api/event`);
    events = res.data;
  } catch (error) {
    console.error('Gagal mengambil data events:', error.message);
  }

  return (
    <main>
      {/* <Maintenance /> */}
      <EventList events={events} />
    </main>
  );
}
