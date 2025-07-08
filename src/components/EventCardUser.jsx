'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, Badge, Button, Image, OverlayTrigger, Tooltip, Container, Row, Col } from 'react-bootstrap';
import { Calendar, Clock, GeoAlt, Bookmark, BookmarkCheck } from 'react-bootstrap-icons';
import '@/style/Event.css'; // Update the import path
import { useAuth } from '@/app/user/context/AuthContext';

export default function EventCard({ event }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) return;

      const res = await fetch(`/api/user/events/${event.id}/saved`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved); // misal: { saved: true }
      }
    };

    checkSavedStatus();
  }, [user]);

  const handleSaveEvent = async () => {
    if (!user || saving) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/user/events/${event.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Gagal menyimpan event');
      setSaved(true);
    } catch (err) {
      console.error('Save event failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card className="event-showcase-card">
            {/* Header */}
            <div className="event-header-bar" />

            {/* Gambar Event */}
            <div className="event-image-container">
              {event.photos?.[0] ? (
                <Card.Img
                  src={event.photos[0]} // Ensure to access the first photo
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
                <div className="event-price-badge">
                  {event.htm}
                </div>
              )}

              <div className="event-gradient-overlay" />
            </div>

            {/* Body */}
            <Card.Body className="event-showcase-body">
              <div className="event-category-slug">
                {event.category?.name || 'Tanpa Kategori'}
              </div>

              <Card.Title className="event-showcase-title">
                {event.name}
              </Card.Title>

              {/* Info Date, Time, Location */}
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
                        <div className="event-guest-name">
                          {guest.name}
                        </div>
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

              {/* Tombol Aksi */}
              <div className="event-showcase-actions d-flex justify-content-between align-items-center">
                <Button
                  as={Link}
                  href={`/user/event/${event.slug}`}
                  className="btn-event-detail"
                >
                  Lihat Event
                </Button>

                {/* Tombol Simpan */}
                {user?.role === 'user' && (
                  <OverlayTrigger
                    overlay={
                      <Tooltip>{saved ? 'Sudah Disimpan' : 'Simpan Event'}</Tooltip>
                    }
                  >
                    <Button
                      variant={saved ? 'success' : 'outline-primary'}
                      size="sm"
                      onClick={handleSaveEvent}
                      disabled={saving || saved}
                    >
                      {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </Button>
                  </OverlayTrigger>
                )}
              </div>
            </Card.Body>

            {/* Footer */}
            <div className="event-footer-bar" />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
