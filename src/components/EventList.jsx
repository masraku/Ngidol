'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Spinner,
  Button
} from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import EventCard from './EventCardUser';
import axios from 'axios';
import '@/style/EventList.css'; 

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState(['Semua']);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/event');
        setEvents(res.data.data);
      } catch (err) {
        console.error('Gagal fetch event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/category');
        const categoryNames = res.data.data.map((cat) => cat.name);
        setCategories(['Semua', ...categoryNames]);
      } catch (err) {
        console.error('Gagal fetch kategori:', err);
      }
    };

    fetchCategories();
  }, []);

  const isEventUpcoming = (dateData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!dateData || dateData.length === 0) return true;

    if (Array.isArray(dateData)) {
      return dateData.some((dateStr) => {
        const d = new Date(dateStr);
        d.setHours(0, 0, 0, 0);
        return d >= today;
      });
    } else {
      const d = new Date(dateData);
      d.setHours(0, 0, 0, 0);
      return d >= today;
    }
  };

  const filteredEvents = events
    .filter((event) => isEventUpcoming(event.date))
    .filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.guest?.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesCategory =
        selectedCategory === 'Semua' || event.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });

  const visibleEvents = showAll ? filteredEvents : filteredEvents.slice(0, 6);

  return (
    <Container fluid className="py-5 bg-light">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <h1 className="display-4 fw-bold mb-3">Dari konser hingga cosplay</h1>
          <p className="lead text-muted">Gabut? Bingung weekend mau ke mana? semua event seru ada di sini.</p>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text><Search /></InputGroup.Text>
                <Form.Control
                  placeholder="Cari event atau guest star..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'dark' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-pill category-bubble ${selectedCategory === category ? 'active' : ''}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={11}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <Row className="justify-content-center">
                {visibleEvents.map((event) => (
                  <Col
                    key={event.id}
                    xxl={3} // 3 cards per row on extra large screens
                    xl={4}  // 4 cards per row on large screens
                    md={6}  // 2 cards per row on medium screens
                    sm={12} // 1 card per row on small screens
                    className="d-flex justify-content-center mb-4"
                  >
                    <EventCard event={event} />
                  </Col>
                ))}
              </Row>

              {filteredEvents.length > 6 && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline-dark"
                    onClick={() => setShowAll(!showAll)}
                    className="rounded-pill"
                  >
                    {showAll ? 'Sembunyikan Beberapa Event' : 'Lihat Semua Event'}
                  </Button>
                </div>
              )}
            </>
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
