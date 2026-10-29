'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Image,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {
  Calendar,
  Clock,
  GeoAlt,
  Bookmark,
  BookmarkCheck,
  InfoCircle,
} from 'react-bootstrap-icons';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/user/context/AuthContext';

export default function EventCard({ event }) {
  const auth = useAuth() || {};
  const { user } = auth;
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const pathname = usePathname();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'TBA';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const eventDates = Array.isArray(event.date) ? event.date : event.date ? [event.date] : [];
  const eventPhoto = Array.isArray(event.photos) ? event.photos[0] : event.photos;

  useEffect(() => {
    if (!user || !event?.id) return;

    const checkSavedStatus = async () => {
      try {
        setChecking(true);
        const res = await fetch(`/api/user/events/${event.id}/saved`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) return;
        const data = await res.json();
        setSaved(data.saved);
      } catch {
      } finally {
        setChecking(false);
      }
    };

    checkSavedStatus();
  }, [user?.id, event?.id, pathname]);



  const handleToggleSave = async () => {
    if (!user || saving) return;

    try {
      setSaving(true);

      const method = saved ? 'DELETE' : 'POST';
      const res = await fetch(`/api/user/events/${event.id}/save`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Gagal toggle simpan event');
      setSaved(!saved);
    } catch (err) {
      console.error('Toggle simpan event gagal:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="event-showcase-card community-event-card">
      <div className="event-header-bar" />

      <div className="event-image-container">
        {eventPhoto ? (
          <Card.Img
            src={eventPhoto}
            alt={event.name}
            className="event-showcase-image"
          />
        ) : (
          <div className="event-image-placeholder">
            <div className="event-icon-wrapper">IMG</div>
            <small>No Image</small>
          </div>
        )}

        {event.htm && (
          <div className="event-price-badge">{event.htm}</div>
        )}

        <div className="event-gradient-overlay" />
      </div>

      <Card.Body className="event-showcase-body">
        <div className="event-category-slug">
          {event.category?.name || 'Tanpa Kategori'}
        </div>

        <Card.Title className="event-showcase-title">
          {event.name}
        </Card.Title>

        <div className="event-details-info">
          <div className="event-detail-item">
            <Calendar className="event-detail-icon" />
            {eventDates.length > 0 ? eventDates.map((date) => formatDate(date)).join(' - ') : 'Tanggal TBA'}
          </div>
          <div className="event-detail-item">
            <Clock className="event-detail-icon" />
            {event.time || 'Waktu TBA'}
          </div>
          <div className="event-detail-item">
            <GeoAlt className="event-detail-icon" />
            {event.location || 'Lokasi TBA'}
          </div>
        </div>

        {event.guests?.length > 0 && (
          <div className="event-guest-section">
            <span className="event-guest-title">Guest Star:</span>
            <div className="event-guest-avatars">
              {event.guests.slice(0, 4).map((guest) => (
                <div key={guest.id || guest.name} className="event-guest-item">
                  {guest.image ? (
                    <Image
                      src={guest.image}
                      alt={guest.name}
                      className="event-guest-avatar"
                    />
                  ) : (
                    <div className="event-guest-avatar event-guest-avatar--empty">
                      {guest.name?.slice(0, 1) || '?'}
                    </div>
                  )}
                  <div className="event-guest-name">{guest.name}</div>
                </div>
              ))}
              {event.guests.length > 4 && (
                <div className="event-guest-count-badge">
                  +{event.guests.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="event-showcase-actions d-flex justify-content-between align-items-center">
          <Button
            as={Link}
            href={`/user/event/${event.slug}`}
            className="btn-event-detail"
          >
            Lihat Event
          </Button>

          {user?.role === 'user' && (
            <div className="d-flex gap-2 align-items-center">
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    {saved ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                  </Tooltip>
                }
              >
                <Button
                  variant={saved ? 'success' : 'outline-primary'}
                  size="sm"
                  onClick={handleToggleSave}
                  disabled={saving || checking}
                >
                  {saved ? (
                    <BookmarkCheck size={18} />
                  ) : (
                    <Bookmark size={18} />
                  )}
                </Button>

              </OverlayTrigger>

              <OverlayTrigger
                overlay={
                  <Tooltip>
                    {saved ? 'Event ini disimpan' : 'Belum disimpan'}
                  </Tooltip>
                }
              >
                <span className="text-muted">
                  <InfoCircle size={16} />
                </span>
              </OverlayTrigger>
            </div>
          )}
        </div>
      </Card.Body>

      <div className="event-footer-bar" />
    </Card>
  );
}
