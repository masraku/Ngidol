'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import EventCard from './EventCard';
import axios from 'axios';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Fetch data dari API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/event');
        setEvents(res.data);
      } catch (err) {
        console.error('Gagal fetch event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Ambil semua kategori unik dari data event
  const uniqueCategories = Array.from(new Set(events.map(event => event.category)));
  const categories = ['Semua', ...uniqueCategories];

  // Filter event berdasarkan search dan kategori
  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.guest?.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesCategory =
      selectedCategory === 'Semua' || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });


  return (
    <Container fluid className="py-5 bg-light">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <h1 className="display-4 fw-bold mb-3">Jadwal Event</h1>
          <p className="lead text-muted">Temukan event menarik yang akan datang</p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <InputGroup>
                    <InputGroup.Text><Search /></InputGroup.Text>
                    <Form.Control
                      placeholder="Cari event atau guest star..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-center py-5">
              <h5>Tidak ada event yang ditemukan</h5>
              <p>Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
