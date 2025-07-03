'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { Calendar, Clock, GeoAlt } from 'react-bootstrap-icons';
import '@/style/Event.css'; 
import { useAuth } from '@/app/user/context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function EventCard({ event, onDeleteSuccess }) {
  const { user } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: 'Hapus Event?',
      text: `Apakah Anda yakin ingin menghapus event "${event.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    });

    if (!confirm.isConfirmed) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/event/${event.slug}`);
      Swal.fire({
        icon: 'success',
        title: 'Event Dihapus',
        text: `Event "${event.name}" berhasil dihapus.`,
        confirmButtonColor: '#8B0000',
      });
      // Refresh atau trigger parent update
      if (onDeleteSuccess) onDeleteSuccess(event.slug);
      else router.refresh(); // fallback jika tidak ada callback
    } catch (err) {
      console.error('Gagal menghapus event:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: err.response?.data?.message || 'Terjadi kesalahan saat menghapus event.',
        confirmButtonColor: '#8B0000',
      });
    } finally {
      setDeleting(false);
    }
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
        <div className="event-showcase-actions d-flex gap-2 flex-wrap">
          <Button
            as={Link}
            href={`/admin/event/${event.slug}`}
            className="btn-event-detail"
          >
            Lihat Event
          </Button>

          {user && (
            <>
              <Button
                as={Link}
                href={`/admin/event/edit/${event.slug}`}
                className="btn-event-edit"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </Button>
            </>
          )}
        </div>
      </Card.Body>

      {/* Footer bar bawah */}
      <div className="event-footer-bar" />
    </Card>
  );
}
