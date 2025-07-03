'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Calendar, Settings, Plus, LogOut } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname === path;
  const isParentActive = (paths) => paths.some(path => pathname.startsWith(path));

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/user');
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Muchitsujo Admin</h1>
      </div>

      <nav className="sidebar-nav">
        {/* Dashboard */}
        <div className="nav-item">
          <Link href="/admin" className={`nav-button ${isActive('/admin') ? 'active' : ''}`}>
            <div className="nav-button-content">
              <Home className="nav-icon" />
              Dashboard
            </div>
          </Link>
        </div>

        {/* Manajemen Idol */}
        <div className="nav-item">
          <div className={`nav-button ${isParentActive(['/admin/idol']) ? 'active' : ''}`}>
            <div className="nav-button-content">
              <Users className="nav-icon" />
              Manajemen Idol
            </div>
          </div>
          <div className="sub-menu">
            <Link href="/admin/idol/add" className={`sub-button ${isActive('/admin/idol/add') ? 'active' : ''}`}>
              <Plus className="sub-icon" />
              Tambah Idol
            </Link>
            <Link href="/admin/idol" className={`sub-button ${isActive('/admin/idol') ? 'active' : ''}`}>
              <Users className="sub-icon" />
              Daftar Idol
            </Link>
          </div>
        </div>

        {/* Manajemen Event */}
        <div className="nav-item">
          <div className={`nav-button ${isParentActive(['/admin/event']) ? 'active' : ''}`}>
            <div className="nav-button-content">
              <Calendar className="nav-icon" />
              Manajemen Event
            </div>
          </div>
          <div className="sub-menu">
            <Link href="/admin/event/add" className={`sub-button ${isActive('/admin/event/add') ? 'active' : ''}`}>
              <Plus className="sub-icon" />
              Tambah Event
            </Link>
            <Link href="/admin/event" className={`sub-button ${isActive('/admin/event') ? 'active' : ''}`}>
              <Calendar className="sub-icon" />
              Daftar Event
            </Link>
          </div>
        </div>

        {/* Settings */}
        <div className="nav-item" style={{ marginTop: '1rem' }}>
          <Link href="/admin/settings" className={`nav-button ${isActive('/admin/settings') ? 'active' : ''}`}>
            <div className="nav-button-content">
              <Settings className="nav-icon" />
              Pengaturan
            </div>
          </Link>
        </div>

        {/* Logout */}
        <div className="nav-item" style={{ marginTop: '1rem' }}>
          <button onClick={handleLogout} className="nav-button logout-button">
            <div className="nav-button-content">
              <LogOut className="nav-icon" />
              Logout
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
