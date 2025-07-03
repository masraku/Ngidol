'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User, Search } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notification?unread=true');
      const data = await res.json();
      if (Array.isArray(data?.data)) {
        setNotifications(data.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Gagal mengambil notifikasi:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch('/api/notification', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Gagal menandai notifikasi:', error);
    }
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/admin/idol':
        return 'Daftar Idol';
      case '/admin/idol/add':
        return 'Tambah Idol';
      case '/admin/event':
        return 'Daftar Event';
      case '/admin/event/add':
        return 'Tambah Event';
      case '/admin/settings':
        return 'Pengaturan';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h2 className="page-title">{getPageTitle()}</h2>
        </div>

        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Pencarian..."
              className="search-input"
            />
          </div>

          <div className="notification-wrapper" ref={dropdownRef}>
            <button
              className="notification-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <Bell style={{ width: '1.5rem', height: '1.5rem' }} />
              {Array.isArray(notifications) && notifications.length > 0 && (
                <span className="notification-badge" />
              )}
            </button>

            {dropdownOpen && (
              <div className="notification-dropdown">
                <h4>Notifikasi</h4>
                {loading ? (
                  <p className="notif-loading">Memuat notifikasi...</p>
                ) : Array.isArray(notifications) && notifications.length === 0 ? (
                  <p className="notif-empty">Tidak ada notifikasi baru</p>
                ) : (
                  <ul className="notif-list">
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          window.location.href = notif.link;
                        }}
                        className="notif-item"
                      >
                        {notif.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="profile-avatar">
            <User style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
