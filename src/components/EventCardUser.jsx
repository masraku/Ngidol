'use client';

import Link from 'next/link';
import { Card, Badge, Button, Image } from 'react-bootstrap';
import { Calendar, Clock, GeoAlt } from 'react-bootstrap-icons';
import '@/style/Event.css'; 
import { useAuth } from '@/app/user/context/AuthContext';

export default function EventCard({ event }) {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <Card className="event-showcase-card">
      {/* Header bar atas */}
      <div className="event-header-bar" />

      {/* Gambar Event */}
      <div className="event-image-container">
        {event.photos?.[0] ? (
          <Card.Img
            src={event.photos}
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
        <div className="event-showcase-actions">
          <Button
            as={Link}
            href={`/user/event/${event.slug}`}
            className="btn-event-detail"
          >
            Lihat Event
          </Button>
        </div>
      </Card.Body>

      {/* Footer bar bawah */}
      <div className="event-footer-bar" />
    </Card>
  );
}
