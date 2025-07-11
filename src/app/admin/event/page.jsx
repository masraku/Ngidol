'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Pagination } from 'react-bootstrap';
import EventCard from '@/components/EventCard';

export default function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/event`);
        const data = res.data;
        setEvents(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error('Gagal fetch event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  const upcomingEvents = events.filter((event) => {
    const dates = Array.isArray(event.date) ? event.date : [event.date];
    return dates.some((d) => new Date(d) >= today);
  });

  const completedEvents = events.filter((event) => {
    const dates = Array.isArray(event.date) ? event.date : [event.date];
    return dates.every((d) => new Date(d) < today);
  });

  return (
    <Container className="py-4 bg-gradient-custom">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Daftar Event</h3>
        <Link href="/admin/event/add" passHref legacyBehavior>
          <Button className="d-flex align-items-center gap-2 btn-custom">
            <Plus size={18} />
            Tambah Event
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {/* Statistik */}
          <Row className="mb-4 g-4">
            <Col xs={12} md={4}>
              <Card className="kartu-statistik kartu-upcoming">
                <h4>{upcomingEvents.length}</h4>
                <p>Event Mendatang</p>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="kartu-statistik kartu-selesai">
                <h4>{completedEvents.length}</h4>
                <p>Event Selesai</p>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="kartu-statistik kartu-total">
                <h4>{events.length}</h4>
                <p>Total Event di Halaman</p>
              </Card>
            </Col>
          </Row>




          {/* Upcoming */}
          {upcomingEvents.length > 0 && (
            <>
              <h5 className="fw-semibold mb-3">Event Mendatang</h5>
              <Row className="mb-4">
                {upcomingEvents.map((event) => (
                  <Col key={event.id} md={4} className="mb-4">
                    <EventCard event={event} />
                  </Col>
                ))}
              </Row>
            </>
          )}

          {/* Completed */}
          {completedEvents.length > 0 && (
            <>
              <h5 className="fw-semibold mb-3">Event Selesai</h5>
              <Row className="mb-4">
                {completedEvents.map((event) => (
                  <Col key={event.id} md={4} className="mb-4">
                    <EventCard event={event} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}
    </Container>
  );
}
