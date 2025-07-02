'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Calendar, Clock, GeoAlt, Instagram, ArrowLeft, Star } from 'react-bootstrap-icons';
import '@/style/EventDetail.css';

export default function EventDetailClient({ event }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  const getEventDuration = (dates) => {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const createSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  return (
    <div className="event-detail-container">
      <Container className="py-4">
        {/* Tombol Kembali */}
        <div className="mb-3">
          <Button
            as={Link}
            href="/"
            variant="link"
            className="event-back-btn d-inline-flex align-items-center"
          >
            <ArrowLeft className="me-2" size={16} /> Kembali
          </Button>
        </div>

        {/* Gambar Event di Tengah */}
        {event.photos && event.photos.length > 0 && (
          <div className="event-main-image-wrapper">
            <Image
              src={event.photos[0]}
              alt={event.name}
              width={800}
              height={400}
              className="event-detail-image img-fluid"
            />
          </div>
        )}

        {/* Konten Event */}
        <div className="event-detail-content-wrapper text-center mt-4">
          <Badge className="event-category-badge mb-3">{event.category?.name || 'Tanpa Kategori'}</Badge>
          <h1 className="event-detail-title mb-4">{event.name}</h1>

          <Row className="justify-content-center event-info-grid mb-4">
            <Col md={6} className="mb-3">
              <Card className="event-info-card h-100 border-0">
                <Card.Body className="d-flex align-items-center p-3">
                  <div className="event-info-icon me-3">
                    <Calendar />
                  </div>
                  <div className="flex-grow-1 text-start">
                    <small className="event-info-label d-block text-muted">Tanggal</small>
                    <div className="event-info-value fw-bold">
                      {event.date.map(d => formatDate(d)).join(' & ')}
                    </div>
                    <small className="event-duration text-primary fw-semibold">
                      ({getEventDuration(event.date)} Hari)
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-3">
              <Card className="event-info-card h-100 border-0">
                <Card.Body className="d-flex align-items-center p-3">
                  <div className="event-info-icon me-3">
                    <Clock />
                  </div>
                  <div className="flex-grow-1 text-start">
                    <small className="event-info-label d-block text-muted">Waktu</small>
                    <div className="event-info-value fw-bold">{event.time}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-3">
              <Card className="event-info-card h-100 border-0">
                <Card.Body className="d-flex align-items-center p-3">
                  <div className="event-info-icon me-3">
                    <GeoAlt />
                  </div>
                  <div className="flex-grow-1 text-start">
                    <small className="event-info-label d-block text-muted">Lokasi</small>
                    <div className="event-info-value fw-bold">{event.location}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {event.link && (
              <Col md={6} className="mb-3">
                <Card className="event-info-card h-100 border-0">
                  <Card.Body className="d-flex align-items-center p-3">
                    <div className="event-info-icon me-3">
                      <Instagram />
                    </div>
                    <div className="flex-grow-1 text-start">
                      <small className="event-info-label d-block text-muted">Instagram</small>
                      <Link
                        href={event.link}
                        target="_blank"
                        className="event-instagram-link text-decoration-none fw-bold"
                      >
                        {new URL(event.link).hostname + new URL(event.link).pathname.slice(0, 15) + '...'}
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>

          {/* Guest Star */}
          {Array.isArray(event.guests) && event.guests.length > 0 && (
            <div className="event-guest-section mb-4 text-start">
              <div className="d-flex align-items-center mb-3 text-primary">
                <Star className="me-2" />
                <h5 className="mb-0 fw-bold">Guest Star</h5>
              </div>
              <Row className="event-guest-grid">
                {event.guests.map((guest, index) => {
                  const guestSlug = createSlug(guest.name);

                  return (
                    <Col key={index} xs={6} sm={4} md={3} className="mb-3">
                      <Link
                        href={`/user/idol/${guestSlug}`}
                        className="event-guest-card text-decoration-none"
                      >
                        <Card className="h-100 border-0 text-center">
                          <Card.Body className="p-3">
                            <div className="event-guest-image-wrapper position-relative mb-3 mx-auto">
                              <Image
                                src={guest.image}
                                alt={guest.name}
                                width={80}
                                height={80}
                                className="event-guest-image rounded-circle"
                              />
                              <div className="event-guest-hover-overlay position-absolute rounded-circle d-flex align-items-center justify-content-center">
                                <small className="text-white fw-semibold">View Profile</small>
                              </div>
                            </div>
                            <div className="event-guest-name text-dark fw-semibold small">
                              {guest.name}
                            </div>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}

          {/* Harga Tiket */}
          <div className="event-price-section mb-5">
            <div className="d-flex align-items-center justify-content-center mb-3 text-primary">
              <h5 className="mb-0 fw-bold">Harga Tiket</h5>
            </div>
            <Card className="event-price-card border-0 mx-auto" style={{ maxWidth: '300px' }}>
              <Card.Body className="text-center p-4">
                <div className="event-price-display text-white fw-bold fs-4">
                  {event.htm}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
