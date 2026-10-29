import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Muchitsujo - Komunitas Idol & Event',
  description: 'Gabut? Bingung weekend mau ke mana? Semua agenda idol dan kegiatan komunitas ada di sini.',
};

export default function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="public-shell">
        {children}
      </div>
      <Footer />
    </>
  );
}
