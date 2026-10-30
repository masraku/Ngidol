'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';
import EventCard from '@/components/EventCard';

const REQUEST_TIMEOUT_MS = 15000;

export default function ArsipEvent() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchEvents = async () => {
      setStatus('loading');

      try {
        const res = await axios.get('/api/event/arsip', { timeout: REQUEST_TIMEOUT_MS });
        if (!active) return;

        const data = Array.isArray(res.data) ? res.data : res.data?.data;
        setEvents(Array.isArray(data) ? data : []);
        setStatus('ready');
      } catch (err) {
        if (!active) return;

        console.error('Gagal fetch event:', err);
        setEvents([]);
        setStatus('error');
      }
    };

    fetchEvents();

    return () => {
      active = false;
    };
  }, [reloadKey]);

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
          {status === 'loading' && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" role="status" aria-label="Memuat arsip event" />
              <p className="text-muted mt-3 mb-0">Memuat arsip event...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-5">
              <h5 className="fw-semibold">Gagal memuat arsip event</h5>
              <p className="text-muted">
                Sambungan ke server bermasalah. Coba muat ulang sebentar lagi.
              </p>
              <Button variant="outline-secondary" onClick={() => setReloadKey((key) => key + 1)}>
                Coba lagi
              </Button>
            </div>
          )}

          {status === 'ready' && events.length === 0 && (
            <div className="text-center py-5">
              <h5 className="fw-semibold">Tidak ada event diarsipkan</h5>
              <p className="text-muted mb-0">
                Semua event saat ini masih berlangsung atau belum selesai.
              </p>
            </div>
          )}

          {status === 'ready' && events.length > 0 && (
            <Row>
              {events.map((event) => (
                <Col key={event.id} xs={12} sm={6} md={4} className="mb-4">
                  <EventCard event={event} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}
