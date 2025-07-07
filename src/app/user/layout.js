import { Inter } from 'next/font/google';
import '@/style/globals.css';
import '@/style/Event.css'
import '@/style/MyPage.css';
import Head from 'next/head';
import BootstrapClient from '@/components/BootstrapClient';
import Navbar from '@/components/Navbar';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Muchitsujo ',
  description: 'Gabut? Bingung weekend mau ke mana? semua event seru ada di sini.',
};

export default function UserLayout({ children }) {
  return (
    <html lang="id">
      <Head>
        <link rel="icon" href="/assets/muchit.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Gabut? Bingung weekend mau ke mana? semua event seru ada di sini." />
        <meta name="keywords" content="event, konser, cosplay, idoru, muchitsujo" />
        <meta name="author" content="Muchitsujo Team" />
        <meta property="og:title" content="Muchitsujo Event" />
        <meta property="og:description" content="Gabut? Bingung weekend mau ke mana? semua event seru ada di sini." />
        <meta property="og:image" content="/assets/muchit.svg" />
        <meta property="og:url" content="https://muchitsujo.site" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Muchitsujo Event" />
        <meta name="twitter:description" content="Gabut? Bingung weekend mau ke mana? semua event seru ada di sini." />
        <meta name="twitter:image" content="/assets/muchit.svg" />
      </Head>
      <body className={inter.className}>
        <AuthProvider>
        <BootstrapClient />
        <Navbar />
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}