'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { Container, Row, Col } from 'react-bootstrap';
import CardIdol from '@/components/IdolCardUser';

export default function IdolPage() {
  const [idols, setIdols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdols = async () => {
      try {
        const res = await axios.get('/api/idol');
        console.log('Data idol:', res.data);
        setIdols(res.data || []);
      } catch (err) {
        console.error('Gagal fetch idol:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdols();
  }, []);

  return (
    <Container className="my-4">
      <h3 className="fw-semibold text-center mb-4">Idoru!</h3>

      {loading ? (
        <p>Loading...</p>
      ) : idols.length === 0 ? (
        <p className="text-muted">Tidak ada idol ditemukan.</p>
      ) : (
        <Row className="g-4">
          {idols.map((idol) => (
            <Col key={idol.id} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
              <CardIdol idol={idol} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}