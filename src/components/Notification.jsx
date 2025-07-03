'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/notification')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(Array.isArray(data.data) ? data.data : []);
      })
      .catch((err) => console.error('Gagal ambil notifikasi', err));
  }, []);

  return (
    <div className="notification-wrapper relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow z-50">
          <div className="p-3 border-b font-semibold">Notifikasi</div>
          {notifications.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">Tidak ada notifikasi</div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 10).map((n) => (
                <li key={n.id} className="p-3 hover:bg-gray-100 text-sm border-b">
                  <Link href={n.link} className="block text-blue-600">
                    {n.message}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
