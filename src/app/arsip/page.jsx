'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import EventCard from '@/components/EventCard';

export default function ArsipEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/event/arsip');
        setEvents(res.data); // Data dari backend sudah berupa arsip
      } catch (err) {
        console.error('Gagal fetch event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Arsip Event</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : events.length > 0 ? (
        <Row className="justify-content-center">
          <Col md={8}>
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </Col>
        </Row>
      ) : (
        <div className="text-center py-5">
          <h5>Tidak ada event diarsipkan</h5>
        </div>
      )}
    </Container>
  );
}
