import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommunityHome from '@/components/CommunityHome';

export const metadata = {
  title: 'Muchitsujo - Komunitas Idol & Event',
  description: 'Komunitas idol dengan jadwal event, kegiatan komunitas, chant, dan database idoru.',
  keywords: ['event', 'konser', 'cosplay', 'idoru', 'muchitsujo'],
  authors: [{ name: 'Muchitsujo Team' }],
  openGraph: {
    title: 'Muchitsujo - Komunitas Idol & Event',
    description: 'Komunitas idol dengan jadwal event, kegiatan komunitas, chant, dan database idoru.',
    url: 'https://muchitsujo.site',
    type: 'website',
    images: [
      {
        url: 'https://muchitsujo.site/assets/Muchitsujo.png',
        width: 1200,
        height: 630,
        alt: 'Muchitsujo Event',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muchitsujo - Komunitas Idol & Event',
    description: 'Komunitas idol dengan jadwal event, kegiatan komunitas, chant, dan database idoru.',
    images: ['https://muchitsujo.site/assets/Muchitsujo.png'],
  },
  icons: {
    icon: '/assets/Muchitsujo.png',
  },
  metadataBase: new URL('https://muchitsujo.site'),
};

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="public-shell">
        <CommunityHome />
      </div>
      <Footer />
    </>
  );
}
