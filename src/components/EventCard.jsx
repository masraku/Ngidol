'use client';

import Link from 'next/link';
import { Card, Badge, Row, Col, Button, Image } from 'react-bootstrap';
import { Calendar, Clock, GeoAlt, Star } from 'react-bootstrap-icons';
import { useAuth } from '@/app/context/AuthContext'; // asumsi path context-nya ini

export default function EventCard({ event }) {
  const { user } = useAuth(); // Ambil user dari context

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <Card className="mb-4 shadow-sm border-0 event-card">
      <Card.Body>
        <Row>
          <Col md={3} className="mb-3 mb-md-0 text-center">
            <div className="p-3 bg-primary text-white rounded mb-3">
              <h3>{new Date(event.date).getDate()}</h3>
              <p className="mb-0">{formatDate(event.date).split(',')[1]}</p>
            </div>

            {event.photos && event.photos.length > 0 && (
              <Image
                src={event.photos[0]}
                alt={event.name}
                fluid
                rounded
                className="shadow-sm"
              />
            )}
          </Col>

          <Col md={9}>
            <h4 className="mb-2">{event.name}</h4>
            <Badge bg="secondary" className="mb-3">{event.category}</Badge>

            <div className="d-flex align-items-center mb-2">
              <Calendar className="me-2" />
              <span>{formatDate(event.date)}</span>
            </div>

            <div className="d-flex align-items-center mb-2">
              <Clock className="me-2" />
              <span>{event.time}</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <GeoAlt className="me-2" />
              <span>{event.location}</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <Star className="me-2" />
              <span><strong>Guest Star:</strong> {event.guest?.join(', ')}</span>
            </div>

            <Button as={Link} href={`/event/${event.id}`} variant="outline-primary" className="me-2">
              Lihat Detail
            </Button>

            {user && (
              <Button as={Link} href={`/event/edit/${event.id}`} variant="outline-warning">
                Edit Event
              </Button>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
