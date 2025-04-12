"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Calendar, Clock, GeoAlt, Instagram, ArrowLeft } from 'react-bootstrap-icons';
import { guestOptions } from '@/data/guestOptions';

export default function EventDetailClient({ event }) {
  // Format date as string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  // Calculate the event duration
  const getEventDuration = (dates) => {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    return diffDays;
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <Button
            as={Link}
            href="/"
            variant="outline-secondary"
            className="d-flex align-items-center"
          >
            <ArrowLeft className="me-2" /> Kembali ke daftar event
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h1 className="mb-3">{event.name}</h1>
              <Badge bg="primary" className="mb-4">{event.category}</Badge>

              {event.photos?.[0] && (
                <div className="mb-4">
                  <Image
                    src={event.photos[0]}
                    alt={event.name}
                    width={800}
                    height={400}
                    className="img-fluid rounded"
                  />
                </div>
              )}

              <div className="bg-light p-4 rounded mb-4">
                <Row>
                  <Col md={6} className="mb-3 mb-md-0">
                    <div className="d-flex align-items-center mb-3">
                      <Calendar className="me-2 text-primary" />
                      <div>
                        <small className="text-muted d-block">Tanggal</small>
                        <strong>{event.date.map(d => formatDate(d)).join(' & ')}</strong> {/* Join all dates */}
                        <p className="mb-0">({getEventDuration(event.date)} Hari)</p> {/* Show event duration */}
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <Clock className="me-2 text-primary" />
                      <div>
                        <small className="text-muted d-block">Waktu</small>
                        <strong>{event.time}</strong>
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <GeoAlt className="me-2 text-primary" />
                      <div>
                        <small className="text-muted d-block">Lokasi</small>
                        <strong>{event.location}</strong>
                      </div>
                    </div>

                    {event.link && (
                      <div className='d-flex align-items-center mt-3'>
                        <Instagram className='me-2 text-primary' />
                        <div>
                          <small className="text-muted d-block">Instagram</small>
                          <Link href={event.link} target="_blank" className="text-decoration-none text-primary">
                            <strong>
                              {new URL(event.link).hostname + new URL(event.link).pathname.slice(0, 15) + '...'}
                            </strong>
                          </Link>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>

              {Array.isArray(event.guest) && event.guest.length > 0 && (
                <>
                  <h5 className="mb-3">Guest Star</h5>
                  <div className="d-flex flex-wrap gap-3 mb-4">
                    {event.guest.map((guestName, index) => {
                      const guest = guestOptions.find(g => g.name === guestName);
                      return guest ? (
                        <div
                          key={index}
                          className="text-center"
                          style={{ width: 80 }}
                        >
                          <Image
                            src={guest.image}
                            alt={guest.label}
                            width={60}
                            height={60}
                            className="rounded-circle border border-secondary shadow-sm"
                          />
                          <div className="mt-2 small">{guest.name}</div>
                        </div>
                      ) : (
                        <Badge key={index} bg="secondary">{guestName}</Badge>
                      );
                    })}
                  </div>
                </>
              )}

              <h5 className="mb-3">Harga Tiket</h5>
              <p className="fs-5 fw-bold">{event.htm}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
