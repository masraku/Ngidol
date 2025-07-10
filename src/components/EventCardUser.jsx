'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Image,
  OverlayTrigger,
  Tooltip,
  Container,
  Row,
  Col,
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
import '@/style/Event.css';
import { useAuth } from '@/app/user/context/AuthContext';

export default function EventCard({ event }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const pathname = usePathname(); // Detect route change

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  useEffect(() => {
    if (!user || !event?.id) return;

    const checkSavedStatus = async () => {
      try {
        setChecking(true);
        const res = await fetch(`/api/user/events/${event.id}/saved`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          setSaved(data.saved);
        } else {
        }
      } catch (err) {
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
    <Container>
      <Row>
        <Col>
          <Card className="event-showcase-card">
            <div className="event-header-bar" />

            {/* Gambar Event */}
            <div className="event-image-container">
              {event.photos?.[0] ? (
                <Card.Img
                  src={event.photos[0]}
                  alt={event.name}
                  className="event-showcase-image"
                />
              ) : (
                <div className="event-image-placeholder">
                  <div className="event-icon-wrapper">📷</div>
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
                  {event.date.map((d) => formatDate(d)).join(' - ')}
                </div>
                <div className="event-detail-item">
                  <Clock className="event-detail-icon" />
                  {event.time}
                </div>
                <div className="event-detail-item">
                  <GeoAlt className="event-detail-icon" />
                  {event.location}
                </div>
              </div>

              {/* Guest Star */}
              {event.guests?.length > 0 && (
                <div className="event-guest-section">
                  <span className="event-guest-title">Guest Star:</span>
                  <div className="event-guest-avatars">
                    {event.guests.slice(0, 4).map((guest, index) => (
                      <div key={index} className="event-guest-item">
                        <Image
                          src={guest.image}
                          alt={guest.name}
                          className="event-guest-avatar"
                        />
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

              {/* Aksi */}
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
        </Col>
      </Row>
    </Container>
  );
}
