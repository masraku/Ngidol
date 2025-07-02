'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Database } from 'lucide-react';

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    style={{
      position: 'relative',
      display: 'inline-flex',
      height: '1.5rem',
      width: '2.75rem',
      alignItems: 'center',
      borderRadius: '9999px',
      backgroundColor: checked ? '#4f46e5' : '#e5e7eb',
      transition: 'background-color 0.15s ease',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    <span 
      style={{
        display: 'inline-block',
        height: '1rem',
        width: '1rem',
        transform: checked ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
        borderRadius: '50%',
        backgroundColor: 'white',
        transition: 'transform 0.15s ease'
      }}
    />
  </button>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'Admin Muchitsujo',
    email: 'admin@muchitsujo.site',
    phone: '+62 812 3456 7890',
    bio: 'Administrator Muchitsujo Event Management System'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    newIdolAlerts: true,
    systemUpdates: true
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY'
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = () => {
    alert('Pengaturan berhasil disimpan!');
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'preferences', label: 'Preferensi', icon: Palette },
    { id: 'system', label: 'Sistem', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="card">
        <div style={{borderBottom: '1px solid #e5e7eb'}}>
          <nav className="flex" style={{gap: '2rem', padding: '0 1.5rem'}}>
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem 0.25rem',
                    borderBottom: activeTab === tab.id ? '2px solid #4f46e5' : '2px solid transparent',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    color: activeTab === tab.id ? '#4f46e5' : '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease'
                  }}
                >
                  <IconComponent style={{width: '1.25rem', height: '1.25rem', marginRight: '0.5rem'}} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Profil Admin</h3>
              
              <div className="grid grid-cols-2" style={{gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group" style={{gridColumn: 'span 2'}}>
                  <label className="form-label">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    className="form-input form-textarea"
                    style={{height: '4rem'}}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Pengaturan Notifikasi</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                  </div>
                  <ToggleSwitch
                    checked={notifications.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Push Notifications</p>
                    <p className="text-sm text-gray-600">Terima notifikasi push di browser</p>
                  </div>
                  <ToggleSwitch
                    checked={notifications.pushNotifications}
                    onChange={() => handleNotificationChange('pushNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Terima notifikasi melalui SMS</p>
                  </div>
                  <ToggleSwitch
                    checked={notifications.smsNotifications}
                    onChange={() => handleNotificationChange('smsNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Event Reminders</p>
                    <p className="text-sm text-gray-600">Pengingat untuk event yang akan datang</p>
                  </div>
                  <ToggleSwitch
                    checked={notifications.eventReminders}
                    onChange={() => handleNotificationChange('eventReminders')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">New Idol Alerts</p>
                    <p className="text-sm text-gray-600">Notifikasi saat ada idol baru ditambahkan</p>
                  </div>
                  <ToggleSwitch
                    checked={notifications.newIdolAlerts}
                    onChange={() => handleNotificationChange('newIdolAlerts')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Keamanan</h3>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Masukkan password saat ini"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Masukkan password baru"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Konfirmasi password baru"
                  />
                </div>
                
                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fbbf24',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <p style={{fontSize: '0.875rem', color: '#92400e'}}>
                    <strong>Tips Keamanan:</strong> Gunakan password yang kuat dengan kombinasi huruf besar, huruf kecil, angka, dan simbol.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Preferensi Tampilan</h3>
              
              <div className="grid grid-cols-2" style={{gap: '1.5rem'}}>
                <div className="form-group">
                  <label className="form-label">
                    Tema
                  </label>
                  <select
                    name="theme"
                    value={preferences.theme}
                    onChange={handlePreferenceChange}
                    className="form-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Bahasa
                  </label>
                  <select
                    name="language"
                    value={preferences.language}
                    onChange={handlePreferenceChange}
                    className="form-select"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={preferences.timezone}
                    onChange={handlePreferenceChange}
                    className="form-select"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Format Tanggal
                  </label>
                  <select
                    name="dateFormat"
                    value={preferences.dateFormat}
                    onChange={handlePreferenceChange}
                    className="form-select"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Informasi Sistem</h3>
              
              <div className="grid grid-cols-2" style={{gap: '1.5rem'}}>
                <div className="bg-gray-50 p-4" style={{borderRadius: '0.5rem'}}>
                  <h4 className="font-medium text-gray-700 mb-4">Versi Aplikasi</h4>
                  <p className="text-gray-600">v2.1.0</p>
                </div>
                
                <div className="bg-gray-50 p-4" style={{borderRadius: '0.5rem'}}>
                  <h4 className="font-medium text-gray-700 mb-4">Update Terakhir</h4>
                  <p className="text-gray-600">1 Juli 2025</p>
                </div>
                
                <div className="bg-gray-50 p-4" style={{borderRadius: '0.5rem'}}>
                  <h4 className="font-medium text-gray-700 mb-4">Database Status</h4>
                  <p style={{color: '#10b981'}}>Connected</p>
                </div>
                
                <div className="bg-gray-50 p-4" style={{borderRadius: '0.5rem'}}>
                  <h4 className="font-medium text-gray-700 mb-4">Server Status</h4>
                  <p style={{color: '#10b981'}}>Online</p>
                </div>
              </div>
              
              <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                <button className="btn" style={{backgroundColor: '#3b82f6', color: 'white'}}>
                  Cek Update
                </button>
                <button className="btn" style={{backgroundColor: '#f59e0b', color: 'white'}}>
                  Backup Data
                </button>
                <button className="btn" style={{backgroundColor: '#ef4444', color: 'white'}}>
                  Reset Settings
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end" style={{paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', marginTop: '1.5rem'}}>
            <button
              onClick={saveSettings}
              className="btn btn-primary"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}