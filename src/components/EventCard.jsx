"use client";

import Link from 'next/link';
import { Card, Badge, Row, Col, Button, Image } from 'react-bootstrap';
import { Calendar, Clock, GeoAlt } from 'react-bootstrap-icons';
import { useAuth } from '@/app/context/AuthContext'; // sesuaikan path
import { guestOptions } from '@/data/guestOptions';

export default function EventCard({ event }) {
  const { user } = useAuth();

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
    <Card className="mb-4 shadow-sm border-0 event-card">
      <Card.Body>
        <Row>
          <Col md={3} className="mb-3 mb-md-0 text-center">
            <div className="p-3 bg-primary text-white rounded mb-3">
              <h3>{new Date(event.date[0]).getDate()}</h3>
              <p className="mb-0">{formatDate(event.date[0]).split(',')[1]}</p>
              <p className="mb-0">({getEventDuration(event.date)} Hari)</p> {/* Show event duration */}
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

            {/* Display all event dates */}
            <div className="d-flex align-items-center mb-2">
              <Calendar className="me-2" />
              <span>{event.date.map(d => formatDate(d)).join(' & ')}</span> {/* Join all dates with ' & ' */}
            </div>

            <div className="d-flex align-items-center mb-2">
              <Clock className="me-2" />
              <span>{event.time}</span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <GeoAlt className="me-2" />
              <span>{event.location}</span>
            </div>

            {Array.isArray(event.guest) && event.guest.length > 0 && (
              <div className="mb-3">
                <strong className="d-block mb-2">Guest Star:</strong>
                <div className="d-flex flex-wrap gap-2">
                  {event.guest.map((guestName, index) => {
                    const guest = guestOptions.find(g => g.name === guestName);
                    return guest ? (
                      <div
                        key={index}
                        className="text-center"
                        style={{ width: 60 }}
                      >
                        <Image
                          src={guest.image}
                          alt={guest.label}
                          width={40}
                          height={40}
                          className="rounded-circle border border-secondary shadow-sm"
                        />
                        <div className="small mt-1">{guest.label}</div>
                      </div>
                    ) : (
                      <Badge key={index} bg="secondary">{guestName}</Badge>
                    );
                  })}
                </div>
              </div>
            )}

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
