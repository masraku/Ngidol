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
        setEvents(res.data); // Asumsikan sudah diarsip dari backend
      } catch (err) {
        console.error('Gagal fetch event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Container fluid className="py-5 bg-light">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <h1 className="display-5 fw-bold mb-3">Arsip Event</h1>
          <p className="lead text-muted">Lihat kembali event yang telah selesai</p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={11}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : events.length > 0 ? (
            <Row>
              {events.map(event => (
                <Col key={event.id} xs={12} sm={6} md={4} className="mb-4">
                  <EventCard event={event} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <h5>Tidak ada event diarsipkan</h5>
              <p>Semua event saat ini masih berlangsung atau belum selesai</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
