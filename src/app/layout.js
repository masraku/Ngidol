import { Inter } from 'next/font/google';
import '@/style/globals.css';
import BootstrapClient from '@/components/BootstrapClient';
import Navbar from '@/components/Navbar';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EventKu - Platform Event Terbaik',
  description: 'Temukan event menarik di seluruh Indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
        <BootstrapClient />
        {/* <Navbar /> */}
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}