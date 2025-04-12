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
        setEvents(res.data);
      } catch (err) {
        console.error('Gagal fetch event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Cek apakah event sudah lebih dari 1 hari lewat
  const isPastEvent = (eventDateStr) => {
    const eventDate = new Date(eventDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today ke tengah malam

    // Hitung selisih waktu dalam hari
    const diffTime = Math.abs(today - eventDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Ubah ms ke hari
    return diffDays > 0; // Jika event sudah lebih dari 1 hari, baru masuk arsip
  };

  // Filter event yang sudah lewat
  const archivedEvents = events.filter(event => isPastEvent(event.date));

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Arsip Event</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : archivedEvents.length > 0 ? (
        <Row className="justify-content-center">
          <Col md={8}>
            {archivedEvents.map(event => (
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
