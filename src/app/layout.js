import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/style/globals.css';
import BootstrapClient from '@/components/BootstrapClient';
import { AuthProvider } from '@/app/user/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Muchitsujo - Komunitas Idol & Event',
  description: 'Komunitas untuk menemukan jadwal event idol, kegiatan komunitas, chant, dan arsip skena lokal.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <BootstrapClient />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
