'use client';
import '@/style/Dashboard.css';
import { Users, Calendar, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [users, setUsers] = useState(0);
  const [idols, setIdols] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [idolsRes, eventsRes, notifsRes, usersRes] = await Promise.all([
          fetch('/api/idol'),
          fetch('/api/event'),
          fetch('/api/notification'),
          fetch('/api/user')
        ]);

        const idolsData = await idolsRes.json();
        const eventsData = await eventsRes.json();
        const usersData = await usersRes.json();
        const notifsData = await notifsRes.json();

        setIdols(idolsData);
        setEvents(eventsData.data || []);
        setNotifications(notifsData.data || []);
        setUsers(usersData.total || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date) / 1000); // in seconds

    if (diff < 60) return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  return (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div>
              <p className="dashboard-label">Total Idol</p>
              <p className="dashboard-value">{idols.length}</p>
            </div>
            <Users className="dashboard-icon purple" />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div>
              <p className="dashboard-label">Total Event</p>
              <p className="dashboard-value">{events.length}</p>
            </div>
            <Calendar className="dashboard-icon green" />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div>
              <p className="dashboard-label">Total User Aktif</p>
              <p className="dashboard-value">{users}</p>
            </div>
            <Heart className="dashboard-icon red" />
          </div>
        </div>


        <div className="dashboard-card">
          <div className="dashboard-card-content">
            <div>
              <p className="dashboard-label">Rating</p>
              <p className="dashboard-value">4.8</p>
            </div>
            <Star className="dashboard-icon yellow" />
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="dashboard-card">
        <h3 className="dashboard-title">Selamat Datang di Muchitsujo Admin</h3>
        <p className="dashboard-text">
          Kelola idol dan event Anda dengan mudah melalui dashboard ini.
          Gunakan menu sidebar untuk navigasi ke berbagai fitur yang tersedia.
        </p>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-card">
        <h3 className="dashboard-title">Aktivitas Terbaru</h3>
        <div className="dashboard-activity-list">
          {notifications.length === 0 ? (
            <p className="dashboard-text">Belum ada aktivitas terbaru.</p>
          ) : (
            notifications
              .slice(0, 5)
              .map((notif) => (
                <div key={notif.id} className="dashboard-activity-item">
                  <div className="dashboard-activity-info">
                    <div className={`dot ${notif.type === 'idol' ? 'green' : notif.type === 'event' ? 'blue' : 'violet'}`} />
                    <span className="dashboard-text">{notif.message}</span>
                  </div>
                  <span className="dashboard-time">{formatTimeAgo(notif.createdAt)}</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
