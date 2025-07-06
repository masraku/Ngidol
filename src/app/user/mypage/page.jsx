// app/user/mypage/page.jsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import MyPageClient from '@/components/MyPage';

export const metadata = {
  title: 'My Page - Event Management',
  description: 'Kelola event tersimpan, preferensi, dan pengaturan akun Anda'
};

export default function MyPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/user/auth');
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (decoded.role !== 'user') {
      redirect('/user/auth'); // hanya user yang bisa akses halaman ini
    }
  } catch (err) {
    console.error('Token error:', err);
    redirect('/user/auth');
  }

  return <MyPageClient />;
}
