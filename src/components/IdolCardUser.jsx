'use client';

import Link from 'next/link';
import { Card, Button, Badge } from 'react-bootstrap';
import { MusicNote } from 'react-bootstrap-icons';
import { useAuth } from '@/app/user/context/AuthContext';
import '@/style/CardIdol.css'; // Import custom styles for the idol card

export default function CardIdol({ idol }) {
  const { user } = useAuth();
  const totalSongs = idol.songs?.length || 0;

  return (
    <Card className="idol-card">
      {/* Garis header atas */}
      <div className="idol-header-bar" />

      {/* Gambar Idol */}
      <div className="idol-image-container">
        {idol.image ? (
          <Card.Img
            src={idol.image}
            alt={idol.name}
            className="idol-image"
          />
        ) : (
          <div className="idol-image-placeholder">
            <div className="icon-wrapper">
              <MusicNote size={24} />
            </div>
            <small>No Image</small>
          </div>
        )}

        {/* Badge jumlah member */}
        {idol.members?.length > 0 && (
          <Badge className="idol-member-badge">
            {idol.members.length}
          </Badge>
        )}

        <div className="idol-gradient-overlay" />
      </div>

      {/* Body */}
      <Card.Body className="idol-card-body">
        <small className="idol-slug">
          {idol.category?.name
            ? `Kategori: ${idol.category.name}`
            : 'Tanpa Kategori'}
        </small>

        <Card.Title className="idol-title">
          {idol.name}
        </Card.Title>

        <Card.Text className="idol-description">
          {idol.description || 'Tanpa deskripsi'}
        </Card.Text>

        {totalSongs > 0 && (
          <div className="idol-spotify-info">
            <div className="icon-circle">
              <MusicNote size={12} color="white" />
            </div>
            <small>
              {totalSongs} Lagu di Spotify
            </small>
          </div>
        )}

        <div className="idol-actions">
          <Button
            as={Link}
            href={`/user/idol/${idol.slug}`}
            size="sm"
            className="btn-idol-detail"
          >
            Detail
          </Button>
        </div>
      </Card.Body>

      <div className="idol-footer-bar" />
    </Card>
  );
}