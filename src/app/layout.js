import { Inter } from 'next/font/google';
import '@/style/globals.css';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EventKu - Platform Event Terbaik',
  description: 'Temukan event menarik di seluruh Indonesia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}