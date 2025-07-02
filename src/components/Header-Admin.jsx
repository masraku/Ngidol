'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User, Search } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();

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
          <h2 className="page-title">
            {getPageTitle()}
          </h2>
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
          <button className="notification-btn">
            <Bell style={{width: '1.5rem', height: '1.5rem'}} />
            <span className="notification-badge"></span>
          </button>
          <div className="profile-avatar">
            <User style={{width: '1.25rem', height: '1.25rem'}} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;