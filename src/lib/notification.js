import prisma from '@/lib/prisma';

export async function createNotification({ message, type, link }) {
  try {
    await prisma.notification.create({
      data: {
        message,
        type,    
        link,       
        read: false,
      }
    });
  } catch (error) {
    console.error('Gagal membuat notifikasi:', error);
  }
}
